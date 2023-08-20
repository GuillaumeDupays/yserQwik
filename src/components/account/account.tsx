import {
   component$,
   useSignal,
   $,
   useStore,
   QwikChangeEvent,
   useContext,
   useStylesScoped$,
   QwikMouseEvent,
   QwikTouchEvent,
} from '@builder.io/qwik'
import ModalAccount, { ModalStore } from './modalAccount'
import { Form, routeAction$ } from '@builder.io/qwik-city'
import styleLogin from '../account/login.scss?inline'
import {
   UserInfo,
   isEqualString,
   removeToken,
   useStoreUser,
   validateEmail,
   validatePassword,
} from '~/helpers/helpers'
import { reset } from '@modular-forms/qwik'
import { useTattooService } from '~/services/auth'
import { UserSessionCtxt } from '~/routes/layout'
import Registrer from './registrer'

interface LoginForm {
   identifier: string
   password: string
}

export const useLoginAction = routeAction$(async (data, requestEvent) => {
   console.log('data', { data, requestEvent })

   return {
      success: true,
      result: data,
   }
})

export default component$(() => {
   useStylesScoped$(styleLogin)

   const isRegister = useSignal(false)

   const storeFormData = useStore<LoginForm>({
      identifier: '',
      password: '',
   })

   const storeErrorMessages = useStore<{ [key: string]: string }>({
      identifier: '',
      password: '',
      connectionError: '',
   })

   const handleInput = $(
      (
         e: Event,
         validationFn: (value: string) => boolean,
         fieldName: keyof LoginForm,
         invalidMessage: string
      ) => {
         const capture = e.target as HTMLInputElement
         const value = capture.value.trim()
         const name = capture.name
         console.log('name', name)

         const isValid = validationFn(value)
         storeErrorMessages[fieldName] = isValid ? '' : invalidMessage
         storeFormData[fieldName] = value
      }
   )

   const handleInputEmail = $((e: Event) => {
      handleInput(
         e,
         validateEmail,
         'identifier',
         'Veuillez saisir un email valide'
      )
   })

   const handleInputPassword = $((e: Event) => {
      handleInput(
         e,
         validatePassword,
         'password',
         'Le mot de passe doit contenir au moins 8 caractères'
      )
   })

   const action = useLoginAction()

   const userInfoSet = useStoreUser()
   const userCtxt = useContext(UserSessionCtxt)

   const handleSubmit = $(async () => {
      console.log('storeFormData submit', storeFormData)

      const emailValid = validateEmail(storeFormData.identifier)
      const passwordValid = validatePassword(storeFormData.password)

      storeErrorMessages.identifier = emailValid
         ? ''
         : 'Veuillez saisir un email valide'
      storeErrorMessages.password = passwordValid
         ? ''
         : 'Le mot de passe doit contenir au moins 8 caractères'

      if (emailValid && passwordValid) {
         // const result = await action(storeFormData)

         try {
            const response = await useTattooService({
               identifier: storeFormData.identifier,
               password: storeFormData.password,
            })

            if (response) {
               userInfoSet.setUserInfos(response)
               userCtxt.user.blocked = false
               storeFormData.identifier = ''
               storeFormData.password = ''
               storeErrorMessages.connectionError = ''
            }
         } catch (error) {
            // Afficher un message d'erreur de connexion
            storeErrorMessages.connectionError =
               'Erreur de connexion, veuillez réessayer.'
         }
      }
   })

   const handleRegister = $(() => {
      console.log('register')
      isRegister.value = true
   })

   const logout = $(() => {
      const storage = localStorage.getItem('authToken')
      let deleteUser: UserInfo = {
         jwt: '',
         user: {
            id: -1,
            username: 'anonyme',
            email: 'non',
            provider: '',
            confirmed: false,
            blocked: true,
            createdAt: '',
            updatedAt: '',
         },
      }
      if (storage !== '') {
         removeToken()
         userCtxt.user = deleteUser.user
         console.log('userctxt after remove', userCtxt)
      }
   })

   return (
      <>
         <div class="container container-center">
            {!isRegister.value && userCtxt.user.blocked && (
               <Form action={action} spaReset={true}>
                  <input
                     type="email"
                     name="identifier"
                     id="identifier"
                     placeholder="Email"
                     onInput$={handleInputEmail}
                  />
                  <span>{storeErrorMessages['identifier']}</span>
                  <input
                     type="password"
                     name="password"
                     id="password"
                     placeholder="Mot de passe"
                     onInput$={handleInputPassword}
                  />
                  <span>{storeErrorMessages['password']}</span>
                  {userCtxt.user.blocked && (
                     <div class={'box-footer-form'}>
                        <button type="submit" onClick$={handleSubmit}>
                           Connexion
                        </button>
                        <button
                           onClick$={() => handleRegister()}
                           preventdefault:click
                        >
                           S'inscrire
                        </button>
                     </div>
                  )}
               </Form>
            )}
            {isRegister.value && <Registrer></Registrer>}
            <p>{storeErrorMessages.connectionError}</p>
            {!userCtxt.user.blocked && (
               <div>
                  {userInfoSet.getUserInfos().then((res) => (
                     <>
                        <p>
                           Utilisateur : {res.username} - Email : {res.email}
                        </p>
                        <p> usercontexte : {userCtxt.user.email}</p>
                        <button type="submit" onClick$={logout}>
                           Se déconnecter
                        </button>
                     </>
                  ))}
               </div>
            )}
         </div>
      </>
   )
})
