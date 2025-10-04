import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin (server-side only)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

interface BookingRequest {
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

export async function POST(request: NextRequest) {
  try {
    const bookingData: BookingRequest = await request.json();

    // Validate required fields
    const requiredFields = [
      'serviceId', 'serviceName', 'date', 'time', 'duration', 'price',
      'customerName', 'customerEmail', 'customerPhone', 'channel'
    ];

    for (const field of requiredFields) {
      if (!bookingData[field as keyof BookingRequest]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Generate unique booking ID
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create booking object
    const booking = {
      id: bookingId,
      ...bookingData,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'offline', // Default for website bookings
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save to Firestore
    await db.collection('bookings').doc(bookingId).set(booking);

    // TODO: Trigger Firebase Cloud Function for notifications
    // For now, we'll handle notifications here until functions are deployed

    console.log('Booking saved successfully:', bookingId);

    return NextResponse.json({
      success: true,
      bookingId,
      message: 'Booking submitted successfully! You will receive a confirmation email shortly.'
    });

  } catch (error) {
    console.error('Error processing booking:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process booking' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}