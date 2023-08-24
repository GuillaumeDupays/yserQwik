import { component$, useSignal, $, useStore, Slot } from '@builder.io/qwik'
import Registrer from '~/components/account/registrer'
// import ModalAccount, { ModalStore } from './modalAccount'

import Header from '~/components/header/header'

export default component$(() => {
   return (
      <div>
         <Header></Header>
         <Registrer></Registrer>
      </div>
   )
})
