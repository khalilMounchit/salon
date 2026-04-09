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
import { isBefore, addMinutes, setHours, setMinutes, setSeconds, setMilliseconds, addDays, startOfDay } from 'date-fns';

export default function BookingPage() {
  const [openCategory, setOpenCategory] = useState(categories[0].title);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [todayRef, setTodayRef] = useState(() => new Date());
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      setCurrentDate(new Date());
    };

    // Update every minute to stay synced with date changes
    const interval = setInterval(updateTime, 60000);

    // Also update at the start of each day
    const now = new Date();
    const tomorrow = startOfDay(addDays(now, 1));
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    const midnightTimeout = setTimeout(updateTime, timeUntilMidnight);

    return () => {
      clearInterval(interval);
      clearTimeout(midnightTimeout);
    };
  }, []);

  const monthDays = useMemo(() => {
    return buildMonthDays(currentDate, currentDate.getMonth(), currentDate.getFullYear(), todayRef);
  }, [currentDate, todayRef]);

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
      const slot = setMinutes(setSeconds(setMilliseconds(selected, 0), 0), minute);
      const slotTime = setHours(slot, hour);
      const endsAt = addMinutes(slotTime, totalDuration);
      const dayEnd = setMinutes(setSeconds(setMilliseconds(selected, 0), 0), 30);
      const closingTime = setHours(dayEnd, salonEndHour);
      const disabled = isBefore(slotTime, now) || isBefore(closingTime, endsAt) || isOverlapping(slotTime, endsAt, existingBookings);
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
      <div className="mx-auto max-w-xl px-5 pb-6 pt-6">
        <section className="mb-6 rounded-[32px] bg-gradient-to-br from-white/95 via-rose/5 to-pink/5 p-4 sm:p-6 shadow-2xl backdrop-blur-xl border border-white/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose/10 to-transparent opacity-60"></div>
          <div className="relative z-10">
            <div className="flex flex-col items-center justify-center text-center gap-3">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose/20 via-pink/10 to-transparent blur-2xl"></div>
                <div className="relative flex items-center justify-center rounded-full p-1 shadow-2xl">
                  <img
                    src="/images/logo.png"
                    alt="Doja Beauty logo"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-dark leading-tight">
                  Doja Beauty
                </h1>
                <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto">
                  Votre salon premium pour coiffure, soins du visage et beauté ongulaire.
                </p>
              </div>

              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-rose to-pink px-4 py-2 text-xs sm:text-sm text-white font-semibold uppercase tracking-[0.16em] shadow-lg">
                Réservation rapide
              </div>
            </div>

            <div className="mt-4 text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-dark mb-1">
                Réservez votre rendez-vous
              </h2>
            </div>
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

        {mounted && (
          <Calendar
            monthDays={monthDays}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            calendarRef={calendarRef}
            currentMonth={currentDate.getMonth()}
            currentYear={currentDate.getFullYear()}
          />
        )}

        {selectedDate && mounted && (
          <TimeSlots
            availableTimes={availableTimes}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            timeRef={timeRef}
            totalDuration={computeTotalDuration(selectedServices)}
          />
        )}

        {selectedTime && mounted && (
          <BookingForm
            selectedServices={selectedServices}
            selectedDate={selectedDate}
            clientName={clientName}
            setClientName={setClientName}
            nameRef={nameRef}
          />
        )}

        {mounted && (
          <div className="rounded-[28px] border border-white/70 overflow-hidden shadow-xl bg-white/95 backdrop-blur-xl mt-6 h-[450px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3305.4126887652574!2d-6.775627224283236!3d34.05893367315441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzTCsDAzJzMyLjIiTiA2wrA0NicyMy4wIlc!5e0!3m2!1sen!2sma!4v1775672171221!5m2!1sen!2sma"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        )}

        {confirmed && (
          <section className="rounded-[32px] border border-rose/20 bg-rose/10 p-5 text-center text-rose shadow-soft">
            <p className="text-lg font-semibold">Réservation confirmée !</p>
            <p className="mt-2 text-sm text-stone-600">Merci ! Votre rendez-vous est confirmé. Nous vous contacterons très bientôt pour vous envoyer tous les détails.</p>
          </section>
        )}
      </div>

      <StickyCTA
        selectedServices={selectedServices}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        readyToConfirm={readyToConfirm}
        handleConfirm={handleConfirm}
      />
    </main>
  );
}
