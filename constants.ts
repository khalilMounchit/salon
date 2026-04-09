import type { Category, Service } from './types';

export const categories: Category[] = [
  { title: 'Hair', subtitle: 'Coupes, coiffage et coloration', image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=100&h=100&fit=crop' },
  { title: 'Face', subtitle: 'Soins du visage et embellissements', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=100&h=100&fit=crop' },
  { title: 'Nails', subtitle: 'Services de manucure et pédicure', image: '/images/pose-d-ongles.jpeg' },
  { title: 'Body', subtitle: 'Soins du corps et épilation', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100&h=100&fit=crop' },
];

export const services: Service[] = [
  // Hair (priority)
  { id: 'balayage', name: "Balayage", duration: 120, category: "Hair", popular: true, image: '/images/balayage.jpeg' },
  { id: 'ombre', name: "Ombré", duration: 150, category: "Hair", popular: true, image: '/images/ombre.jpg' },
  { id: 'coloration', name: "Coloration", duration: 90, category: "Hair", image: '/images/coloration.jpg' },
  { id: 'lissage-et-proteine', name: "Lissage & Protéine", duration: 120, category: "Hair", image: '/images/lissage-et-proteine.png' },
  { id: 'meches', name: "Mèches", duration: 60, category: "Hair", image: '/images/meches.jpg' },
  { id: 'brushing', name: "Brushing", duration: 60, category: "Hair", image: '/images/brushing.webp' },
  { id: 'coupe', name: "Coupe", duration: 20, category: "Hair", quick: true, image: '/images/coupe.webp' },

  // Face
  { id: 'soin-visage-hydrafacial', name: "Soin Visage Hydrafacial", duration: 80, category: "Face", popular: true, image: '/images/soin-visage-hydrafacial.webp' },
  { id: 'microblading-et-glacage', name: "Microblading & Glaçage", duration: 120, category: "Face", image: '/images/microblading-et-glacage.webp' },
  { id: 'lash-lift-et-brow-lift', name: "Lash Lift & Brow Lift", duration: 60, category: "Face", image: '/images/lash-lift-et-brow-lift.jpg' },
  { id: 'cils-permanent', name: "Cils Permanent", duration: 60, category: "Face", image: '/images/cils-permanent.jpg' },

  // Nails
  { id: 'pose-d-ongles', name: "Pose d'ongles", duration: 60, category: "Nails", popular: true, image: '/images/pose-d-ongles.jpeg' },
  { id: 'pose-permanent', name: "Pose Permanent", duration: 60, category: "Nails", image: '/images/pose-permanent.jfif' },
  { id: 'manucure', name: "Manucure", duration: 60, category: "Nails", image: '/images/manucure.jpg' },
  { id: 'pedicure', name: "Pédicure", duration: 60, category: "Nails", image: '/images/pedicure.png' },

  //Body
  { id: 'epilation-totale', name: "Épilation Totale", duration: 60, category: "Body", popular: true, image: '/images/epilation-totale.jpg' },
];

export const salonStartHour = 10;
export const salonEndHour = 21;
export const salonPhoneNumber = '212691422511'; // WhatsApp phone number with country code (no + sign)
