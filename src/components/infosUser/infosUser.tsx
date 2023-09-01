import {
   component$,
   useContext,
   useSignal,
   useStore,
   useStylesScoped$,
   $,
   useVisibleTask$,
} from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import styleHeader from '../header/header.scss?inline'
import { UserSessionCtxt } from '~/routes/layout'
export default component$(() => {
   useStylesScoped$(styleHeader)
   const userCtxt = useContext(UserSessionCtxt)
   console.log('userCtxt', userCtxt)
   const useUserStatus = useStore({
      isConnected: '',
      isNotConnected: "Se connecter/s'inscrire",
   })
   const userConnected = $(() => {
      const isConnected = !userCtxt!.connect!.blocked!
      if (isConnected) {
         return (useUserStatus.isConnected = `Bonjour ${
            userCtxt!.connect!.infos!.username
         }`)
      } else {
         return useUserStatus.isNotConnected
      }
   })

   return (
      <>
         <header>
            <h3>Espace personnel</h3>
         </header>
      </>
   )
})
