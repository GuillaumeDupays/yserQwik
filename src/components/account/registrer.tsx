import {
   component$,
   useStore,
   useStylesScoped$,
   $,
   QwikFocusEvent,
   useVisibleTask$,
   useTask$,
   useSignal,
} from '@builder.io/qwik'

import registerStyle from './register.scss?inline'
import { Form } from '@builder.io/qwik-city'
import { minLength } from '@modular-forms/qwik'
import { errorMsg } from '~/helpers/helpers'
import { HtmlStore, InputType, LabelType } from '~/models/inputForm'

export default component$(() => {
   useStylesScoped$(registerStyle)

   const storeHtml = useStore<HtmlStore[]>([])

   const fields = [
      {
         inputName: 'prenom',
         type: 'text',
         required: true,
         label: 'Prénom',
         labelName: 'prenom',
         labelClass: '',
         labelWidth: 0,
         transformLength: 0,
      },
      {
         inputName: 'nom',
         type: 'text',
         required: true,
         label: 'Nom',
         labelName: 'nom',
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

   const useInputValueSignal = useSignal('')
   const useErrorMsgWidthSignal = useSignal(0)

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

         label.element.htmlFor = labelId

         return label
      }
   )
   interface AnimeLabelParams {
      translateLength: number
      color: string
   }

   const animeLabel = $(({ translateLength, color }: AnimeLabelParams) => {
      const animation = ` transform: translateX(${translateLength}px);
    transition: transform 0.3s ease-in-out;color: ${color}; `

      return animation
   })

   const isValidInput = $(async (inputValue: InputEvent) => {
      const capture = (inputValue.target as HTMLInputElement).value
      const inputName = (inputValue.target as HTMLInputElement).name
      const targetInput = storeHtml.find(
         (e) => inputName === e.inputType!.inputName
      )
      const errorMessageSpan = document.querySelector(
         `label .error-message`
      ) as HTMLSpanElement

      if (targetInput) {
         useInputValueSignal.value = capture
         targetInput.inputType!.userCapture = useInputValueSignal.value
         if (useInputValueSignal.value) {
            if (errorMessageSpan) {
               targetInput.labelType!.labelClass = await animeLabel({
                  translateLength: 0,
                  color: 'green',
               })
               errorMsg(
                  targetInput.inputType?.inputName!,
                  targetInput.inputType!.userCapture!,
                  storeHtml
               )
            }
         }
      }
   })

   const handleInputFocus = $((e: QwikFocusEvent) => {
      const targetName = (e.target as HTMLInputElement).name
      console.log('targetname', targetName)
      const width = (e.target as HTMLInputElement).offsetWidth
      console.log('width direct', width)
      const labelWidth = document.querySelector(
         `label[for="${targetName}"]`
      ) as HTMLLabelElement

      storeHtml.forEach(async ({ labelType, inputType }) => {
         if (labelType?.labelName === targetName) {
            inputType!.isFocused = true
            inputType!.inputWidth = width
            labelType.labelWidth = labelWidth.offsetWidth
            labelType.transformLength =
               inputType?.inputWidth! - labelType.labelWidth!
            console.log(
               'FOCUS labelType.transformLength',
               labelType.transformLength
            )

            labelType.labelClass = await animeLabel({
               translateLength: labelType.transformLength,
               color: 'green',
            })
         } else {
            inputType!.isFocused = false
            labelType!.labelClass = await animeLabel({
               translateLength: 0,
               color: 'blue',
            })
         }
      })
   })

   const handleInputBlur = $(async (blurEvent: QwikFocusEvent) => {
      const targetName = (blurEvent.target as HTMLInputElement).name
      console.log('targetname', targetName)

      const targetInput = storeHtml.find(
         (e) => targetName === e.inputType!.inputName!
      )
      console.log('targetInput', targetInput)

      if (targetInput) {
         targetInput.inputType!.isFocused = false
         targetInput.labelType!.transformLength = 0
         targetInput.labelType!.labelClass = await animeLabel({
            translateLength: targetInput.labelType!.transformLength,
            color: 'green',
         })
         errorMsg(targetName, targetInput.inputType!.userCapture!, storeHtml)
      }
   })

   useTask$(({ track }) => {
      const promises = fields.map(
         async ({ inputName, type, required, label, labelName }) => {
            const input = await createInput(
               inputName,
               type as InputType['type'],
               required
            )
            const labelEl = await createLabel(`${label}`, label, labelName)

            return { labelType: labelEl, inputType: input }
         }
      )

      Promise.all(promises).then((results) => {
         results.forEach(({ labelType, inputType }) => {
            storeHtml.push({ labelType, inputType })
         })
      })
   })

   useVisibleTask$(({ track }) => {
      track(() => {
         useInputValueSignal.value, useErrorMsgWidthSignal.value
      })
      console.log(' useErrorMsgWidthSignal.value', useErrorMsgWidthSignal.value)
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
                           style={item.labelType?.labelClass}
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
                           placeholder={
                              item.errorMessage ? item.labelType?.labelId : ''
                           }
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
