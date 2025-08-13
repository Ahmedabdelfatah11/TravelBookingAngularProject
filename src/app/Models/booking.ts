export interface Booking {
    id: number
  customerEmail: string
  bookingType: string
  startDate: string
  endDate: string
  totalPrice: number
  agencyDetails: any
  paymentIntentId: string
  clientSecret: string
  paymentStatus: string
}
