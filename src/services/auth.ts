import { User, UserLogin, UserRegister } from '~/models/user'
import { $, component$, useResource$ } from '@builder.io/qwik'
import {
   RequestHandler,
   requestHandler,
} from '@builder.io/qwik-city/middleware/request-handler'
import {
   API,
   AUTH_TOKEN,
   UserInfo,
   setToken,
   useStoreUser,
} from '~/helpers/helpers'

export const useTattooService = async (payload: UserLogin) => {
   console.log('payload', payload)

   try {
      const response = await fetch('http://localhost:1337/api/auth/local', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
         },
         body: JSON.stringify(payload),
      })

      if (!response.ok) {
         throw new Error('Method Not Allowed')
      }

      const data = await response.json()
      setToken(data.jwt) // Assurez-vous que setToken est correctement défini et accessible ici
      return data
   } catch (error) {
      console.error('Error:', error)
      throw error
   }
}

export const inscriptionService = async (user: UserRegister) => {
   console.log('user', user)

   try {
      const response = await fetch(
         'http://localhost:1337/api/auth/local/register',
         {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Accept: '*/*',
            },
            body: JSON.stringify(user),
         }
      )

      if (!response.ok) {
         throw new Error('Method Not Allowed')
      }

      const data = await response.json()
      setToken(data.jwt) // Assurez-vous que setToken est correctement défini et accessible ici
      return data
   } catch (error) {
      console.error('Error:', error)
      throw error
   }
}
