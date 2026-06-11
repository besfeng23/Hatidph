export const places = {
  pickup: 'Salcedo Village, Makati',
  pickupDetail: 'Salcedo Village lobby entrance',
  destination: 'BGC High Street, Taguig',
  destinationDetail: 'BGC High Street drop-off bay',
  alternate: 'NAIA Terminal 3',
  route: 'Via Ayala Ave and 5th Ave',
  traffic: 'Light to moderate traffic',
};

export const driver = {
  name: 'Juan Dela Cruz',
  initials: 'JC',
  rating: '4.92',
  trips: '3,284 trips',
  vehicle: 'Toyota Vios',
  color: 'Pearl White',
  plate: 'ABC-1234',
  eta: '2 min',
  distance: '450m away',
  safetyStatus: 'Last safety check: passed today',
  verificationId: 'HTD-DRV-2048',
  badges: ['Plate matched', 'Trip PIN required', 'Identity verified', 'LTFRB-aware profile'],
};

export const pickupInstructions = [
  'Lobby entrance',
  'Guardhouse',
  'Main gate',
  'Basement pickup',
  'Mall pickup bay',
];

export const paymentMethods = [
  { id: 'balance', label: 'Hatid Balance', detail: '₱1,250 available', status: 'Selected' },
  { id: 'gcash', label: 'GCash backup', detail: 'Linked backup payment', status: 'Ready' },
  { id: 'cash', label: 'Cash', detail: 'Accepted for pilot rides', status: 'Available' },
];

export const promo = {
  code: 'MAKATI40',
  label: 'MAKATI40 applied',
  detail: 'Save ₱40 on this Makati/BGC pilot trip',
  discount: '₱40',
};

export const fareBreakdown = [
  ['Base fare', '₱80'],
  ['Distance 7.2 km', '₱132'],
  ['Traffic adjustment', '₱20'],
  ['Promo MAKATI40', '-₱40'],
];

export const rideOptions = [
  {
    id: 'car',
    label: 'Hatid Car',
    icon: 'car',
    eta: '3 min pickup',
    trip: '18 min trip',
    fare: '₱198–₱228',
    note: 'Cash accepted • GCash backup enabled',
    available: '18 drivers nearby',
    routeNote: 'Light traffic via Ayala Ave',
    cancellation: 'Free cancellation before driver arrives',
    bestFor: 'Best everyday ride',
  },
  {
    id: 'moto',
    label: 'Hatid Moto',
    icon: 'moto',
    eta: '1 min pickup',
    trip: '14 min trip',
    fare: '₱128–₱148',
    note: 'Fastest for traffic • helmet required',
    available: '26 riders nearby',
    routeNote: 'Fastest through Makati traffic',
    cancellation: 'Free cancellation before rider arrives',
    bestFor: 'Fastest arrival',
  },
  {
    id: 'xl',
    label: 'Hatid XL',
    icon: 'xl',
    eta: '7 min pickup',
    trip: '20 min trip',
    fare: '₱278–₱318',
    note: '6 seats • luggage friendly',
    available: '5 drivers nearby',
    routeNote: 'More space for airport or family trips',
    cancellation: 'Free cancellation before driver arrives',
    bestFor: 'Group or luggage',
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
