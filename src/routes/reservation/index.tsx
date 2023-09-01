import { component$, useStylesScoped$, $ } from '@builder.io/qwik'
import Header from '~/components/header/header'
import Calendar from '~/components/reservation/calendar'

export default component$(() => {
   return (
      <div style={`height: calc(100vh - 50px)`}>
         <Calendar></Calendar>
      </div>
   )
})
