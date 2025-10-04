import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface BookingData {
  id: string;
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

const createTransporter = () => {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  };

  return nodemailer.createTransporter(config);
};

export const sendBusinessOwnerNotification = async (booking: BookingData): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    const ownerEmail = process.env.BUSINESS_OWNER_EMAIL;

    if (!ownerEmail) {
      console.warn('Business owner email not configured');
      return false;
    }

    const emailHtml = generateOwnerEmailTemplate(booking);

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: ownerEmail,
      subject: `🔔 NEW BOOKING - ${booking.serviceName}`,
      html: emailHtml
    };

    await transporter.sendMail(mailOptions);
    console.log('Business owner notification sent successfully');
    return true;

  } catch (error) {
    console.error('Error sending business owner notification:', error);
    return false;
  }
};

export const sendCustomerConfirmation = async (booking: BookingData): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    if (!booking.customerEmail) {
      console.warn('Customer email not provided');
      return false;
    }

    const emailHtml = generateCustomerEmailTemplate(booking);

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: booking.customerEmail,
      subject: `Booking Confirmation - ${booking.serviceName}`,
      html: emailHtml
    };

    await transporter.sendMail(mailOptions);
    console.log('Customer confirmation sent successfully');
    return true;

  } catch (error) {
    console.error('Error sending customer confirmation:', error);
    return false;
  }
};

function generateOwnerEmailTemplate(booking: BookingData): string {
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

function generateCustomerEmailTemplate(booking: BookingData): string {
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
            <p><strong>Phone:</strong> ${process.env.BUSINESS_OWNER_PHONE || '+234-XXX-XXX-XXXX'}</p>
            <p><strong>Email:</strong> ${process.env.BUSINESS_OWNER_EMAIL || 'info@cleaninghub.com'}</p>
            <p><strong>WhatsApp:</strong> ${process.env.BUSINESS_OWNER_PHONE || '+234-XXX-XXX-XXXX'}</p>
          </div>

          <p>We'll send you a reminder 24 hours before your appointment. Thank you for choosing Cleaning Hub!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}