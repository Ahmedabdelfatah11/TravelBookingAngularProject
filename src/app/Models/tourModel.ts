
export interface Tours {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  destination: string;
  maxGuests: number;
  minGroupSize: number;
  maxGroupSize: number;
  price: number;
  imageUrl: string;
  category: string;
  languages: string;  
  tourCompanyId: number;        
  tourCompanyName: string;              
  tourCompany: ITourCompany; 
  imageUrls: string[];
  tourImages: TourImages[];
  tourTickets: TourTicket[];
    tickets: TourTicket[];
  includedItems: string[];         
  excludedItems: string[];         
  questions: TourQuestion[];       
}
export interface TourTicket {
  id: number;
  type: string;
  price: number;
  availableQuantity: number;
  isActive: boolean;
  tourId: number;
    selectedQuantity: number; 
    quantity: number;
}
export interface TourQuestion {
  id: number;
  questionText: string;
  answerText?: string;
  tourId: number;
}

export interface ITourCompany {
  id:number;
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  rating: number;
  tours: Array<{
    id: number;
    name: string;
    description: string;
    destination: string;
    maxGuests: number;
    price: number;
    category: string;
    startDate: string; // or Date if parsed
    endDate: string;
    imageUrls: string[] | null;
  }>;
}




export interface TourImages {
  id:number
  imageUrl:string
  tourId:number
}
export interface TourFilterParams {
   tourId?: number;
    SearchTerm?: string;
    Sort?: string;          // "priceAsc", "priceDesc", etc.
    PageIndex?: number;
    PageSize?: number;
    Destination?: string;
     Category?: string[]; // ISO Date String
    Price?: number;   // ISO Date String
     minPrice?: number;
  maxPrice?: number;

}

export interface TourResponse {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: Tours[];
}
export interface PriceBounds {
  min: number;
  max: number;
}



interface TourDetails {
  tourData: TourResponse;
  getDurationInDays: (start?: string | Date, end?: string | Date) => number;
}

