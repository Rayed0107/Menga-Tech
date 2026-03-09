
import { 
  BloodStock, 
  Donor, 
  Emergency, 
  User, 
  UserRole, 
  SmartCooler, 
  BloodPouch,
  BloodDonation,
  LabTest,
  BloodComponent,
  TransfusionRequest,
  BloodBank,
  LogisticsDispatch
} from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Centre National de Transfusion',
  email: 'admin@cnts.cg',
  phone: '+242 06 999 00 00',
  role: UserRole.ADMIN,
  city: 'Brazzaville',
  createdAt: '2023-01-01T00:00:00Z'
};

export const MOCK_BANKS: BloodBank[] = [
  { id: 'b1', name: 'CNTS Brazzaville', city: 'Brazzaville', address: 'Avenue de la Paix', location: { lat: -4.2634, lng: 15.2429 } },
  { id: 'b2', name: 'CNTS Pointe-Noire', city: 'Pointe-Noire', address: 'Boulevard de la Liberté', location: { lat: -4.7784, lng: 11.8591 } },
];

export const MOCK_STOCKS: BloodStock[] = [
  { id: 's1', hospitalId: 'h1', hospitalName: 'CHU de Brazzaville', group: 'O-', quantity: 5, status: 'CRITICAL', lastUpdate: '2023-10-27T10:00:00Z' },
  { id: 's2', hospitalId: 'h1', hospitalName: 'CHU de Brazzaville', group: 'A+', quantity: 45, status: 'OK', lastUpdate: '2023-10-27T10:00:00Z' },
  { id: 's3', hospitalId: 'h2', hospitalName: 'Clinique Netcare', group: 'O-', quantity: 2, status: 'EMPTY', lastUpdate: '2023-10-27T11:30:00Z' },
  { id: 's4', hospitalId: 'h2', hospitalName: 'Clinique Netcare', group: 'B+', quantity: 20, status: 'OK', lastUpdate: '2023-10-27T11:30:00Z' },
  { id: 's5', hospitalId: 'h3', hospitalName: 'Hôpital Militaire', group: 'AB-', quantity: 8, status: 'CRITICAL', lastUpdate: '2023-10-27T09:00:00Z' },
];

export const MOCK_DONORS: Donor[] = [
  { id: 'd1', userId: 'u2', name: 'Alice Mbemba', bloodGroup: 'O-', dateOfBirth: '1995-05-12', weight: 65, city: 'Brazzaville', lastDonationDate: '2023-08-15', eligibilityStatus: 'ELIGIBLE', reliabilityScore: 95, isAvailable: true, distance: 2.5 },
  { id: 'd2', userId: 'u3', name: 'Brice Okombi', bloodGroup: 'A+', dateOfBirth: '1988-11-20', weight: 78, city: 'Pointe-Noire', lastDonationDate: '2023-09-01', eligibilityStatus: 'ELIGIBLE', reliabilityScore: 82, isAvailable: false, distance: 15.0 },
  { id: 'd3', userId: 'u4', name: 'Cédric Itoua', bloodGroup: 'O-', dateOfBirth: '1992-03-10', weight: 72, city: 'Brazzaville', lastDonationDate: '2023-07-20', eligibilityStatus: 'ELIGIBLE', reliabilityScore: 88, isAvailable: true, distance: 4.2 },
  { id: 'd4', userId: 'u5', name: 'Doris Mvoula', bloodGroup: 'B-', dateOfBirth: '1998-09-05', weight: 58, city: 'Brazzaville', lastDonationDate: '2023-10-05', eligibilityStatus: 'ELIGIBLE', reliabilityScore: 70, isAvailable: true, distance: 1.1 },
];

export const MOCK_DONATIONS: BloodDonation[] = [
  { id: 'don1', donorId: 'd1', bloodBankId: 'b1', donationDate: '2023-08-15', volumeMl: 450, bagId: 'BAG-BZV-001', status: 'PROCESSED' },
  { id: 'don2', donorId: 'd3', bloodBankId: 'b1', donationDate: '2023-07-20', volumeMl: 450, bagId: 'BAG-BZV-002', status: 'PROCESSED' },
];

export const MOCK_LAB_TESTS: LabTest[] = [
  { id: 'lab1', bagId: 'BAG-BZV-001', hiv: 'NEGATIVE', hepatitisB: 'NEGATIVE', hepatitisC: 'NEGATIVE', malaria: 'NEGATIVE', syphilis: 'NEGATIVE', result: 'SAFE', testDate: '2023-08-16' },
];

export const MOCK_COMPONENTS: BloodComponent[] = [
  { id: 'comp1', bagId: 'BAG-BZV-001', componentType: 'RBC', volume: 250, expirationDate: '2023-11-20', status: 'AVAILABLE' },
  { id: 'comp2', bagId: 'BAG-BZV-001', componentType: 'PLASMA', volume: 150, expirationDate: '2024-08-15', status: 'AVAILABLE' },
];

export const MOCK_TRANSFUSION_REQUESTS: TransfusionRequest[] = [
  { id: 'req1', hospitalId: 'h1', patientId: 'p1', bloodGroup: 'O-', componentType: 'RBC', quantity: 2, status: 'PENDING', createdAt: '2023-10-27T14:00:00Z' },
];

export const MOCK_EMERGENCIES: Emergency[] = [
  {
    id: 'e1',
    hospitalName: 'CHU de Brazzaville',
    bloodGroup: 'O-',
    status: 'PENDING',
    timestamp: new Date().toISOString(),
    location: { lat: -4.2634, lng: 15.2429 }
  }
];

export const MOCK_COOLERS: SmartCooler[] = [
  { id: 'c1', name: 'MengaBox-01', temperature: 4.2, batteryLevel: 85, isSolarCharging: true, location: 'Route de Kinkala', status: 'STABLE', capacity: 12 },
  { id: 'c2', name: 'MengaBox-02', temperature: 5.8, batteryLevel: 42, isSolarCharging: false, location: 'CHU Brazzaville', status: 'WARNING', capacity: 8 },
  { id: 'c3', name: 'MengaBox-03', temperature: 12.1, batteryLevel: 12, isSolarCharging: false, location: 'Plateau des 15 ans', status: 'CRITICAL', capacity: 5 },
];

export const MOCK_POUCHES: BloodPouch[] = [
  {
    id: 'BAG-BZV-001',
    group: 'O-',
    collectionDate: '2023-10-20',
    expiryDate: '2023-11-20',
    status: 'AVAILABLE',
    history: [
      { timestamp: '2023-10-20T08:00:00Z', action: 'Collecte', location: 'Donneur Mobile (Brazzaville)', actor: 'Equipe Mobile 1', hash: '0x8f2a...1e4d' },
      { timestamp: '2023-10-20T14:00:00Z', action: 'Test Sérique', location: 'Labo Central', actor: 'Dr. Mabiala', hash: '0x9a3c...ff22' },
      { timestamp: '2023-10-21T09:00:00Z', action: 'Mise en Stock', location: 'CNTS Fridge A1', actor: 'Inf. Kouloulou', hash: '0xb2e1...d443' },
    ]
  }
];

export const MOCK_LOGISTICS_DISPATCHES: LogisticsDispatch[] = [
  {
    id: 'disp1',
    requestId: 'req1',
    courierName: 'Jean-Pierre Loko',
    courierPhone: '+242 05 111 22 33',
    status: 'IN_TRANSIT',
    estimatedArrival: '2023-10-27T15:30:00Z',
    currentLocation: { lat: -4.2700, lng: 15.2500 },
    pouchId: 'BAG-BZV-001'
  }
];
