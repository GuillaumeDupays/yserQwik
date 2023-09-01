import {
   component$,
   useStore,
   useStylesScoped$,
   $,
   QwikFocusEvent,
   useVisibleTask$,
   useTask$,
   useSignal,
   useContext,
} from '@builder.io/qwik'

import registerStyle from './register.scss?inline'
import { Form, useNavigate } from '@builder.io/qwik-city'
import { minLength } from '@modular-forms/qwik'
import { useStoreUser, validateForm } from '~/helpers/helpers'
import { HtmlStore, InputType, LabelType } from '~/models/inputForm'
import { inscriptionService, useTattooService } from '~/services/auth'
import { User, UserRegister } from '~/models/user'
import { UserSessionCtxt } from '~/routes/layout'

export default component$(() => {
   useStylesScoped$(registerStyle)

   const storeHtml = useStore<HtmlStore[]>([])

   const fields = [
      {
         inputName: 'username',
         type: 'text' as InputType['type'],
         required: true,
         label: 'Prénom',
         labelName: 'username',
         labelClass: '',
         labelWidth: 0,
         transformLength: 0,
      },
      {
         inputName: 'nom',
         type: 'text' as InputType['type'],
         required: true,
         label: 'Nom',
         labelName: 'nom',
         labelClass: '',
         labelWidth: 0,
         transformLength: 0,
      },
      {
         inputName: 'birthday',
         type: 'date' as InputType['type'],
         required: true,
         label: 'Date de naissance',
         labelName: 'birthday',
         labelClass: '',
         labelWidth: 0,
         transformLength: 0,
      },
      {
         inputName: 'ville',
         type: 'text' as InputType['type'],
         required: true,
         label: 'Ville de résidence',
         labelName: 'ville',
         labelClass: '',
         labelWidth: 0,
         transformLength: 0,
      },
      {
         inputName: 'phone',
         type: 'tel' as InputType['type'],
         required: true,
         label: 'Numéro de téléphone',
         labelName: 'phone',
         labelClass: '',
         labelWidth: 0,
         transformLength: 0,
      },
      {
         inputName: 'email',
         type: 'email' as InputType['type'],
         required: true,
         label: 'Email',
         labelName: 'email',
         labelClass: '',
         labelWidth: 0,
         transformLength: 0,
      },
      {
         inputName: 'password',
         type: 'password' as InputType['type'],
         required: true,
         label: 'Mot de passe',
         labelName: 'password',
         labelClass: '',
         labelWidth: 0,
         transformLength: 0,
      },
   ]

   const stepOneFields = fields.slice(0, 4)
   const stepTwoFields = fields.slice(4)
   const userCtxt = useContext(UserSessionCtxt)
   const isFormValidSignal = useSignal(false)

   interface AnimeLabelParams {
      translateLength: number
      color: string
   }

   const animeLabel = $(({ translateLength, color }: AnimeLabelParams) => {
      const animation = ` transform: translateX(${translateLength}px);
    transition: transform 0.3s ease-in-out;color: ${color}; `

      return animation
   })

   const currentStep = useSignal('stepOne') // Initially set to 'stepOne'
   const isFieldsValids = (step: any) => {
      return step!.every(({ inputName }: InputType) => {
         const item = storeHtml.find(
            (item) => item.inputType!.inputName === inputName
         )
         return item && item.isFormValid === true
      })
   }

   const isValidInput = $(async (inputValue: InputEvent) => {
      const inputElement = inputValue.target as HTMLInputElement
      const capture = inputElement.value
      const inputName = inputElement.name
      const targetInput = storeHtml.find(
         (e) => e.inputType?.inputName === inputName
      )

      const errorMessageSpan = document.querySelector(
         `label .error-message`
      ) as HTMLSpanElement

      if (targetInput) {
         targetInput.inputType!.userCapture = capture

         if (capture && errorMessageSpan) {
            targetInput.labelType!.labelClass = await animeLabel({
               translateLength: 0,
               color: 'green',
            })

            validateForm(
               targetInput.inputType?.inputName!,
               targetInput.inputType!.userCapture!,
               storeHtml
            )
         }
      }
   })

   const handleInputFocus = $((e: QwikFocusEvent) => {
      const targetName = (e.target as HTMLInputElement).name

      const width = (e.target as HTMLInputElement).offsetWidth

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

            labelType.labelClass = await animeLabel({
               translateLength: labelType.transformLength,
               color: 'green',
            })
         } else {
            inputType!.isFocused = false
            labelType!.labelClass = await animeLabel({
               translateLength: 0,
               color: 'black',
            })
         }
      })
   })

   const handleInputBlur = $(async (blurEvent: QwikFocusEvent) => {
      const targetName = (blurEvent.target as HTMLInputElement).name

      const targetInput = storeHtml.find(
         (e) => targetName === e.inputType!.inputName!
      )

      if (targetInput) {
         targetInput.inputType!.isFocused = false
         targetInput.labelType!.transformLength = 0
         targetInput.labelType!.labelClass = await animeLabel({
            translateLength: targetInput.labelType!.transformLength,
            color: 'green',
         })
         validateForm(
            targetName,
            targetInput.inputType!.userCapture!,
            storeHtml
         )
      }
   })

   useTask$(async ({ track }) => {
      fields.map(async ({ inputName, type, required, label, labelName }) => {
         const input: InputType = {
            inputName,
            type,
            required,
            isFocused: false,
         }

         const labelType: LabelType = {
            labelId: label,
            labelName,
            labelText: label,
         }

         storeHtml.push({ labelType, inputType: input })
      })
   })
   const nav = useNavigate()
   const userInfoSet = useStoreUser()
   useVisibleTask$(({ track }) => {
      track(() => {
         storeHtml.find((e) =>
            e.isFormValid!
               ? (isFormValidSignal.value = e.isFormValid)
               : (isFormValidSignal.value = false)
         )
         userCtxt
      })
      console.log('userCtxt', userCtxt)
      if (!userCtxt.connect?.blocked) {
         nav('/')
      }
   })
   const inscription = $(async () => {
      const user: UserRegister = {
         username: '',
         email: '',
         nom: '',
         birthday: '',
         ville: '',
         phone: 0,
         password: '',
      }

      storeHtml.forEach((e) => {
         isFormValidSignal.value = e.isFormValid!

         if (e.isFormValid!) {
            if (e.isFormValid!) {
               const inputName = e.inputType!.inputName
               const userCapture = e.inputType!.userCapture

               switch (inputName) {
                  case 'username':
                     user.username = userCapture!
                     break
                  case 'email':
                     user.email = userCapture!
                     break
                  case 'phone':
                     user.phone = parseInt(userCapture!)
                     break
                  case 'birthday':
                     user.birthday = userCapture!
                     break
                  case 'nom':
                     user.nom = userCapture!
                     break
                  case 'password':
                     user.password = userCapture!
                     break
                  case 'ville':
                     user.ville = userCapture!
                     break

                  default:
                     break
               }
            }
         }
      })

      inscriptionService(user)

      const login = {
         identifier: user.username,
         password: user.password,
      }
      const response = await useTattooService(login)
      if (response) {
         console.log('response', response)
         userInfoSet.setUserInfos(response.user)
         userCtxt.connect!.blocked = false
         await nav('/')
      }
   })

   const handleNextStep = $(() => {
      currentStep.value = 'stepTwo'
   })

   const handleSave = $(() => {
      // Handle save logic here
   })

   const isStepOneValid =
      currentStep.value === 'stepOne' && isFieldsValids(stepOneFields)
   const isStepTwoValid =
      currentStep.value === 'stepTwo' && isFieldsValids(stepTwoFields)

   const cardShadowClass =
      isStepOneValid || isStepTwoValid ? 'card-shadow-active' : 'card-shadow'

   return (
      <div class={`form-card ${cardShadowClass}`}>
         <header>
            <h3>Votre inscription</h3>
         </header>
         <Form>
            <div class={'input-row'}>
               {storeHtml.map((item, i) => {
                  if (
                     currentStep.value === 'stepOne' &&
                     stepOneFields.some(
                        (field) => field.inputName === item.inputType?.inputName
                     )
                  ) {
                     return (
                        <div class={'input-group'} key={i}>
                           <label
                              id={item.labelType?.labelId}
                              for={item.inputType?.inputName}
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
                              id={item.inputType?.inputName}
                              name={item.inputType?.inputName}
                              class={'input-form'}
                              placeholder={
                                 item.errorMessage
                                    ? item.labelType?.labelId
                                    : ''
                              }
                              required={true}
                              onInput$={(e: InputEvent) => isValidInput(e)}
                              onFocus$={(e: QwikFocusEvent) =>
                                 handleInputFocus(e)
                              }
                              onBlur$={(e: QwikFocusEvent) =>
                                 handleInputBlur(e)
                              }
                              max={new Date().toISOString().split('T')[0]}
                           />
                        </div>
                     )
                  }
               })}
            </div>
            <div class={'input-row'}>
               {storeHtml.map((item, i) => {
                  if (
                     currentStep.value === 'stepTwo' &&
                     stepTwoFields.some(
                        (field) => field.inputName === item.inputType?.inputName
                     )
                  ) {
                     return (
                        <div class={'input-group'} key={i}>
                           <label
                              id={item.labelType?.labelId}
                              for={item.inputType?.inputName}
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
                              id={item.inputType?.inputName}
                              name={item.inputType?.inputName}
                              class={'input-form'}
                              placeholder={
                                 item.errorMessage
                                    ? item.labelType?.labelId
                                    : ''
                              }
                              required={true}
                              onInput$={(e: InputEvent) => isValidInput(e)}
                              onFocus$={(e: QwikFocusEvent) =>
                                 handleInputFocus(e)
                              }
                              onBlur$={(e: QwikFocusEvent) =>
                                 handleInputBlur(e)
                              }
                              max={new Date().toISOString().split('T')[0]}
                           />
                        </div>
                     )
                  }
               })}
            </div>
            <footer class={'footer-form'}>
               {currentStep.value === 'stepOne' ? (
                  <button
                     type="button"
                     onClick$={handleNextStep}
                     disabled={!isFieldsValids(stepOneFields)}
                     class={`${
                        !isFieldsValids(stepOneFields)
                           ? 'disabled'
                           : 'button-animation'
                     }`}
                  >
                     Suivant
                  </button>
               ) : (
                  <>
                     <button
                        type="submit"
                        onClick$={inscription}
                        disabled={!isFieldsValids(stepTwoFields)}
                        class={
                           !isFieldsValids(stepTwoFields)
                              ? 'disabled'
                              : 'button-animation'
                        }
                     >
                        Valider
                     </button>
                  </>
               )}
            </footer>
         </Form>
      </div>
   )
})
