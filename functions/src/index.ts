import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import axios from 'axios';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Email configuration
const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: functions.config().email?.user || process.env.EMAIL_USER,
    pass: functions.config().email?.pass || process.env.EMAIL_PASS
  }
};

const transporter = nodemailer.createTransporter(emailConfig);

// Types
interface BookingData {
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  channel: 'website' | 'whatsapp';
}

// Website booking processing function
export const processWebsiteBooking = functions.https.onCall(async (data: BookingData, context) => {
  try {
    // Generate unique booking ID
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create booking object
    const booking = {
      id: bookingId,
      ...data,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'offline', // Default for website bookings
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Save to Firestore
    await db.collection('bookings').doc(bookingId).set(booking);

    // Send notification to business owner
    await sendBusinessOwnerNotification(booking);

    // Send confirmation to customer
    await sendCustomerConfirmation(booking);

    functions.logger.info('Website booking processed successfully', { bookingId });

    return {
      success: true,
      bookingId,
      message: 'Booking submitted successfully! You will receive a confirmation email shortly.'
    };

  } catch (error) {
    functions.logger.error('Error processing website booking:', error);
    throw new functions.https.HttpsError('internal', 'Failed to process booking');
  }
});

// n8n webhook endpoint for WhatsApp bot bookings
export const processWhatsAppBooking = functions.https.onRequest(async (req, res) => {
  try {
    // Verify webhook secret if provided
    const webhookSecret = req.headers['x-webhook-secret'];
    if (functions.config().webhook?.secret && webhookSecret !== functions.config().webhook.secret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const bookingData: BookingData & { paymentStatus?: string; paymentMethod?: string } = req.body;

    // Generate unique booking ID
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create booking object
    const booking = {
      id: bookingId,
      ...bookingData,
      channel: 'whatsapp' as const,
      status: bookingData.paymentStatus === 'paid' ? 'confirmed' : 'pending',
      paymentStatus: bookingData.paymentStatus || 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Save to Firestore
    await db.collection('bookings').doc(bookingId).set(booking);

    // Send notification to business owner
    await sendBusinessOwnerNotification(booking);

    // Send confirmation to customer if email provided
    if (bookingData.customerEmail) {
      await sendCustomerConfirmation(booking);
    }

    functions.logger.info('WhatsApp booking processed successfully', { bookingId });

    res.json({
      success: true,
      bookingId,
      message: 'WhatsApp booking processed successfully'
    });

  } catch (error) {
    functions.logger.error('Error processing WhatsApp booking:', error);
    res.status(500).json({ error: 'Failed to process booking' });
  }
});

// Send notification to business owner
async function sendBusinessOwnerNotification(booking: any) {
  try {
    const ownerEmail = functions.config().notifications?.owner_email || process.env.BUSINESS_OWNER_EMAIL;
    const ownerPhone = functions.config().notifications?.owner_phone || process.env.BUSINESS_OWNER_PHONE;

    if (!ownerEmail) {
      functions.logger.warn('Business owner email not configured');
      return;
    }

    // Email notification
    const emailHtml = generateOwnerEmailTemplate(booking);

    await transporter.sendMail({
      from: emailConfig.auth.user,
      to: ownerEmail,
      subject: `🔔 NEW BOOKING - ${booking.serviceName}`,
      html: emailHtml
    });

    // WhatsApp notification (if phone configured)
    if (ownerPhone) {
      await sendWhatsAppNotification(ownerPhone, generateOwnerWhatsAppMessage(booking));
    }

    functions.logger.info('Business owner notification sent', { bookingId: booking.id });

  } catch (error) {
    functions.logger.error('Error sending business owner notification:', error);
  }
}

// Send confirmation to customer
async function sendCustomerConfirmation(booking: any) {
  try {
    if (!booking.customerEmail) return;

    const emailHtml = generateCustomerEmailTemplate(booking);

    await transporter.sendMail({
      from: emailConfig.auth.user,
      to: booking.customerEmail,
      subject: `Booking Confirmation - ${booking.serviceName}`,
      html: emailHtml
    });

    functions.logger.info('Customer confirmation sent', { bookingId: booking.id });

  } catch (error) {
    functions.logger.error('Error sending customer confirmation:', error);
  }
}

// WhatsApp notification function (placeholder for future implementation)
async function sendWhatsAppNotification(phone: string, message: string) {
  try {
    // This would integrate with WhatsApp Business API or n8n workflow
    functions.logger.info('WhatsApp notification would be sent:', { phone, message });

    // For now, we'll log it. Later integrate with:
    // 1. WhatsApp Business API
    // 2. Twilio WhatsApp
    // 3. n8n WhatsApp workflow

  } catch (error) {
    functions.logger.error('Error sending WhatsApp notification:', error);
  }
}

// Email templates
function generateOwnerEmailTemplate(booking: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Booking Received</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
        .booking-details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; color: #2563eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 NEW BOOKING RECEIVED</h1>
        </div>
        <div class="content">
          <div class="booking-details">
            <h2>📅 Booking Details</h2>
            <div class="detail-row">
              <span class="label">Service:</span> ${booking.serviceName}
            </div>
            <div class="detail-row">
              <span class="label">Date & Time:</span> ${booking.date} at ${booking.time}
            </div>
            <div class="detail-row">
              <span class="label">Duration:</span> ${booking.duration} minutes
            </div>
            <div class="detail-row">
              <span class="label">Amount:</span> ₦${booking.price}
            </div>
            <div class="detail-row">
              <span class="label">Channel:</span> ${booking.channel}
            </div>
          </div>

          <div class="booking-details">
            <h2>👤 Customer Information</h2>
            <div class="detail-row">
              <span class="label">Name:</span> ${booking.customerName}
            </div>
            <div class="detail-row">
              <span class="label">Email:</span> ${booking.customerEmail}
            </div>
            <div class="detail-row">
              <span class="label">Phone:</span> ${booking.customerPhone}
            </div>
            ${booking.notes ? `
            <div class="detail-row">
              <span class="label">Notes:</span> ${booking.notes}
            </div>
            ` : ''}
          </div>

          <p><strong>Booked on:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Booking ID:</strong> ${booking.id}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateCustomerEmailTemplate(booking: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f0fdf4; padding: 20px; border-radius: 0 0 8px 8px; }
        .booking-details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .success-message { background: #dcfce7; border: 1px solid #10b981; padding: 15px; border-radius: 6px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Booking Confirmed!</h1>
        </div>
        <div class="content">
          <div class="success-message">
            <p>Thank you for choosing Cleaning Hub! Your booking has been successfully submitted and we're excited to serve you.</p>
          </div>

          <div class="booking-details">
            <h2>📋 Your Booking Details</h2>
            <p><strong>Service:</strong> ${booking.serviceName}</p>
            <p><strong>Date:</strong> ${booking.date}</p>
            <p><strong>Time:</strong> ${booking.time}</p>
            <p><strong>Duration:</strong> ${booking.duration} minutes</p>
            <p><strong>Amount:</strong> ₦${booking.price}</p>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
          </div>

          <div class="booking-details">
            <h2>📞 Contact Information</h2>
            <p>If you need to make any changes or have questions, please contact us:</p>
            <p><strong>Phone:</strong> ${functions.config().contact?.phone || '+234-XXX-XXX-XXXX'}</p>
            <p><strong>Email:</strong> ${functions.config().contact?.email || 'info@cleaninghub.com'}</p>
            <p><strong>WhatsApp:</strong> ${functions.config().contact?.whatsapp || '+234-XXX-XXX-XXXX'}</p>
          </div>

          <p>We'll send you a reminder 24 hours before your appointment. Thank you for choosing Cleaning Hub!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateOwnerWhatsAppMessage(booking: any): string {
  return `🔔 *NEW BOOKING*

📅 ${booking.serviceName}
📆 ${booking.date} at ${booking.time}
💰 ₦${booking.price}
👤 ${booking.customerName}
📱 ${booking.customerPhone}
📧 ${booking.customerEmail}
${booking.notes ? `📝 ${booking.notes}` : ''}

Channel: ${booking.channel}
ID: ${booking.id}`;
}

// Export additional utility functions for n8n
export const getBooking = functions.https.onCall(async (bookingId: string, context) => {
  const doc = await db.collection('bookings').doc(bookingId).get();
  if (!doc.exists) {
    throw new functions.https.HttpsError('not-found', 'Booking not found');
  }
  return { id: doc.id, ...doc.data() };
});

export const updateBookingStatus = functions.https.onCall(async (data: { bookingId: string; status: string }, context) => {
  await db.collection('bookings').doc(data.bookingId).update({
    status: data.status,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // Get updated booking for notifications
  const booking = await getBooking(data.bookingId);
  await sendBusinessOwnerNotification(booking);

  return { success: true };
});