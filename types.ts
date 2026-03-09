
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export enum UserRole {
  DONOR = 'DONOR',
  HOSPITAL = 'HOSPITAL',
  LAB = 'LAB',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  bloodGroup?: BloodGroup;
  city: string;
  createdAt: string;
}

export interface Donor {
  id: string;
  userId: string;
  name: string;
  bloodGroup: BloodGroup;
  dateOfBirth: string;
  weight: number;
  city: string;
  lastDonationDate?: string;
  eligibilityStatus: 'ELIGIBLE' | 'INELIGIBLE' | 'PENDING';
  reliabilityScore: number; // 0-100
  isAvailable: boolean;
  distance?: number; // km
}

export interface BloodBank {
  id: string;
  name: string;
  city: string;
  address: string;
  location: { lat: number; lng: number };
}

export interface BloodDonation {
  id: string;
  donorId: string;
  bloodBankId: string;
  donationDate: string;
  volumeMl: number;
  bagId: string;
  status: 'COLLECTED' | 'TESTING' | 'SAFE' | 'INFECTED' | 'PROCESSED' | 'REJECTED';
}

export interface LabTest {
  id: string;
  bagId: string;
  hiv: 'NEGATIVE' | 'POSITIVE';
  hepatitisB: 'NEGATIVE' | 'POSITIVE';
  hepatitisC: 'NEGATIVE' | 'POSITIVE';
  malaria: 'NEGATIVE' | 'POSITIVE';
  syphilis: 'NEGATIVE' | 'POSITIVE';
  result: 'SAFE' | 'INFECTED' | 'INCONCLUSIVE';
  testDate: string;
}

export type ComponentType = 'RBC' | 'PLASMA' | 'PLATELETS';

export interface BloodComponent {
  id: string;
  bagId: string;
  componentType: ComponentType;
  volume: number;
  expirationDate: string;
  status: 'AVAILABLE' | 'TRANSFUSED' | 'EXPIRED' | 'REJECTED';
}

export interface InventoryItem {
  id: string;
  bloodBankId: string;
  componentId: string;
  bloodGroup: BloodGroup;
  componentType: ComponentType;
  quantity: number;
  updatedAt: string;
}

export interface TransfusionRequest {
  id: string;
  hospitalId: string;
  patientId: string;
  bloodGroup: BloodGroup;
  componentType: ComponentType;
  quantity: number;
  status: 'PENDING' | 'MATCHED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface Transfusion {
  id: string;
  requestId: string;
  componentId: string;
  hospitalId: string;
  patientId: string;
  transfusionDate: string;
}

export interface BloodStock {
  id: string;
  hospitalId: string;
  hospitalName: string;
  group: BloodGroup;
  quantity: number; // in units
  status: 'OK' | 'CRITICAL' | 'EMPTY';
  lastUpdate: string;
}

export interface Emergency {
  id: string;
  hospitalName: string;
  bloodGroup: BloodGroup;
  status: 'PENDING' | 'DISPATCHED' | 'COMPLETED';
  timestamp: string;
  location: { lat: number; lng: number };
}

export interface PredictionResult {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  predictedShortage: BloodGroup[];
  reasoning: string;
  recommendedActions: string[];
}

export interface SmartCooler {
  id: string;
  name: string;
  temperature: number;
  batteryLevel: number;
  isSolarCharging: boolean;
  location: string;
  status: 'STABLE' | 'WARNING' | 'CRITICAL';
  capacity: number; // current units inside
}

export interface BloodUnitHistory {
  timestamp: string;
  action: string;
  location: string;
  actor: string;
  hash: string;
}

export interface LogisticsDispatch {
  id: string;
  requestId: string;
  courierName: string;
  courierPhone: string;
  status: 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED';
  estimatedArrival: string;
  currentLocation: { lat: number; lng: number };
  pouchId: string;
}

export interface BloodPouch {
  id: string;
  group: BloodGroup;
  collectionDate: string;
  expiryDate: string;
  status: 'AVAILABLE' | 'TRANSFUSED' | 'EXPIRED' | 'REJECTED';
  history: BloodUnitHistory[];
}
