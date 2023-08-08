import { component$, useStylesScoped$, $ } from '@builder.io/qwik'
import Calendar from '~/components/reservation/calendar'

export default component$(() => {
    return (
        <div>
            <Calendar></Calendar>
        </div>
    )
})
