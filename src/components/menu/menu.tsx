// import {
//    component$,
//    useContext,
//    useSignal,
//    useStore,
//    useStylesScoped$,
//    $,
//    useVisibleTask$,
// } from '@builder.io/qwik'
// import { DocumentHead, Link } from '@builder.io/qwik-city'
// import styleHeader from '../header/header.scss?inline'
// import { UserSessionCtxt } from '~/routes/layout'
// export default component$(() => {
//    useStylesScoped$(styleHeader)
//    //  const userCtxt = useContext(UserSessionCtxt)
//    //  console.log('userCtxt', userCtxt)
//    //  const useUserStatus = useStore({
//    //     isConnected: '',
//    //     isNotConnected: "Se connecter/s'inscrire",
//    //  })
//    //  const userConnected = $(() => {
//    //     const isConnected = !userCtxt!.connect!.blocked!
//    //     if (isConnected) {
//    //        return (useUserStatus.isConnected = `Bonjour ${
//    //           userCtxt!.connect!.infos!.username
//    //        }`)
//    //     } else {
//    //        return useUserStatus.isNotConnected
//    //     }
//    //  })
//    const isMenuOpen = useSignal(false)
//    const openMenu = $(() => (isMenuOpen.value = true))

//    const userCtxt = useContext(UserSessionCtxt)
//    console.log('userCtxt', userCtxt)
//    const useUserStatus = useStore({
//       isConnected: '',
//       isNotConnected: "Se connecter/s'inscrire",
//    })
//    const userConnected = $(() => {
//       const isConnected = !userCtxt!.connect!.blocked!
//       if (isConnected) {
//          return (useUserStatus.isConnected = `Bonjour ${
//             userCtxt!.connect!.infos!.username
//          }`)
//       } else {
//          return useUserStatus.isNotConnected
//       }
//    })

//    useVisibleTask$(({ track }) => {
//       track(() => isMenuOpen.value)
//       console.log('isMne', isMenuOpen.value)
//    })
//    return (
//       <>
//          {/* <ul class={'animated-link '}>
//                <Link href="/projets" style={'text-decoration: none'}>
//                   PROJETS
//                </Link>
//             </ul>
//             <ul class={'animated-link '}>
//                <Link href="/reservation" style={'text-decoration: none'}>
//                   Réserver un créneau
//                </Link>
//             </ul>
//             <ul class={'animated-link '}>
//                <Link href="/login" style={'text-decoration: none'}>
//                   {userConnected()}
//                </Link>
//             </ul> */}
//          <ul onClick$={() => openMenu()}>
//             <svg
//                xmlns="http://www.w3.org/2000/svg"
//                id="Isolation_Mode"
//                data-name="Isolation Mode"
//                viewBox="0 0 24 24"
//                width="25"
//                height="25"
//             >
//                <circle cx="12" cy="2.5" r="2.5" />
//                <circle cx="12" cy="12" r="2.5" />
//                <circle cx="12" cy="21.5" r="2.5" />
//             </svg>
//          </ul>

//          <section>
//             <Link style={'text-decoration: none'} href="/reservation">
//                Réserver un créneau
//             </Link>

//             <Link style={'text-decoration: none'} href="/projets">
//                Projets disponibles
//             </Link>

//             <Link href="/login" style={'text-decoration: none'}>
//                {userConnected()}
//             </Link>
//          </section>
//       </>
//    )
// })

// export const head: DocumentHead = {
//    title: 'BURGER',
// }
// BurgerMenu.qwik.js

import {
   component$,
   useSignal,
   $,
   useStylesScoped$,
   useContext,
   useStore,
} from '@builder.io/qwik'

import styleMenu from '../menu/menu.scss?inline'
import { Link } from '@builder.io/qwik-city'
import { UserSessionCtxt } from '~/routes/layout'
const ROUTES = {
   home: `/`,
   reservation: `/reservation`,
   login: `/login`,
   projets: `/projets`,
   // Ajoutez d'autres routes ici
}

