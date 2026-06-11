export const places = {
  pickup: 'Salcedo Village, Makati',
  destination: 'BGC High Street, Taguig',
  alternate: 'NAIA Terminal 3',
};

export const driver = {
  name: 'Juan Dela Cruz',
  initials: 'JC',
  rating: '4.92',
  vehicle: 'Toyota Vios',
  color: 'Pearl White',
  plate: 'ABC-1234',
  eta: '2 min',
  distance: '450m away',
  badges: ['Plate matched', 'Trip PIN required', 'LTFRB-aware profile'],
};

export const rideOptions = [
  {
    id: 'car',
    label: 'Hatid Car',
    icon: '🚘',
    eta: '3 min pickup',
    trip: '18 min trip',
    fare: '₱198–₱228',
    note: 'Cash accepted • GCash backup enabled',
    available: '18 drivers nearby',
  },
  {
    id: 'moto',
    label: 'Hatid Moto',
    icon: '🏍️',
    eta: '1 min pickup',
    trip: '14 min trip',
    fare: '₱128–₱148',
    note: 'Fastest for traffic • helmet required',
    available: '26 riders nearby',
  },
  {
    id: 'xl',
    label: 'Hatid XL',
    icon: '🚐',
    eta: '7 min pickup',
    trip: '20 min trip',
    fare: '₱278–₱318',
    note: '6 seats • luggage friendly',
    available: '5 drivers nearby',
  },
];

export const popularDestinations = [
  ['NAIA Terminal 3', 'Airport quick button'],
  ['SM Mall of Asia', 'Pasay City'],
  ['BGC High Street', 'Taguig City'],
  ['Ayala Triangle Gardens', 'Makati City'],
  ['Trinoma / SM North', 'Quezon City'],
];

export const serviceStatus = [
  ['Ride', 'Available', '18 drivers'],
  ['Moto', 'Busy', '26 riders'],
  ['XL', 'Limited', '5 drivers'],
  ['Padala', 'Available', '12 couriers'],
];
