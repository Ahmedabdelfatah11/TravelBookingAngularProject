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


export interface Filters {
    priceRange: { min: number; max: number };
    departureTime: { min: Date; max: Date };
    rating: number[];
    airlines: string[];

}