export interface Profile {
    firstName: string
    lastName: string
    email: string
    userName: string
    phone: string
    address: string
    dateOfBirth: string
    token: string
}
export interface ProfileParams {
    firstName?: string
    lastName?: string
    phone?: string
    address?: string
    dateOfBirth?: string
}
