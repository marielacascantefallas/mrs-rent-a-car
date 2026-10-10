// Transporte privado al aeropuerto. Precios en dólares, definidos por el cliente.
// También se usan en los datos estructurados de index.html: si cambian, actualízalos ahí.
export type TransportOption = {
  id: 'pickup' | 'dropoff' | 'round';
  usd: number;
};

export const TRANSPORT_OPTIONS: TransportOption[] = [
  { id: 'pickup', usd: 190 },
  { id: 'dropoff', usd: 190 },
  { id: 'round', usd: 380 },
];
