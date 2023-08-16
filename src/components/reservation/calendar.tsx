import {
   component$,
   useStylesScoped$,
   $,
   useStore,
   QwikMouseEvent,
   useSignal,
   useComputed$,
   QRL,
   PropFunction,
   useResource$,
} from '@builder.io/qwik'
import calendarStyle from '../reservation/calendar.scss?inline'
import { JSX } from '@builder.io/qwik/jsx-runtime'
import { Modal } from './modal'

import { days, months } from './dates'
import ChevronBtn from '../svg/chevronBtn'
import { routeLoader$ } from '@builder.io/qwik-city'
import { getReservations } from '~/services/reservation'
import { Reservation } from '~/models/reservation'
import reservation from '~/routes/reservation'
import { formatDate } from '~/helpers/helpers'

export default component$(() => {
   const getAllReservations = useResource$<Reservation[]>(async () => {
      try {
         const reservations = await getReservations()
         const formattedCreneau = reservations.map((e) => {
            const obj = {
               attributes: {
                  creneau: formatDate(e.attributes.creneau),
                  isAvailable: e.attributes.isAvailable,
                  projectDescription: e.attributes.projectDescription,
               },
            }
            return obj
         })
         return formattedCreneau
      } catch (error) {
         console.error("Une erreur s'est produite:", error)
         return []
      }
   })

   const stateReservation = useStore({
      reservations: [] as Reservation[],
   })

   // Appel de la fonction de récupération des réservations
   getAllReservations.value.then((reservations) => {
      stateReservation.reservations = reservations
   })

   console.log('stateReservation', stateReservation)

   useStylesScoped$(calendarStyle)
   const storeModalState = useStore({
      isToDelete: false,
      isShow: false,
      date: new Date(),
   })

   const storeDate = useStore({
      date: new Date(),
      annee: new Date().getFullYear(),
      mois: new Date().getMonth(),
      jour: new Date().getDay(),
      isAvailable: true,
   })

   const totalDivs = 38
   const divsPerRow = 7

   const getDatesForMonth = (): Date[] => {
      const firstDayOfMonth = new Date(storeDate.annee, storeDate.mois, 1)
      const lastDayOfMonth = new Date(storeDate.annee, storeDate.mois + 1, 0)
      const firstDayOfWeek = firstDayOfMonth.getDay()
      const lastDayOfWeek = lastDayOfMonth.getDay()
      const dates: Date[] = []

      for (let i = firstDayOfWeek; i > 0; i--) {
         const date = new Date(firstDayOfMonth)
         date.setDate(firstDayOfMonth.getDate() - i)
         dates.push(date)
      }

      for (let i = 0; i < lastDayOfMonth.getDate(); i++) {
         const date = new Date(firstDayOfMonth)
         date.setDate(firstDayOfMonth.getDate() + i)
         dates.push(date)
      }

      for (let i = 1; i < divsPerRow - lastDayOfWeek; i++) {
         const date = new Date(lastDayOfMonth)
         date.setDate(lastDayOfMonth.getDate() + i)
         dates.push(date)
      }

      return dates
   }

   const nextYear = $(() => {
      if (storeDate.mois > 11) {
         storeDate.mois = 0
         storeDate.annee += 1
      }
      if (storeDate.mois < 0) {
         storeDate.mois = 11
         storeDate.annee -= 1
      }
   })

   const previousMonth = $(() => {
      storeDate.mois -= 1
      nextYear()
   })

   const nextMonth = $(() => {
      storeDate.mois += 1
      nextYear()
   })

   const isReservationNotAvailable = $(
      (
         date: Date,
         array: { attributes: { creneau: string; isAvailable: boolean } }[]
      ): boolean => {
         return array.some(
            (obj) => date.toLocaleDateString() === obj.attributes.creneau
         )
      }
   )

   const updateReservation = $((date: Date, update: string) => {
      const existingReservationIndex = stateReservation.reservations.findIndex(
         (reservation) =>
            date.toLocaleDateString() === reservation.attributes.creneau
      )

      if (existingReservationIndex !== -1) {
         if (update === 'delete') {
            stateReservation.reservations.splice(existingReservationIndex, 1)
         } else {
            stateReservation.reservations[
               existingReservationIndex
            ].attributes.projectDescription = update
         }
      } else {
         const newReservation = {
            attributes: {
               creneau: date.toLocaleDateString(),
               isAvailable: false,
               projectDescription: update,
            },
         }
         stateReservation.reservations.push(newReservation)
      }
      console.log('store resa', stateReservation.reservations)
   })

   const reservedSlot = $((date: Date) => {
      storeDate.date = date
   })

   const onReserved = $(async (date: Date) => {
      if (
         (await isReservationNotAvailable(
            date,
            stateReservation.reservations
         )) &&
         date.getMonth() === storeDate.mois
      ) {
         storeModalState.date = date
         storeModalState.isToDelete = true
         storeModalState.isShow = true
      } else {
         storeModalState.isToDelete = false
         storeModalState.isShow = true
      }
   })

   const closeModal = $(() => {
      storeModalState.isToDelete = false // Close the modal
      storeModalState.isShow = false
   })

   const isAvailableSlot = (): boolean => {
      return stateReservation.reservations.some(
         (e) =>
            e.attributes.isAvailable === false &&
            storeDate.date.toLocaleDateString() === e.attributes.creneau
      )
   }

   function generateDivsInRows(): JSX.Element[] {
      const tableStyle = 'border-collapse: collapse; width: 100%;'
      const cellStyle = 'border: none; padding: 10px; text-align: center;'

      const rows: JSX.Element[] = []
      const dates = getDatesForMonth()

      const headerCells = days.map((day) => <th class={'cellStyle'}>{day}</th>)
      rows.push(<tr>{headerCells}</tr>)

      for (let i = 0; i < totalDivs; i += divsPerRow) {
         const rowCells = dates.slice(i, i + divsPerRow).map((date, index) => {
            const formattedDate = date.getDate().toString()

            const cellStyleWithAlignment = `border: none;   text-align: center; vertical-align: ${
               date.getDay() === i % divsPerRow ? 'top' : 'middle'
            };`

            if (date.getMonth() !== storeDate.mois) {
               return <td style={cellStyleWithAlignment} />
            }

            return (
               <td
                  style={cellStyleWithAlignment}
                  onClick$={() => reservedSlot(date)}
                  class={stateReservation.reservations.map((r: Reservation) =>
                     date.toLocaleDateString() === r.attributes.creneau &&
                     r.attributes.isAvailable === false
                        ? 'notAvailable'
                        : ''
                  )}
               >
                  {' '}
                  {formattedDate}
               </td>
            )
         })
         rows.push(<tr>{rowCells}</tr>)
      }

      return rows
   }

   return (
      <div class={'container-calendar'}>
         <header>
            <h3>
               {months[storeDate.mois]} {storeDate.annee}
            </h3>
         </header>

         <div class={'box-table-btns'}>
            <ChevronBtn
               onClick$={() => previousMonth()}
               direction="left"
            ></ChevronBtn>
            <table>
               <tbody>{generateDivsInRows()}</tbody>
            </table>
            <ChevronBtn
               onClick$={() => nextMonth()}
               direction="right"
            ></ChevronBtn>
         </div>
         <section>
            <p>Créneau sélectionné : {storeDate.date.toLocaleDateString()}</p>
            {stateReservation.reservations.map(
               (e) =>
                  e.attributes.creneau ===
                     storeDate.date.toLocaleDateString() && (
                     <div key={e.id}>
                        <h3>
                           Vous avez réservé pour le : {e.attributes.creneau}
                        </h3>
                        <p>{e.attributes.projectDescription}</p>
                        {e.attributes.isAvailable === false && (
                           <div>
                              <button
                                 onClick$={() => onReserved(storeDate.date)}
                              >
                                 Supprimer
                              </button>
                           </div>
                        )}
                     </div>
                  )
            )}
            {!stateReservation.reservations.some(
               (e) =>
                  e.attributes.creneau === storeDate.date.toLocaleDateString()
            ) && (
               <div>
                  <h3>Ce créneau est disponible</h3>
                  <button onClick$={() => onReserved(storeDate.date)}>
                     Réserver
                  </button>
               </div>
            )}
         </section>

         {
            <Modal
               isShow={storeModalState.isShow}
               isToDelete={storeModalState.isToDelete}
               onConfirm$={(value) => {
                  if (value) {
                     updateReservation(
                        storeDate.date,
                        storeModalState.isToDelete === true
                           ? 'delete'
                           : 'ajoutée'
                     )
                  }
                  closeModal()
               }}
               onCancel$={() => closeModal()}
            />
         }
      </div>
   )
})
