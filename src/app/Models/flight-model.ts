export interface Flight {
    flightId: number
    departureAirport: string
    arrivalAirport: string
    departureTime: string
    arrivalTime: string
    economyPrice: number
    airlineName: string
    imageUrl: string
    rating: number;
}
export interface FlightCompany {
    id: number;
    imageUrl: string;
    name: string;
    location: string;
    rating: number; // Rating out of 5 or a descriptive rating like "Excellent", "Good", etc.
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



export interface FlightDetails {
    flightNumber: number;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    economySeats: number;
    businessSeats: number;
    firstClassSeats: number;
    economyPrice: number;
    firstClassPrice: number;
    businessPrice: number;
    flightCompany: FlightCompany;
}