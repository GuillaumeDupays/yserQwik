import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import {
   useLocation,
   type DocumentHead,
   useNavigate,
} from '@builder.io/qwik-city'
import AnimeAccueil from '~/components/animationAccueil/animeAccueil'
import Header from '~/components/header/header'
import LoaderAccueil from '~/components/loader-accueil/loaderAccueil'
import Menu from '~/components/menu/menu'

export default component$(() => {
   const isLoading = useSignal(true)
   useVisibleTask$(() => {
      setTimeout(() => {
         isLoading.value = false
      }, 2000) // 2000 ms (2 secondes)
   })

   return (
      <>
         <AnimeAccueil></AnimeAccueil>
         {/* <LoaderAccueil></LoaderAccueil> */}
         {/* {!isLoading.value && <h3>Bienvenue</h3>} */}
      </>
   )
})

export const head: DocumentHead = {
   title: 'Welcome to Qwik',
   meta: [
      {
         name: 'description',
         content: 'Qwik site description',
      },
   ],
}
