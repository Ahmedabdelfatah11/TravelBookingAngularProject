export interface Reviews {
    id: number;
    userId: string;
    companyType: string;
    hotelCompanyId?: number;
    flightCompanyId?: number;
    carRentalCompanyId?: number;
    tourCompanyId?: number;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt?: Date;
    // Company Information
    companyName?: string;
    companyDescription?: string;
    companyImageUrl?: string;
    companyLocation?: string;

    // User Information
    userName?: string;
    userEmail?: string;
}
export interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
    recentReviews: Reviews[];
}
export interface ReviewFilterParams {
    companyType: string;
    hotelId?: number;
    flightId?: number;
    carRentalId?: number;
    tourId?: number;
    page?: number;
    pageSize?: number;
    sortBy?: string;
}