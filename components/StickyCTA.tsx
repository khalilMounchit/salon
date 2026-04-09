import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type StickyCTAProps = {
  selectedServices: any[];
  selectedDate: string | undefined;
  selectedTime: string | undefined;
  readyToConfirm: boolean;
  handleConfirm: () => void;
};

export default function StickyCTA({ selectedServices, selectedDate, selectedTime, readyToConfirm, handleConfirm }: StickyCTAProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-pink-100/80 bg-transparent px-5 py-2 backdrop-blur-xl">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
        <div className="hidden min-w-0 flex-1 flex-col rounded-3xl bg-sands px-4 py-3 text-sm text-stone-700 shadow-soft sm:flex">
          <span className="font-semibold">{selectedServices.length ? `${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''}` : 'Choisissez un service'}</span>
          <span className="mt-1 text-xs text-stone-500">
            {selectedDate && selectedTime
              ? `${format(new Date(selectedDate), 'dd MMMM yyyy', { locale: fr })} à ${selectedTime}`
              : selectedDate
              ? format(new Date(selectedDate), 'dd MMMM yyyy', { locale: fr })
              : 'Date non sélectionnée'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!readyToConfirm}
          className={`inline-flex min-h-[56px] flex-1 items-center justify-center rounded-3xl bg-gradient-to-r from-rose via-blush to-pink-400 px-5 text-base font-semibold text-white shadow-lg transition transform duration-200 ${
            readyToConfirm ? 'opacity-100 hover:-translate-y-0.5' : 'cursor-not-allowed opacity-60'
          }`}
        >
          {readyToConfirm ? 'Confirmer la réservation' : 'Continuer'}
        </button>
      </div>
    </div>
  );
}