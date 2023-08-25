import { component$, useSignal, $, useStore, Slot } from '@builder.io/qwik'
import Registrer from '~/components/account/registrer'
// import ModalAccount, { ModalStore } from './modalAccount'

import Header from '~/components/header/header'

export default component$(() => {
   return (
      <div
         style={`height: 100vh;
    display: flex;
    flex-direction: column;`}
      >
         <Header></Header>
         <Registrer></Registrer>
      </div>
   )
})
