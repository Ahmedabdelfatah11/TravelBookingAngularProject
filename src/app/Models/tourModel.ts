
export interface Tours {
        id: number;
        name: string;
        startDate: string;
        endDate: string;
        description: string;
        destination: string;
        maxGuests: number;
        price: number;
        category: string;
        tourCompanyId: ITourCompany;
        imageUrls: string;
        tourImages: TourImages[];
}

export interface ITourCompany {
        id: number;
        name: string;
        description: string;
        imageUrl:string;
        location: string;
        rating:number;
}


export interface TourImages {
  id:number
  imageUrl:string
  tourId:number
}
export interface TourFilterParams {
    SearchTerm?: string;
    Sort?: string;          // "priceAsc", "priceDesc", etc.
    PageIndex?: number;
    PageSize?: number;
    Destination?: string;
    Category?: string; // ISO Date String
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
