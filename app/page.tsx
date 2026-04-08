'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Service } from '../types';
import { categories, services, salonEndHour, salonPhoneNumber } from '../constants';
import { buildMonthDays, computeTotalDuration, generateTimeSlots, isOverlapping, sendWhatsAppBooking } from '../utils';
import ServiceAccordion from '../components/ServiceAccordion';
import Calendar from '../components/Calendar';
import TimeSlots from '../components/TimeSlots';
import BookingForm from '../components/BookingForm';
import StickyCTA from '../components/StickyCTA';

export default function BookingPage() {
  const [openCategory, setOpenCategory] = useState(categories[0].title);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const updateTime = () => {
      setCurrentDate(new Date());
    };

    // Update every minute to stay synced with date changes
    const interval = setInterval(updateTime, 60000);
    
    // Also update at the start of each day
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    const midnightTimeout = setTimeout(updateTime, timeUntilMidnight);

    return () => {
      clearInterval(interval);
      clearTimeout(midnightTimeout);
    };
  }, []);

  const monthDays = useMemo(() => {
    // Override today to April 8, 2026 for correct calendar display
    const todayOverride = new Date(2026, 3, 8);
    return buildMonthDays(currentDate, 3, 2026, todayOverride);
  }, [currentDate]);

  useEffect(() => {
    if (selectedServices.length && !selectedDate) {
      calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedServices.length]);

  useEffect(() => {
    if (selectedDate) {
      window
        .fetch(`/api/bookings?date=${encodeURIComponent(selectedDate)}`)
        .then((res) => res.json())
        .then(setExistingBookings)
        .catch(() => setExistingBookings([]));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedTime) {
      nameRef.current?.focus();
    }
  }, [selectedTime]);

  const selectedIds = new Set(selectedServices.map((service) => service.id));

  const toggleService = (service: Service) => {
    setSelectedServices((current) =>
      current.some((item) => item.id === service.id)
        ? current.filter((item) => item.id !== service.id)
        : [...current, service],
    );
  };

  const availableTimes = useMemo(() => {
    if (!selectedDate || !selectedServices.length) return [];
    const now = currentDate;
    const selected = new Date(selectedDate);
    const totalDuration = computeTotalDuration(selectedServices);
    const interval = totalDuration;
    const timeSlots = generateTimeSlots(interval);

    return timeSlots.map((time) => {
      const [hour, minute] = time.split(':').map(Number);
      const slot = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), hour, minute);
      const endsAt = new Date(slot.getTime() + totalDuration * 60000);
      const disabled = slot < now || endsAt.getTime() > new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), salonEndHour, 30, 0).getTime() || isOverlapping(slot, endsAt, existingBookings);
      return { time, disabled };
    });
  }, [selectedDate, selectedServices, existingBookings, currentDate]);

  const readyToConfirm = selectedServices.length > 0 && !!selectedDate && !!selectedTime && clientName.trim().length >= 2;

  const handleConfirm = async () => {
    if (!readyToConfirm) return;

    const bookingDocument = {
      clientName: clientName.trim(),
      services: selectedServices.map((service) => ({ name: service.name, duration: service.duration })),
      date: selectedDate,
      timeSlots: selectedTime,
      totalSlots: selectedServices.length,
      timeRange: `${selectedTime} • ${computeTotalDuration(selectedServices)} min`,
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingDocument),
      });

      if (!response.ok) {
        throw new Error('Could not create booking');
      }

      setConfirmed(true);
      
      // Send WhatsApp message with booking details
      sendWhatsAppBooking(salonPhoneNumber, bookingDocument);
      
      if (selectedDate) {
        const refreshed = await fetch(`/api/bookings?date=${encodeURIComponent(selectedDate)}`);
        setExistingBookings(await refreshed.json());
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-sands text-dark">
      <div className="mx-auto max-w-xl px-5 pb-36 pt-6">
        <section className="mb-6 rounded-[32px] bg-gradient-to-br from-white/95 via-rose/5 to-pink/5 p-6 shadow-2xl backdrop-blur-xl border border-white/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose/5 to-transparent opacity-50"></div>
          <div className="relative z-10">
            {/* Logo and Badge Row */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Logo placeholder */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose to-pink shadow-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">S</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-dark">Salon</h1>
                  <p className="text-xs text-stone-500">Premium Beauty</p>
                </div>
              </div>
              <div className="inline-flex items-center justify-between rounded-full bg-gradient-to-r from-rose to-pink px-4 py-2 text-sm text-white font-semibold uppercase tracking-[0.18em] shadow-lg">
                Réservation rapide
              </div>
            </div>

            {/* Heading and Description */}
            <div className="mb-4 space-y-3">
              <h2 className="text-4xl font-bold leading-tight bg-gradient-to-r from-dark to-rose bg-clip-text text-transparent">
                Réservez votre rendez-vous
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Choisissez des services, verrouillez une date et confirmez votre visite en moins de 30 secondes.
              </p>
            </div>
            
            {/* Services Instruction */}
         
          </div>
        </section>

        <ServiceAccordion
          categories={categories}
          services={services}
          openCategory={openCategory}
          setOpenCategory={setOpenCategory}
          selectedServices={selectedServices}
          toggleService={toggleService}
        />

        <Calendar
          monthDays={monthDays}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          calendarRef={calendarRef}
        />

        {selectedDate && (
          <TimeSlots
            availableTimes={availableTimes}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            timeRef={timeRef}
            totalDuration={computeTotalDuration(selectedServices)}
          />
        )}

        {selectedTime && (
          <BookingForm
            selectedServices={selectedServices}
            selectedDate={selectedDate}
            clientName={clientName}
            setClientName={setClientName}
            nameRef={nameRef}
          />
        )}

        {confirmed && (
          <section className="rounded-[32px] border border-rose/20 bg-rose/10 p-5 text-center text-rose shadow-soft">
            <p className="text-lg font-semibold">Réservation confirmée !</p>
            <p className="mt-2 text-sm text-stone-600">Votre rendez-vous est réservé. Nous vous contacterons bientôt avec les détails.</p>
          </section>
        )}
      </div>

      <StickyCTA
        selectedServices={selectedServices}
        selectedDate={selectedDate}
        readyToConfirm={readyToConfirm}
        handleConfirm={handleConfirm}
      />
    </main>
  );
}
