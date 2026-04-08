type Day = {
  label: number;
  value: string;
  isToday: boolean;
  isPast: boolean;
};

type CalendarProps = {
  monthDays: Day[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  calendarRef: React.RefObject<HTMLDivElement>;
};

export default function Calendar({ monthDays, selectedDate, setSelectedDate, calendarRef }: CalendarProps) {
  return (
    <section ref={calendarRef} className="mb-6 rounded-[32px] bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-rose">Sélectionnez une date</p>
          <h2 className="text-xl font-semibold">Avril 2026</h2>
        </div>
        <span className="rounded-full bg-sands px-3 py-1 text-sm text-stone-600">Avril</span>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-stone-500">
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day) => (
          <span key={day} className="py-2 font-semibold">{day}</span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-2">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: new Date(2026, 3, 1).getDay() }).map((_, idx) => (
          <div key={`empty-${idx}`} className="min-h-[56px]"></div>
        ))}
        {/* Calendar days */}
        {monthDays.map((day) => (
          <button
            key={day.value}
            type="button"
            onClick={() => !day.isPast && setSelectedDate(day.value)}
            disabled={day.isPast}
            className={`min-h-[56px] rounded-3xl border px-2 py-3 text-sm transition duration-200 ${
              day.isPast
                ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                : selectedDate === day.value
                ? 'border-rose bg-rose text-white shadow-soft'
                : day.isToday
                ? 'border-rose bg-rose/20 text-dark hover:border-rose hover:bg-rose/30'
                : 'border-pink-100 bg-pink-50/70 text-dark hover:border-rose hover:bg-pink-100'
            }`}
          >
            <span className="block text-base font-semibold">{day.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}