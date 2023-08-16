import { getToken } from '~/helpers/helpers'
import { Reservation } from '~/models/reservation'

export const getReservations = async () => {
    const token = getToken()
    console.log('token resa', token)

    try {
        const response = await fetch('http://localhost:1337/api/reservations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error('Method Not Allowed')
        }
        const data = await response.json()
        return data.data as Reservation[]
    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}
