import type { Service } from '../types';
import { formatDuration, computeTotalDuration } from '../utils';

type BookingFormProps = {
  selectedServices: Service[];
  selectedDate: string;
  clientName: string;
  setClientName: (name: string) => void;
  nameRef: React.RefObject<HTMLInputElement>;
};

export default function BookingForm({
  selectedServices,
  selectedDate,
  clientName,
  setClientName,
  nameRef,
}: BookingFormProps) {
  return (
    <section className="mb-6 rounded-[32px] bg-white p-5 shadow-soft">
      <div className="space-y-4">
        <div className="rounded-3xl border border-pink-100 bg-blush/10 p-4">
          <p className="text-sm text-stone-500">Résumé</p>
          <div className="mt-3 flex flex-wrap gap-2">
{selectedServices.map((service) => (
              <span key={service.id} className="rounded-full bg-white px-3 py-1 text-sm text-stone-700 shadow-sm">
                {service.name} ({formatDuration(service.duration)})
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm text-stone-600">
            Durée totale : <span className="font-semibold">{formatDuration(computeTotalDuration(selectedServices))}</span>
          </p>
        </div>
        <div className="space-y-2">
          <label htmlFor="clientName" className="text-sm font-medium text-stone-700">
            Votre nom
          </label>
          <input
            ref={nameRef}
            id="clientName"
            value={clientName}
            onChange={(event) => setClientName(event.target.value)}
            className="w-full rounded-3xl border border-pink-100 bg-sands px-4 py-4 text-lg text-dark outline-none transition focus:border-rose focus:ring-4 focus:ring-rose/10"
            placeholder="Jessica"
          />
        </div>
      </div>
    </section>
  );
}