export default component$(() => {
   useStylesScoped$(styleMenu)
   // const [isOpen, setIsOpen] = useState(false);
   const isOpen = useSignal(false)

   const toggleMenu = $(() => {
      isOpen.value = !isOpen.value
   })

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
      <div class="burger-menu">
         <button
            class={isOpen.value ? 'burger-icon open' : 'burger-icon'}
            onClick$={toggleMenu}
         >
            <svg
               xmlns="http://www.w3.org/2000/svg"
               id="Isolation_Mode"
               data-name="Isolation Mode"
               viewBox="0 0 24 24"
               width="30"
               height="30"
            >
               <circle cx="12" cy="2.5" r="2.5" />
               <circle cx="12" cy="12" r="2.5" />
               <circle cx="12" cy="21.5" r="2.5" />
            </svg>
         </button>
         <nav class={isOpen.value ? 'menu-items open' : 'menu-items'}>
            <Link
               href={`${ROUTES.home}`}
               onClick$={toggleMenu}
               style={
                  'text-decoration: none; display: flex;margin: 0;align-items: center;column-gap: 1em'
               }
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
               >
                  <g id="_01_align_center" data-name="01 align center">
                     <path d="M13.338.833a2,2,0,0,0-2.676,0L0,10.429v10.4a3.2,3.2,0,0,0,3.2,3.2H20.8a3.2,3.2,0,0,0,3.2-3.2v-10.4ZM15,22.026H9V17a3,3,0,0,1,6,0Zm7-1.2a1.2,1.2,0,0,1-1.2,1.2H17V17A5,5,0,0,0,7,17v5.026H3.2a1.2,1.2,0,0,1-1.2-1.2V11.319l10-9,10,9Z" />
                  </g>
               </svg>
               Accueil
            </Link>
            <Link
               href={`${ROUTES.projets}`}
               onClick$={toggleMenu}
               style={
                  'text-decoration: none; display: flex;margin: 0;align-items: center;column-gap: 1em'
               }
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Outline"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
               >
                  <path d="M23.836,8.794a3.179,3.179,0,0,0-3.067-2.226H16.4L15.073,2.432a3.227,3.227,0,0,0-6.146,0L7.6,6.568H3.231a3.227,3.227,0,0,0-1.9,5.832L4.887,15,3.535,19.187A3.178,3.178,0,0,0,4.719,22.8a3.177,3.177,0,0,0,3.8-.019L12,20.219l3.482,2.559a3.227,3.227,0,0,0,4.983-3.591L19.113,15l3.56-2.6A3.177,3.177,0,0,0,23.836,8.794Zm-2.343,1.991-4.144,3.029a1,1,0,0,0-.362,1.116L18.562,19.8a1.227,1.227,0,0,1-1.895,1.365l-4.075-3a1,1,0,0,0-1.184,0l-4.075,3a1.227,1.227,0,0,1-1.9-1.365L7.013,14.93a1,1,0,0,0-.362-1.116L2.507,10.785a1.227,1.227,0,0,1,.724-2.217h5.1a1,1,0,0,0,.952-.694l1.55-4.831a1.227,1.227,0,0,1,2.336,0l1.55,4.831a1,1,0,0,0,.952.694h5.1a1.227,1.227,0,0,1,.724,2.217Z" />
               </svg>
               Projets
            </Link>
            <Link
               href={`${ROUTES.reservation}`}
               onClick$={toggleMenu}
               style={
                  'text-decoration: none; display: flex;margin: 0;align-items: center;column-gap: 1em'
               }
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Layer_1"
                  data-name="Layer 1"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
               >
                  <path d="M12,24C5.383,24,0,18.617,0,12S5.383,0,12,0s12,5.383,12,12-5.383,12-12,12Zm0-22C6.486,2,2,6.486,2,12s4.486,10,10,10,10-4.486,10-10S17.514,2,12,2Zm2.5,14.33c.479-.276,.643-.888,.366-1.366l-1.866-3.232V6c0-.552-.447-1-1-1s-1,.448-1,1v6c0,.176,.046,.348,.134,.5l2,3.464c.186,.321,.521,.5,.867,.5,.17,0,.342-.043,.499-.134Z" />
               </svg>
               Réserver un créneau
            </Link>

            <Link
               href={`${ROUTES.login}`}
               onClick$={toggleMenu}
               style={
                  'text-decoration: none; display: flex;margin: 0;align-items: center;column-gap: 1em'
               }
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Layer_1"
                  data-name="Layer 1"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
               >
                  <path d="M11.24,24a2.262,2.262,0,0,1-.948-.212,2.18,2.18,0,0,1-1.2-2.622L10.653,16H6.975A3,3,0,0,1,4.1,12.131l3.024-10A2.983,2.983,0,0,1,10,0h3.693a2.6,2.6,0,0,1,2.433,3.511L14.443,8H17a3,3,0,0,1,2.483,4.684l-6.4,10.3A2.2,2.2,0,0,1,11.24,24ZM10,2a1,1,0,0,0-.958.71l-3.024,10A1,1,0,0,0,6.975,14H12a1,1,0,0,1,.957,1.29L11.01,21.732a.183.183,0,0,0,.121.241A.188.188,0,0,0,11.4,21.9l6.4-10.3a1,1,0,0,0,.078-1.063A.979.979,0,0,0,17,10H13a1,1,0,0,1-.937-1.351l2.19-5.84A.6.6,0,0,0,13.693,2Z" />
               </svg>
               {userConnected()}
            </Link>
         </nav>
      </div>
   )
})
