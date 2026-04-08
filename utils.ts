import type { Service } from './types';
import { salonStartHour, salonEndHour } from './constants';

export const getToday = (now: Date = new Date()) => {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const buildMonthDays = (now: Date = new Date(), month: number = 3, year: number = 2026, todayOverride?: Date) => {
  const today = todayOverride ? getToday(todayOverride) : getToday(now);
  const monthStart = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, idx) => {
    const date = new Date(year, month, idx + 1);
    return {
      label: date.getDate(),
      value: date.toISOString(),
      isToday: date.getTime() === today.getTime(),
      isPast: date < today,
    };
  });
};

export const computeTotalDuration = (selected: Service[]) => selected.reduce((sum, item) => sum + item.duration, 0);

export const generateTimeSlots = (interval: number) => {
  const slots: string[] = [];
  const stepMillis = interval * 60000;
  let current = new Date();
  current.setHours(salonStartHour, 30, 0, 0);

  const closing = new Date();
  closing.setHours(salonEndHour, 30, 0, 0);

  while (current.getTime() + stepMillis <= closing.getTime()) {
    const hours = current.getHours().toString().padStart(2, '0');
    const minutes = current.getMinutes().toString().padStart(2, '0');
    slots.push(`${hours}:${minutes}`);
    current = new Date(current.getTime() + stepMillis);
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
  const servicesList = bookingData.services.map(s => `• ${s.name} (${s.duration} min)`).join('\n');
  
  const message = `*Confirmation de Réservation* ✨\n\nNom: ${bookingData.clientName}\nDate: ${formattedDate}\nHeure: ${bookingData.timeSlots}\nDurée: ${bookingData.timeRange}\n\nServices:\n${servicesList}\n\nMerci de votre réservation!`;
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};