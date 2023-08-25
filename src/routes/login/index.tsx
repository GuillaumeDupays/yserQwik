import { component$, useSignal, $, useStore, Slot } from '@builder.io/qwik'
// import ModalAccount, { ModalStore } from './modalAccount'
import { Form, routeAction$ } from '@builder.io/qwik-city'
import Account from '~/components/account/account'
import Registrer from '~/components/account/registrer'
import Header from '~/components/header/header'

export default component$(() => {
   return (
      <div
         style={`height: calc(100vh - 53px);
    display: flex;
    flex-direction: column;`}
      >
         <Header></Header>
         <Account></Account>
      </div>
   )
})
