export interface Car {
  id: number;
  model?: string;
  price?: number;
  description?: string;
  isAvailable: boolean;
  location?: string;
  imageUrl?: string;
  capacity: number;
  rentalCompanyId: number;
  companyName?: string;
}