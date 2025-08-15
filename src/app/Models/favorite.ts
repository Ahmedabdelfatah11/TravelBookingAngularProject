export interface Favorite {
    id: number
    userId: string
    companyType: string
    hotelCompanyId?: number
    flightCompanyId?: number
    carRentalCompanyId?: number
    tourCompanyId?: number
    tourId?: number
    createdAt: Date
    companyName: string
    companyDescription: string
    companyImageUrl: string
    companyLocation: string
    userName: string
    userEmail: string
}
