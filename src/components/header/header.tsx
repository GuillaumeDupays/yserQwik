import { component$, $, useSignal, useTask$ } from '@builder.io/qwik'
import { useNavigate, useLocation, Link } from '@builder.io/qwik-city'

export default component$(() => {
   const isMenuOpen = useSignal(false) // État pour gérer l'ouverture/fermeture du menu
   const navigate = useNavigate()
   const location = useLocation()

   const toggleMenu = $(() => {
      isMenuOpen.value = !isMenuOpen.value
   })

   return (
      <>
         {/* Bouton pour ouvrir/fermer le menu */}
         <button onClick$={toggleMenu} class="burger-button">
            OPENB
         </button>

         {/* Utilisation du composant conditionnellement pour afficher le menu */}
         {isMenuOpen.value && (
            <>
               <ul>
                  <Link style={'text-decoration: none'} href="/reservation">
                     Réserver un créneau
                  </Link>
               </ul>
               <ul>
                  <Link style={'text-decoration: none'} href="/projets">
                     Projets disponibles
                  </Link>
               </ul>
               <ul>
                  <Link href="/login" style={'text-decoration: none'}>
                     {/* {userConnected()} */}Login
                  </Link>
               </ul>
            </>
         )}
      </>
   )
})
