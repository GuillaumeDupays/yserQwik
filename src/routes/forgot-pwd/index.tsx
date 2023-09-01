import { component$, $, useStore } from '@builder.io/qwik'
import { Form, type DocumentHead } from '@builder.io/qwik-city'
import Header from '~/components/header/header'
import { validateEmail, validatePassword } from '~/helpers/helpers'
import { Login } from '~/models/user'
import { forgotPwdService, resetPwdService } from '~/services/auth'

export default component$(() => {
   const getCodeFromUrl = $(() => {
      const currentUrl = window.location.href
      const startIndex = currentUrl.indexOf('code=')
      if (startIndex !== -1) {
         // Extraire la partie de la chaîne après "code="
         const codeValue = currentUrl.substring(startIndex + 5) // 5 est la longueur de "code="
         console.log(codeValue)
         return codeValue
      } else {
         console.log('"code=" non trouvé dans l\'URL')
         return ''
      }
   })
   const storeEmailToReset = useStore({
      email: '',
      code: '',
      password: '',
      passwordConfirmation: '',
   })
   const email = { email: 'guillaumedupays@gmail.com' }
   const useForgotPwd = $(async () => {
      // const capture = e.target as HTMLInputElement
      if (storeEmailToReset.email !== '') {
         forgotPwdService({ email: storeEmailToReset.email })
      }
   })
   const useResetPwd = $(() => resetPwdService(storeEmailToReset))
   const pwdForgotten = $(async (e: Event) => {
      storeEmailToReset.code = await getCodeFromUrl()
      const capture = e.target as HTMLInputElement
      if (capture.name === 'email' && validateEmail(capture.value)) {
         storeEmailToReset.email = capture.value
         console.log('email', storeEmailToReset)
      }
      if (capture.name === 'password' && validatePassword(capture.value)) {
         storeEmailToReset.password = capture.value
         console.log('password', storeEmailToReset)
      }
      if (
         capture.name === 'password_confirmation' &&
         validatePassword(capture.value)
      ) {
         if (capture.value === storeEmailToReset.password) {
            storeEmailToReset.passwordConfirmation = capture.value
            console.log('password_confirmation', storeEmailToReset)
         }
      }
   })
   return (
      <>
         <h1>Réinitialisez votre mot de passe </h1>
         <p>Mot de passe oublié ?</p>
         <Form>
            <label for="email">Email</label>
            <input
               type="email"
               name="email"
               id="email"
               onInput$={pwdForgotten}
               placeholder="Email"
            />
            <label for="Mot de passe">Nouveau mot de passe</label>
            <input
               type="password"
               name="password"
               id="password"
               onInput$={pwdForgotten}
               placeholder="Mot de passe"
            />
            <label for="password_confirmation">Confirmez le mot de passe</label>
            <input
               type="password"
               name="password_confirmation"
               id="password_confirmation"
               onInput$={pwdForgotten}
               placeholder="Confirmez le mot de passe"
            />
            <button onClick$={() => useResetPwd()}>Reset Pwd</button>
            <button type="submit" onClick$={() => useForgotPwd()}>
               Valider
            </button>
         </Form>
      </>
   )
})

export const head: DocumentHead = {
   title: 'Mot de passe oublié',
   meta: [
      {
         name: 'description',
         content: 'Qwik site description',
      },
   ],
}
