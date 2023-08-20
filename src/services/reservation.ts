import { convertDateFormatToBack, getToken } from '~/helpers/helpers'
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
export const postReservation = async (reservation: Reservation) => {
   console.log('reservation', reservation)

   const creneau = convertDateFormatToBack(reservation.attributes.creneau)

   let reservationFormatted = {
      creneau: creneau,
      isAvailable: reservation.attributes.isAvailable,
      projectDescription: reservation.attributes.projectDescription,
      users_permissions_user: {
         connect: [{ id: 2 }],
      },
   }

   let resa = { data: reservationFormatted }
   try {
      const response = await fetch('http://localhost:1337/api/reservations', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            Authorization: `Bearer ${getToken()}`,
         },
         body: JSON.stringify(resa),
      })

      if (!response.ok) {
         throw new Error('Method Not Allowed')
      }

      const data = await response.json()

      return data
   } catch (error) {
      console.error('Error:', error)
      throw error
   }
}

export const deleteReservation = async (reservationId: number) => {
   try {
      const response = await fetch(
         `http://localhost:1337/api/reservations/${reservationId}`,
         {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
               Accept: '*/*',
               Authorization: `Bearer ${getToken()}`,
            },
         }
      )

      if (!response.ok) {
         throw new Error('Method Not Allowed')
      }

      const data = await response.json()

      return data
   } catch (error) {
      console.error('Error:', error)
      throw error
   }
}
