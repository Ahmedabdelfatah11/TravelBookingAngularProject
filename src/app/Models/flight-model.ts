export interface Flight {
    flightNumber: number
    departureAirport: string
    arrivalAirport: string
    departureTime: string
    arrivalTime: string
    price: number
    airlineName: string
    imageUrl: string
    rating: string;
}
export interface FlightCompany {
    id: number;
    imageUrl: string;
    name: string;
    location: string;
    rating: string; // Rating out of 5 or a descriptive rating like "Excellent", "Good", etc.
    flightCount: string;
}



export interface FlightFilterParams {
    DepartureAirport?: string;
    Rate?: 'Bad' | 'Normal' | 'Good' | 'Very Good' | 'Excellent';
    ArrivalAirport?: string;
    DepartureTime?: string; // ISO Date String
    ArrivalTime?: string;   // ISO Date String
    Sort?: string;          // "priceAsc", "priceDesc", etc.
    PageIndex?: number;
    PageSize?: number;
}
export interface FlightResponse {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: Flight[];
}

export interface FlightCompany {
    id: number;
    imageUrl: string;
    name: string;
    location: string;
    rating: string;
    flightCount: string;
}

export interface FlightDetails {
    flightNumber: number;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    availableSeats: number;
    flightCompany: FlightCompany;
}