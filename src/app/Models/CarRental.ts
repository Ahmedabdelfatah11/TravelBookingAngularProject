export interface CarResponse {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: Car[];
}

export interface CarRental {
  id: number
  name: string
  description: string
  location: string
  imageUrl: string
  rating: string
  cars: Car[]
}

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
export interface carImage {
  imageUrl:string
  carId:number
  id:number
}
export interface CarFilterParams {
    searchTerm?: string;
    Sort?: string;          // "priceAsc", "priceDesc", etc.
    PageIndex?: number;
    PageSize?: number;

}