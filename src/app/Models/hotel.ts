export interface HotelResponse {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: Hotel[];
}

export interface Hotel {
  id: number
  name: string
  description: string
  location: string
  imageUrl: string
  rating: string
  rooms: Room[]
}

export interface Room {
  id: number
  price: number
  isAvailable: boolean
  roomType: string
  description: string
  from: string
  to: string
  hotelCompanyId: number
  hotelCompanyName: string
  roomImages: roomImage[]
}
export interface roomImage {
  imageUrl: string
  roomId: number
  id: number
}
export interface HotelFilterParams {
  Search?: string;
  Sort?: string;          // "priceAsc", "priceDesc", etc.
  PageIndex?: number;
  PageSize?: number;
}
export interface DateRange {
  start: string;
  end: string;
}