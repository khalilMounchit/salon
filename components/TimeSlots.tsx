type Slot = {
  time: string;
  disabled: boolean;
};

type TimeSlotsProps = {
  availableTimes: Slot[];
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  timeRef: React.RefObject<HTMLDivElement>;
  totalDuration?: number;
};

export default function TimeSlots({ availableTimes, selectedTime, setSelectedTime, timeRef, totalDuration }: TimeSlotsProps) {
  return (
    <section ref={timeRef} className="mb-6 rounded-[32px] bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-rose">Sélectionnez une heure</p>
          <h2 className="text-xl font-semibold">Créneaux horaires</h2>
        </div>
        {totalDuration && (
          <div className="inline-flex items-center gap-2 rounded-full bg-sands px-4 py-2 text-sm font-semibold text-stone-700">
            <span>⏱️</span>
            <span>{totalDuration} min</span>
          </div>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {availableTimes.map((slot) => (
          <button
            key={slot.time}
            type="button"
            onClick={() => !slot.disabled && setSelectedTime(slot.time)}
            disabled={slot.disabled}
            className={`min-h-[56px] rounded-3xl px-4 py-4 text-left text-sm font-medium transition duration-200 ${
              slot.disabled
                ? 'cursor-not-allowed border border-rose/20 bg-rose/10 text-rose/60'
                : selectedTime === slot.time
                ? 'border-rose bg-rose text-white shadow-soft'
                : 'border-pink-100 bg-mint/70 text-dark hover:border-rose hover:bg-mint/90'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span>{slot.time}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}