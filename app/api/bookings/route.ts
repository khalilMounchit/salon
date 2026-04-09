import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import { parseTimeRange } from '../../../utils';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

type Booking = {
  clientName: string;
  services: { name: string; duration: number }[];
  date: string;
  timeSlots: string;
  totalSlots: number;
  timeRange: string;
};

const readBookings = async (): Promise<Booking[]> => {
  const data = await redis.get('bookings');
  return (data as Booking[]) || [];
};

const writeBookings = async (bookings: Booking[]) => {
  await redis.set('bookings', bookings);
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Date query is required' }, { status: 400 });
  }

  const bookings = await readBookings();
  const filtered = bookings.filter((booking) => booking.date === date);
  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const { clientName, services, date, timeRange } = payload as Booking;

  if (!clientName || !services?.length || !date || !timeRange) {
    return NextResponse.json({ error: 'Missing booking data' }, { status: 400 });
  }

  const { start: newStart, end: newEnd } = parseTimeRange(timeRange);
  const bookings = await readBookings();
  const dateBookings = bookings.filter((booking) => booking.date === date);

  const overlaps = dateBookings.some((booking) => {
    const { start: existingStart, end: existingEnd } = parseTimeRange(booking.timeRange);
    return newStart < existingEnd && newEnd > existingStart;
  });

  if (overlaps) {
    return NextResponse.json({ error: 'Time slot already booked' }, { status: 409 });
  }

  const nextBooking = { clientName, services, date, timeSlots: payload.timeSlots, totalSlots: payload.totalSlots, timeRange };
  bookings.push(nextBooking);
  await writeBookings(bookings);

  return NextResponse.json(nextBooking, { status: 201 });
}
