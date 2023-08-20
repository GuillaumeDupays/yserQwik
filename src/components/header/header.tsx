import {
   component$,
   useContext,
   useSignal,
   useStore,
   useStylesScoped$,
   $,
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
      const isConnected = !userCtxt.user.blocked
      if (isConnected) {
         return (useUserStatus.isConnected = `Bonjour ${userCtxt.user.username}`)
      } else {
         return useUserStatus.isNotConnected
      }
   })
   return (
      <>
         <header>
            <ul>
               <Link href="/projets">PROJETS</Link>
            </ul>
            <ul>
               <Link href="/reservation">Réserver un créneau</Link>
            </ul>
            <ul>
               <Link href="/login">{userConnected()}</Link>
            </ul>
         </header>
      </>
   )
})
