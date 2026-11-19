export type ServiceCategory =
  | 'Laundry'
  | 'Printing'
  | 'Stationery'
  | 'Tiffin / Food'
  | 'Minor Repairs'
  | 'Hostel Essentials';

export type NavTab = 'explore' | 'requests' | 'profile';

export type RequestStatus = 'Requested' | 'Confirmed' | 'Completed';

export interface StudentUser {
  id: string;
  fullName: string;
  email: string;
  hostel: string;
  roomNumber: string;
  phone: string;
  password: string;
  createdAt: string;
}

export interface ProviderRateOption {
  label: string;
  priceText: string;
  estimatedInr: number;
}

export interface ServiceProvider {
  id: string;
  name: string;
  category: ServiceCategory;
  distanceFromGate: string;
  landmark: string;
  isOpenNow: boolean;
  availabilityLabel: string;
  hours: string;
  primaryPricing: string;
  secondaryPricing: string;
  convenienceFee: number;
  whatsappPhone: string; // 10-digit Indian mobile number without +91
  description: string;
  rateOptions: ProviderRateOption[];
}

export interface ServiceRequest {
  id: string;
  referenceCode: string;
  userId: string;
  providerId: string;
  providerName: string;
  providerCategory: ServiceCategory;
  providerWhatsapp: string;
  studentName: string;
  hostelAndRoom: string;
  studentPhone: string;
  serviceNotes: string;
  selectedOptionLabel: string;
  timeSlot: string;
  estimatedServiceCost: number;
  convenienceFee: number;
  totalEstimatedCost: number;
  status: RequestStatus;
  createdAt: string;
}
