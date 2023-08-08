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
} from '@builder.io/qwik'
import calendarStyle from '../reservation/calendar.scss?inline'
import { JSX } from '@builder.io/qwik/jsx-runtime'
import { Modal } from './modal'

import { days, months } from './dates'

export default component$(() => {
    useStylesScoped$(calendarStyle)
    const storeModalState = useStore({
        show: false,
        date: new Date(),
    })

    const storeReservation = useStore([
        {
            user: '',
            dateResa: new Date().toLocaleDateString(),
            isReserved: true,
            commentaire: '',
        },
    ])

    const storeDate = useStore({
        date: new Date(),
        annee: new Date().getFullYear(),
        mois: new Date().getMonth(),
        jour: new Date().getDay(),
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

    const resaCanBeModified = $(
        (date: Date, array: { dateResa: string }[]): boolean => {
            return array.some(
                (obj) => date.toLocaleDateString() === obj.dateResa
            )
        }
    )

    const updateReservation = $((date: Date, update: string) => {
        const existingReservationIndex = storeReservation.findIndex(
            (reservation) => date.toLocaleDateString() === reservation.dateResa
        )

        if (existingReservationIndex !== -1) {
            if (update === 'delete') {
                storeReservation.splice(existingReservationIndex, 1)
            } else {
                storeReservation[existingReservationIndex].commentaire = update
            }
        } else {
            const newReservation = {
                user: '',
                timeResa: '',
                dateResa: date.toLocaleDateString(),
                isReserved: true,
                commentaire: update,
            }
            storeReservation.push(newReservation)
        }
        console.log('store resa', storeReservation)
    })

    const reservedSlot = $((date: Date) => {
        storeDate.date = date
    })

    const onReserved = $(async (date: Date) => {
        console.log('date onreserved', date)
        console.log('storeReservation on reserved', storeReservation)

        if (
            (await resaCanBeModified(date, storeReservation)) &&
            date.getMonth() === storeDate.mois
        ) {
            storeModalState.date = date
            storeModalState.show = true
        } else {
            const updateReservationValue = window.prompt(
                'Voulez-vous ajouter cette réservation ?'
            )
            if (updateReservationValue) {
                updateReservation(date, updateReservationValue)
            }
        }
    })

    const closeModal = $(() => {
        storeModalState.show = false // Close the modal
    })

    function generateDivsInRows(): JSX.Element[] {
        const tableStyle = 'border-collapse: collapse; width: 100%;'
        const cellStyle =
            'border: 1px solid #ccc; padding: 10px; text-align: center;'

        const rows: JSX.Element[] = []
        const dates = getDatesForMonth()

        const headerCells = days.map((day) => <th style={cellStyle}>{day}</th>)
        rows.push(<tr>{headerCells}</tr>)

        for (let i = 0; i < totalDivs; i += divsPerRow) {
            const rowCells = dates
                .slice(i, i + divsPerRow)
                .map((date, index) => {
                    const formattedDate = date.getDate().toString()

                    const cellStyleWithAlignment = `border: 1px solid #ccc; padding: 10px; text-align: center; vertical-align: ${
                        date.getDay() === i % divsPerRow ? 'top' : 'middle'
                    };`

                    if (date.getMonth() !== storeDate.mois) {
                        return <td style={cellStyleWithAlignment} />
                    }

                    return (
                        <td
                            style={cellStyleWithAlignment}
                            onClick$={() => reservedSlot(date)}
                            class={storeReservation.map((e) =>
                                date.toLocaleDateString() === e.dateResa &&
                                e.isReserved
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
            <h3>
                {months[storeDate.mois]} {storeDate.annee}
            </h3>
            <button onClick$={() => previousMonth()}>Left</button>
            <button onClick$={() => nextMonth()}>Right</button>
            <p>Nous sommes aujourd'hui {days[storeDate.jour - 1]}</p>

            <table>
                <tbody>{generateDivsInRows()}</tbody>
            </table>
            <section>
                <p>
                    Vous avez sélectionné :{' '}
                    {storeDate.date.toLocaleDateString()}
                </p>
                {!storeReservation.some(
                    (e) =>
                        e.isReserved &&
                        storeDate.date.toLocaleDateString() === e.dateResa
                ) && (
                    <button onClick$={() => onReserved(storeDate.date)}>
                        Réserver
                    </button>
                )}
                {storeReservation.map((e) =>
                    storeDate.date.toLocaleDateString() === e.dateResa ? (
                        <div>
                            <p>Vous avez réservé pour le : {e.dateResa}</p>
                            <p>{e.commentaire}</p>
                            {e.isReserved && (
                                <button
                                    onClick$={() => onReserved(storeDate.date)}
                                >
                                    Supprimer
                                </button>
                            )}
                        </div>
                    ) : (
                        'pas réservé'
                    )
                )}
            </section>

            {storeModalState.show && (
                <Modal
                    onConfirm$={(value) => {
                        if (value) {
                            updateReservation(storeDate.date, 'delete')
                        }
                        closeModal()
                    }}
                    onCancel$={() => closeModal()}
                />
            )}
        </div>
    )
})
