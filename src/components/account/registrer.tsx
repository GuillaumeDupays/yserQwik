import {
   component$,
   useStore,
   useStylesScoped$,
   $,
   QwikFocusEvent,
   useVisibleTask$,
} from '@builder.io/qwik'

import registerStyle from './register.scss?inline'
import { Form } from '@builder.io/qwik-city'

export default component$(() => {
   useStylesScoped$(registerStyle)

   interface HtmlStore {
      transformLength?: number
      labelId?: HTMLElement
      labelWidth?: number
      labelClass?: string
      inputId?: HTMLInputElement
      inputWidth?: number
      nameEl: string
      isFocused: boolean
   }

   const storeHtml = useStore<HtmlStore[]>([])

   const getHtmlElements = $((nameEl: string[]) => {
      //   e.htmlId.style.setProperty(`--${e.nameEl}`, `${e.width}px`)
      for (let name of nameEl) {
         storeHtml.push({
            nameEl: name,
            isFocused: false,
         })
      }
   })

   const handleInputFocus = $((e: QwikFocusEvent) => {
      const targetName = (e.target as HTMLInputElement).name
      const label = document.querySelector(
         `label[for="${targetName}"]`
      ) as HTMLLabelElement

      const input = document.querySelector(
         `[name="${targetName}"]`
      ) as HTMLInputElement

      storeHtml.forEach((e) => {
         if (e.nameEl === targetName) {
            e.labelId = label
            e.labelWidth = label.offsetWidth
            e.inputId = input
            e.inputWidth = input.offsetWidth
            e.isFocused = true
            e.transformLength = input.offsetWidth - label.offsetWidth
            e.labelClass = ` transform: translateX(${e.transformLength}px);
   transition: transform 0.3s ease-in-out;`
         } else {
            e.isFocused = false
         }
      })
      console.log('store focus', storeHtml)
   })

   const handleInputBlur = $((e: QwikFocusEvent) => {
      const targetName = (e.target as HTMLInputElement).name
      storeHtml.forEach((e) => {
         if (e.nameEl === targetName) {
            e.isFocused = false
            e.transformLength = 0
         }
      })
   })

   useVisibleTask$(() => {
      getHtmlElements(['nom', 'prenom', 'email']) // Ajoutez d'autres champs ici
   })

   return (
      <>
         <div class={'form-card'}>
            <header>
               <h3>Votre profil</h3>
            </header>
            <Form>
               <div class={'input-row'}>
                  {storeHtml.map((item) => (
                     <div class={'input-group'} key={item.nameEl}>
                        <label
                           id={item.nameEl}
                           for={item.nameEl}
                           style={
                              item.isFocused
                                 ? item.labelClass
                                 : `transform: translateX(${item.transformLength}px);
                 transition: transform 0.3s ease-in-out;`
                           }
                        >
                           {item.nameEl}
                        </label>
                        <input
                           type="text"
                           name={item.nameEl}
                           class={'input-form'}
                           onFocus$={(e: QwikFocusEvent) => handleInputFocus(e)}
                           onBlur$={(e: QwikFocusEvent) => handleInputBlur(e)}
                        />
                     </div>
                  ))}
               </div>
               <button type="submit">Enregistrer mes informations</button>
            </Form>
         </div>
      </>
   )
})
