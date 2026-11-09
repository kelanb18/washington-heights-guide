import type { Category } from './taxonomy';

export const categoryInfoEs: Record<Category, string> = {
  restaurant: 'Restaurante',
  cafe: 'Café',
  bakery: 'Panadería',
  bar: 'Bar',
  shop: 'Tienda',
  service: 'Servicio',
  landmark: 'Lugar de interés',
};

export function formatDateEs(date: Date): string {
  return new Intl.DateTimeFormat('es-US', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
