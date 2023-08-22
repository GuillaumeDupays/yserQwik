import {
   component$,
   useStore,
   useStylesScoped$,
   $,
   QwikFocusEvent,
   useVisibleTask$,
   useTask$,
} from '@builder.io/qwik'

import registerStyle from './register.scss?inline'
import { Form } from '@builder.io/qwik-city'
import { minLength } from '@modular-forms/qwik'
import {
   errorMsg,
   isPhoneNumberValid,
   isUserOfLegalAge,
   validateEmail,
} from '~/helpers/helpers'
import { HtmlStore, InputType, LabelType } from '~/models/inputForm'

export default component$(() => {
   useStylesScoped$(registerStyle)

   const storeHtml = useStore<HtmlStore[]>([])

   // const initLabelAndInput = $(
   //    (
   //       nameEl: string
   //    ): {
   //       inputType: InputType | undefined
   //       labelType: LabelType | undefined
   //    } => {
   //       const label = document.querySelector(
   //          `label[for="${nameEl}"]`
   //       ) as HTMLLabelElement
   //       const input = document.querySelector(
   //          `[name="${nameEl}"]`
   //       ) as HTMLInputElement

   //       switch (nameEl) {
   //          case 'Nom':
   //             return {
   //                inputType: {
   //                   element: input,
   //                   inputName: nameEl,
   //                   type: 'text',
   //                   minLength: 3,
   //                   maxlength: 30,
   //                   required: true,
   //                   isFocused: false,
   //                },
   //                labelType: {
   //                   element: label,
   //                   labelId: nameEl, // You can adjust this as needed
   //                   labelClass: '',
   //                   labelWidth: 0,
   //                   transformLength: 0,
   //                },
   //             }
   //          case 'Prénom':
   //             return {
   //                inputType: {
   //                   inputName: nameEl,
   //                   element: input,
   //                   type: 'text',
   //                   minLength: 3,
   //                   maxlength: 30,
   //                   required: true,
   //                   isFocused: false,
   //                },
   //                labelType: {
   //                   labelId: nameEl, // You can adjust this as needed
   //                   element: label,
   //                   labelClass: '',
   //                   labelWidth: 0,
   //                   transformLength: 0,
   //                },
   //             }
   //          case 'Email':
   //             return {
   //                inputType: {
   //                   inputName: nameEl,
   //                   element: input,
   //                   type: 'email',
   //                   minLength: 3,
   //                   maxlength: 30,
   //                   required: true,
   //                   isFocused: false,
   //                },
   //                labelType: {
   //                   labelId: nameEl, // You can adjust this as needed
   //                   element: label,
   //                   labelClass: '',
   //                   labelWidth: 0,
   //                   transformLength: 0,
   //                },
   //             }
   //          case 'Numéro de téléphone':
   //             return {
   //                inputType: {
   //                   inputName: nameEl,
   //                   element: input,
   //                   type: 'tel',
   //                   minLength: 3,
   //                   maxlength: 30,
   //                   required: true,
   //                   isFocused: false,
   //                },
   //                labelType: {
   //                   labelId: nameEl, // You can adjust this as needed
   //                   element: label,
   //                   labelClass: '',
   //                   labelWidth: 0,
   //                   transformLength: 0,
   //                },
   //             }
   //          case 'Date de naissance':
   //             return {
   //                inputType: {
   //                   inputName: nameEl,
   //                   element: input,
   //                   type: 'date',
   //                   minLength: 3,
   //                   maxlength: 30,
   //                   required: true,
   //                   isFocused: false,
   //                },
   //                labelType: {
   //                   labelId: nameEl, // You can adjust this as needed
   //                   element: label,
   //                   labelClass: '',
   //                   labelWidth: 0,
   //                   transformLength: 0,
   //                },
   //             }
   //          case 'Ville de résidence':
   //             return {
   //                inputType: {
   //                   inputName: nameEl,
   //                   element: input,
   //                   type: 'text',
   //                   minLength: 3,
   //                   maxlength: 30,
   //                   required: true,
   //                   isFocused: false,
   //                },
   //                labelType: {
   //                   labelId: nameEl, // You can adjust this as needed
   //                   element: label,
   //                   labelClass: '',
   //                   labelWidth: 0,
   //                   transformLength: 0,
   //                },
   //             }
   //          // ... Define other input types similarly
   //          default:
   //             console.log(`Sorry, we are out of ${nameEl}.`)
   //             return { inputType: undefined, labelType: undefined }
   //       }
   //    }
   // )

   const fields = [
      {
         inputName: 'first_name',
         type: 'text',
         required: true,
         label: 'Prénom',
         labelName: 'first_name',
         labelClass: '',
         labelWidth: 0,
         transformLength: 0,
      },
      {
         inputName: 'last_name',
         type: 'text',
         required: true,
         label: 'Nom',
         labelName: 'last_name',
         labelClass: '',
         labelWidth: 0,
         transformLength: 0,
      },
      {
         inputName: 'birthday',
         type: 'date',
         required: true,
         label: 'Date de naissance',
         labelName: 'birthday',
         labelClass: '',
         labelWidth: 0,
         transformLength: 0,
      },
      {
         inputName: 'email',
         type: 'email',
         required: true,
         label: 'Email',
         labelName: 'email',
         labelClass: '',
         labelWidth: 0,
         transformLength: 0,
      },
      {
         inputName: 'phone_number',
         type: 'tel',
         required: true,
         label: 'Numéro de téléphone',
         labelName: 'phone_number',
         labelClass: '',
         labelWidth: 0,
         transformLength: 0,
      },
   ]

   const measureElementWidth = $((element: HTMLElement): number => {
      const styles = window.getComputedStyle(element)
      document.body.appendChild(element)
      const width = element.offsetWidth
      document.body.removeChild(element)
      return width
   })

   const createInput = $(
      async (
         inputName: string,
         type: InputType['type'],
         required: boolean
      ): Promise<InputType> => {
         const element = document.createElement('input')
         element.type = type

         const input: InputType = {
            inputName,
            element,
            type,
            required,
            isFocused: false,
         }

         const inputWidth = await measureElementWidth(element)
         input.inputWidth = inputWidth

         return input
      }
   )

   const createLabel = $(
      async (
         labelId: string,
         labelText: string,
         labelName: string
      ): Promise<LabelType> => {
         const element = document.createElement('label')
         element.textContent = labelText
         const label: LabelType = { element, labelId, labelName }
         const labelWidth = await measureElementWidth(element)

         label.element.htmlFor = labelId
         label.labelWidth = labelWidth

         return label
      }
   )

   console.log('storeHtmlfirst', storeHtml)

   const animeLabel = $((length: number, color: string) => {
      const animation = ` transform: translateX(${length}px);
    transition: transform 0.3s ease-in-out;color: ${color}`

      return animation
   })
   const isValidInput = $(async (inputValue: InputEvent) => {
      const capture = (inputValue.target as HTMLInputElement).value
      const inputType = (inputValue.target as HTMLInputElement).type

      const targetInput = storeHtml.find((e) => e.inputType!.type === inputType)

      const isValid = capture.length >= 2
      const color = isValid ? 'green' : 'red'

      // targetInput!.labelClass = await animeLabel(
      //    targetInput!.transformLength!,
      //    color
      // )
      if (targetInput) {
         targetInput.inputType!.userCapture = capture

         errorMsg(
            targetInput.inputType?.type!,
            targetInput.inputType!.userCapture!,
            storeHtml
         )
      }
   })

   const handleInputFocus = $((e: QwikFocusEvent) => {
      const targetName = (e.target as HTMLInputElement).name
      console.log('targetname', targetName)

      storeHtml.forEach(async (item) => {
         if (item.labelType?.labelName === targetName) {
            item.inputType!.isFocused = true

            item.labelType.transformLength =
               item.inputType?.inputWidth! - item.labelType.labelWidth!

            item.labelType.labelClass = await animeLabel(
               item.labelType.transformLength,
               'red'
            )
         } else {
            item.inputType!.isFocused = false
            item.labelType!.labelClass = await animeLabel(0, 'blue')
         }
      })
   })

   const handleInputBlur = $((blurEvent: QwikFocusEvent) => {
      const targetName = (blurEvent.target as HTMLInputElement).name

      const targetInput = storeHtml.find(
         (e) => e.inputType!.inputName === targetName
      )
      console.log('targetInput', targetInput)

      if (targetInput) {
         targetInput.inputType!.isFocused = false
         targetInput.labelType!.transformLength = 0

         errorMsg(
            targetInput.inputType?.type!,
            targetInput.inputType!.userCapture!,
            storeHtml
         )
      }
   })

   useTask$(() => {
      fields.forEach(
         async ({ inputName, type, required, label, labelName }) => {
            const input = await createInput(
               inputName,
               type as InputType['type'],
               required
            )
            const labelEl = await createLabel(`${label}`, label, labelName)

            storeHtml.push({ labelType: labelEl, inputType: input })
         }
      )
   })

   return (
      <>
         <div class={'form-card'}>
            <header>
               <h3>Votre profil</h3>
            </header>
            <Form>
               <div class={'input-row'}>
                  {storeHtml.map((item, i) => (
                     <div class={'input-group'} key={i}>
                        <label
                           id={item.labelType?.labelId}
                           for={item.labelType?.labelName}
                           style={
                              item.inputType?.isFocused
                                 ? item.labelType?.labelClass
                                 : `transform: translateX(${item.labelType?.transformLength}px);
                 transition: transform 0.3s ease-in-out;`
                           }
                        >
                           {item.errorMessage ? (
                              <span class="error-message">
                                 {item.errorMessage}
                              </span>
                           ) : (
                              item.labelType?.labelId
                           )}
                        </label>
                        <input
                           type={item.inputType?.type}
                           name={item.inputType?.inputName}
                           class={'input-form'}
                           width={item.inputType?.inputWidth}
                           required={true}
                           onInput$={(e: InputEvent) => isValidInput(e)}
                           onFocus$={(e: QwikFocusEvent) => handleInputFocus(e)}
                           onBlur$={(e: QwikFocusEvent) => handleInputBlur(e)}
                           max={new Date().toISOString().split('T')[0]}
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
