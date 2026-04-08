import type { Category, Service } from './types';

export const categories: Category[] = [
  { title: 'Hair', subtitle: 'Coupes, coiffage et coloration', image: 'https://images.unsplash.com/photo-1562004760-aceed7bb0fe3?w=100&h=100&fit=crop' },
  { title: 'Face', subtitle: 'Soins du visage et embellissements', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=100&h=100&fit=crop' },
  { title: 'Nails', subtitle: 'Services de manucure et pédicure', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=100&h=100&fit=crop' },
  { title: 'Body', subtitle: 'Soins du corps et épilation', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100&h=100&fit=crop' },
];

export const services: Service[] = [
  // Hair (priority)
  { id: 'balayage', name: "Balayage", duration: 120, category: "Hair", popular: true, image: 'https://images.unsplash.com/photo-1605497787865-93dd15b4cd05?w=80&h=80&fit=crop' },
  { id: 'ombre', name: "Ombré", duration: 150, category: "Hair", popular: true, image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=80&h=80&fit=crop' },
  { id: 'coloration', name: "Coloration", duration: 90, category: "Hair", image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=80&h=80&fit=crop' },
  { id: 'lissage-et-proteine', name: "Lissage & Protéine", duration: 120, category: "Hair", image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=80&h=80&fit=crop' },
  { id: 'meches', name: "Mèches", duration: 60, category: "Hair", image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop' },
  { id: 'brushing', name: "Brushing", duration: 60, category: "Hair", image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=80&h=80&fit=crop' },
  { id: 'coupe', name: "Coupe", duration: 20, category: "Hair", quick: true, image: 'https://images.unsplash.com/photo-1605497787865-93dd15b4cd05?w=80&h=80&fit=crop' },

  // Face
  { id: 'soin-visage-hydrafacial', name: "Soin Visage Hydrafacial", duration: 80, category: "Face", popular: true, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=80&h=80&fit=crop' },
  { id: 'microblading-et-glacage', name: "Microblading & Glaçage", duration: 120, category: "Face", image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=80&h=80&fit=crop' },
  { id: 'lash-lift-et-brow-lift', name: "Lash Lift & Brow Lift", duration: 60, category: "Face", image: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=80&h=80&fit=crop' },
  { id: 'cils-permanent', name: "Cils Permanent", duration: 60, category: "Face", image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=80&h=80&fit=crop' },

  // Nails
  { id: 'pose-d-ongles', name: "Pose d'ongles", duration: 60, category: "Nails", popular: true, image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=80&h=80&fit=crop' },
  { id: 'pose-permanent', name: "Pose Permanent", duration: 60, category: "Nails", image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=80&h=80&fit=crop' },
  { id: 'manucure', name: "Manucure", duration: 60, category: "Nails", image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=80&h=80&fit=crop' },
  { id: 'pedicure', name: "Pédicure", duration: 60, category: "Nails", image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=80&h=80&fit=crop' },

  // Body
  { id: 'epilation-totale', name: "Épilation Totale", duration: 60, category: "Body", popular: true, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=80&h=80&fit=crop' }
];

export const salonStartHour = 10;
export const salonEndHour = 21;
export const salonPhoneNumber = '212701691575'; // WhatsApp phone number with country code (no + sign)