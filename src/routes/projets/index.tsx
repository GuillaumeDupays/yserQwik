import {
   component$,
   $,
   useStore,
   useSignal,
   useStylesScoped$,
} from '@builder.io/qwik'
import { DocumentHead, routeLoader$ } from '@builder.io/qwik-city'
import Projets from '../../components/projets/projets'
import { Drawing } from '~/models/drawing.model'
import projet from '../../mock/projet.json'
import styleProjets from '../projets/projets.scss?inline'
import InstaPost from '~/models/instapost'
import Star from '~/components/star/star'
import Header from '~/components/header/header'

const token =
   'EAArZBObBAW7gBOZBYncYCVgu5KYZAKiEH5OfXg6c7h5R9sCBgDvHt7pZBaduXZCF4pO64nPBrreW1ysZBjTnlZB63LHIMZBWO2Uo12NJzIZCtUkajworNhOf9xSKZA8SISKZBLKwXwk4htZB5CG0cnoXGaXnN57dcv7utgXoY0BJcy9MWrYOYeLV7REmdayvsZBN7bbUwZBIPjcagEzTrNzguPYp0kqHZBqST0mZBQvp9ZCodCZCoVZBP0ZBZBSZBF86cB4FHu0QMFsZCG2ej8nYRoZD'
export const instaApi = routeLoader$(async () => {
   const url =
      'https://graph.facebook.com/me/feed?fields=object_id,permalink_url,full_picture,message'
   const res = await fetch(url, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   })
   const data = await res.json()
   return data.data as InstaPost[]
})
export const toFiltered = routeLoader$(async ({ request }) => {
   const datas = projet.data as Drawing[]
   const attributesArray = datas.map((r) => r?.attributes)

   const uniqueStylesSet = new Set(attributesArray.map((attr) => attr?.style))
   const uniqueStylesArray = Array.from(uniqueStylesSet)
   uniqueStylesArray.push('TOUS LES PROJETS')

   return uniqueStylesArray
})

export const filteredDatas = routeLoader$(() => {
   const datas = projet.data as Drawing[]

   return datas
})

export default component$(() => {
   useStylesScoped$(styleProjets)

   const postRefactoredInstaPost = () => {}

   const storePost = useStore<InstaPost[]>([])

   const storeUserPostSelection = useStore<InstaPost[]>([])

   const styleSignal = useSignal('TOUS LES PROJETS')

   const selectStyle = $((style: string) => {
      styleSignal.value = style
      return styleSignal.value
   })

   const removeTags = $((text: string) => {
      const test = text.split('#')[0]
      console.log('text', test)
      return test
   })

   const useToFiltered = toFiltered()

   const useFilteredDatas = filteredDatas()

   const useApiInsta = instaApi().value
   console.log('useApiInsta', useApiInsta)

   const selectStar = $((e: InstaPost) => {
      const existingSelection = storeUserPostSelection.find(
         (selection) => e.id === selection.id
      )

      if (existingSelection) {
         // isSelected.value = false

         // Supprimer l'élément existant de storeUserPostSelection
         const index = storeUserPostSelection.indexOf(existingSelection)
         if (index !== -1) {
            storeUserPostSelection.splice(index, 1)
         }
      } else {
         // Ajouter la nouvelle sélection à storeUserPostSelection
         const newSelection = {
            full_picture: e.full_picture,
            id: e.id,
            message: e.message,
            object_id: e.object_id,
            permalink_url: e.permalink_url,
            tarif: 220,
         }
         storeUserPostSelection.push(newSelection)
      }
      console.log('store user', storeUserPostSelection)
   })

   return (
      <>
         <Header></Header>
         {/* <div class={'container-filtered-btns'}>
                {useToFiltered.value.map(
                    (btnStyle) =>
                        btnStyle && (
                            <button
                                onClick$={() => selectStyle(btnStyle)}
                                class={
                                    btnStyle === styleSignal.value
                                        ? 'clicked'
                                        : 'filtered-btn'
                                }
                            >
                                {btnStyle}
                            </button>
                        )
                )}
            </div> */}

         <div class={'content-page'}>
            <h1>PROJETS DISPONIBLES</h1>
            <div class={'container'}>
               {useApiInsta.map((e: InstaPost) =>
                  styleSignal.value === 'TOUS LES PROJETS' ? (
                     <section class={'card'}>
                        <img
                           src={e?.full_picture}
                           width="400"
                           height="300"
                        ></img>
                        <p
                           contentEditable={
                              storeUserPostSelection.some((s) => s.id === e.id)
                                 ? 'true'
                                 : 'false'
                           }
                        >
                           {removeTags(e.message)}
                        </p>
                        <div class={'footer-card'}>
                           <Star
                              // onChange$={() =>
                              //     console.log('change', 2)
                              // }
                              isSelected={storeUserPostSelection.some(
                                 (s) => s.id === e.id
                              )}
                              onClick$={() => selectStar(e)}
                           ></Star>

                           <button
                              onClick$={() => selectStar(e)}
                              class={storePost.map((r) =>
                                 r.id === e.id ? 'clicked' : 'filtered-btn'
                              )}
                           >
                              Modifier ce post
                           </button>
                        </div>
                     </section>
                  ) : null
               )}
            </div>
         </div>

         <Projets></Projets>
      </>
   )
})

export const head: DocumentHead = {
   title: 'Projets',
   meta: [
      {
         name: 'description',
         content: 'Qwik site description',
      },
   ],
}
