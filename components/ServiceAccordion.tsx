import type { Service, Category } from '../types';
import {
  ScissorsIcon,
  FaceSmileIcon,
  PaintBrushIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { formatDuration } from '../utils';

type ServiceAccordionProps = {
  categories: Category[];
  services: Service[];
  openCategory: string;
  setOpenCategory: (category: string) => void;
  selectedServices: Service[];
  toggleService: (service: Service) => void;
};

export default function ServiceAccordion({
  categories,
  services,
  openCategory,
  setOpenCategory,
  selectedServices,
  toggleService,
}: ServiceAccordionProps) {
  const selectedIds = new Set(selectedServices.map((service) => service.id));

  return (
    <section className="mb-6 space-y-4">
      {categories.map((category) => (
        <div key={category.title} className="overflow-hidden rounded-[32px] border border-pink-50 bg-white shadow-soft">
          <button
            type="button"
            onClick={() => setOpenCategory(openCategory === category.title ? '' : category.title)}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
            aria-expanded={openCategory === category.title}
          >
            <div className="flex items-center gap-3">
              {category.image && (
                <img src={category.image} alt={category.title} className="w-12 h-12 rounded-full object-cover shadow-sm" />
              )}
              <div>
                <h2 className="text-lg font-semibold text-dark">{category.title}</h2>
                <p className="text-sm text-stone-500">{category.subtitle}</p>
              </div>
            </div>
            {category.title === 'Hair' ? (
              <ScissorsIcon className={`w-7 h-7 transition-transform ${openCategory === category.title ? 'rotate-180' : 'rotate-0'}`} />
            ) : category.title === 'Face' ? (
              <FaceSmileIcon className={`w-7 h-7 transition-transform ${openCategory === category.title ? 'rotate-180' : 'rotate-0'}`} />
            ) : category.title === 'Nails' ? (
              <PaintBrushIcon className={`w-7 h-7 transition-transform ${openCategory === category.title ? 'rotate-180' : 'rotate-0'}`} />
            ) : (
              <SparklesIcon className={`w-7 h-7 transition-transform ${openCategory === category.title ? 'rotate-180' : 'rotate-0'}`} />
            )}
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${openCategory === category.title ? 'max-h-screen pb-5' : 'max-h-0'}`}>
            <div className="grid gap-3 px-5 pb-5">
              {services.filter((service) => service.category === category.title).map((service) => {
                const active = selectedIds.has(service.id);
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`transform rounded-3xl border px-4 py-4 text-left transition duration-200 ${
                      active
                        ? 'scale-[1.01] border-rose bg-rose text-white shadow-soft'
                        : 'border-pink-100 bg-pink-50/70 text-dark hover:border-rose hover:bg-pink-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {service.image && (
                          <img src={service.image} alt={service.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                        )}
                        <span className="font-semibold">{service.name}</span>
                      </div>
<span className="rounded-full bg-white/80 px-3 py-1 text-sm text-stone-600 shadow-sm">{formatDuration(service.duration)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}