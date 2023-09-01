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
import { Form, Link, routeAction$, useNavigate } from '@builder.io/qwik-city'
import styleLogin from '../account/login.scss?inline'
import {
   UserInfo,
   formatDate,
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
import { User, UserConnect } from '~/models/user'
import InfosUser from '../infosUser/infosUser'

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

   const inputValidation = $(
      (
         e: Event,
         validationFn: (value: string) => boolean,
         fieldName: keyof LoginForm,
         invalidMessage: string
      ) => {
         const capture = e.target as HTMLInputElement
         const value = capture.value.trim()

         const isValid = validationFn(value)
         storeErrorMessages[fieldName] = isValid ? '' : invalidMessage
         storeFormData[fieldName] = value
      }
   )

   const handleInputEmail = $((e: Event) => {
      inputValidation(
         e,
         validateEmail,
         'identifier',
         'Veuillez saisir un email valide'
      )
   })

   const handleInputPassword = $((e: Event) => {
      inputValidation(
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
               console.log('response', response)

               userInfoSet.setUserInfos(response.user)
               userCtxt.connect!.blocked = false
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

   const nav = useNavigate()

   const handleRegister = $(() => {
      console.log('register')
      isRegister.value = true
      nav('/inscription')
   })

   const logout = $(() => {
      const storage = localStorage.getItem('authToken')
      let deleteUser: User = {
         connect: {
            infos: {
               username: '',
               email: '',
               nom: '',
               birthday: '',
               ville: '',
               phone: 0,
               password: '',
            },
            provider: '',
            confirmed: false,
            blocked: true,
            createdAt: '',
            updatedAt: '',
         },
      }
      if (storage !== '') {
         removeToken()
         userCtxt.connect = deleteUser.connect
         userCtxt.login = deleteUser.login
         userCtxt.register = deleteUser.register
         console.log('userctxt after remove', userCtxt)
      }
   })

   return (
      <>
         <div class="container container-center">
            {!isRegister.value && userCtxt.connect!.blocked && (
               <Form action={action} spaReset={true}>
                  <h3>Connexion</h3>
                  <span>{storeErrorMessages['identifier']}</span>
                  <input
                     type="email"
                     name="identifier"
                     id="identifier"
                     placeholder="Email"
                     onInput$={handleInputEmail}
                  />
                  <span>{storeErrorMessages['password']}</span>
                  <input
                     type="password"
                     name="password"
                     id="password"
                     placeholder="Mot de passe"
                     onInput$={handleInputPassword}
                  />
                  {userCtxt.connect!.blocked && (
                     <>
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
                        <ul class={'forgot-pwd'}>
                           <Link href="/forgot-pwd/">
                              Mot de passe oublié ?
                           </Link>
                        </ul>
                     </>
                  )}
               </Form>
            )}
            {isRegister.value && <Link href="/inscription">S'inscrire</Link>}
            {/* {isRegister.value && <Registrer></Registrer>} */}
            {storeErrorMessages.connectionError && (
               <p>{storeErrorMessages.connectionError}</p>
            )}

            {!userCtxt.connect!.blocked && (
               <>
                  <section>
                     <InfosUser></InfosUser>
                     {userInfoSet.getUserInfos().then((item) => (
                        <>
                           <p>
                              <label>Nom :</label>
                              <span> {item!.connect!.infos!.username}</span>
                           </p>
                           <p>
                              <label>Prénom :</label>{' '}
                              <span>{item.connect?.infos.nom}</span>
                           </p>
                           <p>
                              <label>Date de naissance :</label>{' '}
                              <span>
                                 {formatDate(item.connect?.infos.birthday!)}
                              </span>
                           </p>
                           <p>
                              <label>Ville :</label>
                              <span> {item.connect?.infos.ville}</span>
                           </p>
                           <p>
                              <label>N° de téléphone :</label>{' '}
                              <span>{item.connect?.infos.phone}</span>
                           </p>
                           <p>
                              <label>Email : </label>
                              <span>{item?.connect!.infos?.email}</span>
                           </p>
                           <p>
                              {' '}
                              {/* usercontexte : {userCtxt.connect?.infos?.username} */}
                           </p>
                           <button type="submit" onClick$={logout}>
                              Se déconnecter
                           </button>
                        </>
                     ))}
                  </section>
                  <section>
                     <h3>Vos prochains rendez-vous</h3>
                  </section>
               </>
            )}
         </div>
      </>
   )
})
