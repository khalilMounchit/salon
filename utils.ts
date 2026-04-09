import type { Service } from './types';
import { salonStartHour, salonEndHour } from './constants';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isBefore,
  isSameDay,
  format,
  getDay,
  addMinutes,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds
} from 'date-fns';

export const getToday = (now: Date = new Date()) => {
  return setHours(setMinutes(setSeconds(setMilliseconds(now, 0), 0), 0), 0);
};

export const buildMonthDays = (now: Date, month: number, year: number, todayOverride?: Date) => {
  const today = todayOverride ? getToday(todayOverride) : getToday(now);
  const monthStart = startOfMonth(new Date(year, month, 1));
  const monthEnd = endOfMonth(new Date(year, month, 1));

  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return days.map((date) => ({
    label: parseInt(format(date, 'd'), 10),
    value: date.toISOString(),
    isToday: isSameDay(date, today),
    isPast: isBefore(date, today),
  }));
};

export const computeTotalDuration = (selected: Array<{ duration: number }>) => selected.reduce((sum, item) => sum + item.duration, 0);

export const generateTimeSlots = (interval: number) => {
  const slots: string[] = [];
  let current = setMinutes(setSeconds(setMilliseconds(new Date(), 0), 0), 30);
  current = setHours(current, salonStartHour);

  const closing = setMinutes(setSeconds(setMilliseconds(new Date(), 0), 30), 0);
  const closingTime = setHours(closing, salonEndHour);

  while (isBefore(current, closingTime)) {
    const hours = format(current, 'HH');
    const minutes = format(current, 'mm');
    slots.push(`${hours}:${minutes}`);
    current = addMinutes(current, interval);
  }

  return slots;
};

export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}min`;
  if (hours > 0) return `${hours}h`;
  return `${mins}min`;
};

export const parseTimeRange = (timeRange: string) => {
  const [startStr, durationStr] = timeRange.split(' • ');
  const duration = parseInt(durationStr.replace(' min', ''), 10);
  const [hour, minute] = startStr.split(':').map(Number);
  const start = new Date();
  start.setHours(hour, minute, 0, 0);
  const end = new Date(start.getTime() + duration * 60000);
  return { start, end };
};

export const isOverlapping = (newStart: Date, newEnd: Date, existingBookings: { timeRange: string }[]) => {
  return existingBookings.some((booking) => {
    const { start: existingStart, end: existingEnd } = parseTimeRange(booking.timeRange);
    return newStart < existingEnd && newEnd > existingStart;
  });
};

export const sendWhatsAppBooking = (phoneNumber: string, bookingData: {
  clientName: string;
  services: Array<{ name: string; duration: number }>;
  date: string;
  timeSlots: string;
  timeRange: string;
}) => {
  const dateObj = new Date(bookingData.date);
  const formattedDate = dateObj.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  const { end } = parseTimeRange(bookingData.timeRange);
  const endTime = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
  const totalDuration = computeTotalDuration(bookingData.services);
  const durationLabel = formatDuration(totalDuration);
  const servicesList = bookingData.services.map(s => `• ${s.name} (${formatDuration(s.duration)})`).join('\n');
  
  const message = `*Confirmation de Réservation* ✨\n\nNom: ${bookingData.clientName}\nDate: ${formattedDate}\nHeure: ${bookingData.timeSlots} / ${endTime}\nDurée: ${durationLabel}\n\nServices:\n${servicesList}\n\nMerci de votre réservation!`;
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};