import {
   $,
   QwikFocusEvent,
   createContextId,
   useContext,
   useStore,
} from '@builder.io/qwik'
import { InputType } from 'zlib'
import { HtmlStore } from '~/models/inputForm'
import { UserSessionCtxt } from '~/routes/layout'

export const AVATAR_API = 'https://ui-avatars.com/api'
export const API = 'http://localhost:1337/api'
export const AUTH_TOKEN = 'authToken'
export const BEARER = 'Bearer'

export interface UserInfo {
   jwt?: string
   user: User
}

export interface User {
   id: number
   username: string
   email: string
   provider?: string
   confirmed?: boolean
   blocked?: boolean
   createdAt?: string
   updatedAt?: string
}

export const getToken = () => {
   if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(AUTH_TOKEN)
   }
}

export const setToken = (token: string) => {
   if (token) {
      localStorage.setItem(AUTH_TOKEN, token)
   }
}

export const removeToken = () => {
   if (typeof localStorage !== 'undefined') {
      return localStorage.removeItem(AUTH_TOKEN)
   }
}

export function validateEmail(email: string) {
   const regex: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

   if (regex.test(email)) {
      return true
   }

   return false
}

export const isUserOfLegalAge = (birthdate: Date): boolean => {
   const currentDate = new Date()
   const age = currentDate.getFullYear() - birthdate.getFullYear()
   const monthDiff = currentDate.getMonth() - birthdate.getMonth()

   if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < birthdate.getDate())
   ) {
      return age >= 18
   }

   return age >= 18
}

export const isPhoneNumberValid = (phoneNumber: string): boolean => {
   // Define a regular expression for the desired phone number format
   const phoneNumberRegex = /^[0-9]{10}$/ // This example assumes 10-digit numbers

   return phoneNumberRegex.test(phoneNumber)
}

export const formatDate = (inputDate: string) => {
   const parts = inputDate.split('-')
   if (parts.length === 3) {
      const year = parts[0]
      const month = parts[1]
      const day = parts[2]
      return `${day}/${month}/${year}`
   } else {
      return 'Format de date invalide.'
   }
}

export const convertDateFormatToBack = (inputDate: string) => {
   const parts = inputDate.split('/')
   if (parts.length !== 3) {
      throw new Error('Format de date invalide')
   }

   const day = parts[0]
   const month = parts[1]
   const year = parts[2]

   const formattedDate = `${year}-${month}-${day}`
   return formattedDate
}

export function validatePassword(pwd: string) {
   if (pwd.length >= 8 && pwd.length <= 25) {
      return true
   }
   return false
}

export const isEqualString = (A: string, B: string): boolean => {
   console.log('a', A)
   console.log('b', B)

   return A === B ? true : false
}

// export const errorMsg = (type: string, capture: string, store: HtmlStore[]) => {
//    console.log('capture', capture)

//    const targetInput = store.find((e) => e.inputType!.type === type)
//    console.log('targetInput', targetInput)

//    switch (type) {
//       case 'email':
//          const isEmailValid = validateEmail(capture)
//          return !isEmailValid
//             ? (targetInput!.errorMessage =
//                  'Veuillez saisir un numéro de téléphone valide')
//             : ''

//       case 'tel':
//          const isTelValid = isPhoneNumberValid(capture)
//          return !isTelValid
//             ? (targetInput!.errorMessage =
//                  'Veuillez saisir un numéro de téléphone valide')
//             : ''

//       case 'date':
//          console.log('capture date', capture)
//          const birthdate = new Date(capture)
//          console.log('bith', birthdate)

//          const isAgeValid = isUserOfLegalAge(birthdate)
//          console.log('isAGE', isAgeValid)

//          return isAgeValid
//             ? ''
//             : (targetInput!.errorMessage =
//                  'Vous devez être majeur pour vous inscrire')
//    }
// }
export const errorMsg = (
   targetName: string,
   capture: string,
   store: HtmlStore[]
) => {
   const targetInput = store.find((e) => targetName === e.inputType!.inputName)
   console.log('targetInput errorMsg', targetInput)

   if (!targetInput) {
      console.error(`Target input with type '${targetInput}' not found.`)
      return
   }

   switch (targetInput.inputType?.type) {
      case 'email':
         const isEmailValid = validateEmail(capture)
         targetInput.errorMessage = !isEmailValid ? 'Email invalide' : ''
         break

      case 'tel':
         const isTelValid = isPhoneNumberValid(capture)
         targetInput.errorMessage = !isTelValid
            ? 'N° de téléphone invalide'
            : ''
         break

      case 'date':
         const birthdate = new Date(capture)
         const isAgeValid = isUserOfLegalAge(birthdate)
         targetInput.errorMessage = isAgeValid ? '' : 'Vous devez être majeur'
         break
      case 'text':
         const isTextNotValid = !capture
         targetInput.errorMessage = isTextNotValid ? 'Champ requis' : ''
         break

      default:
         console.error(`Unsupported input type '${targetInput}'.`)
         break
   }
}

export function useStoreUser() {
   const userCtxt = useContext(UserSessionCtxt)

   const setUserInfos = $((values: UserInfo) => {
      if (values) {
         userCtxt.user = values.user
         return userCtxt.user
      }
   })

   const getUserInfos = $(() => {
      return { ...userCtxt.user }
   })
   return {
      setUserInfos,
      getUserInfos,
   }
}
