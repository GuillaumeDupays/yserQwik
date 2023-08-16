export interface Reservation {
    id?: number
    attributes: {
        creneau: string
        isAvailable: boolean
        projectDescription: string
        users_permissions_user?: number
    }
}
