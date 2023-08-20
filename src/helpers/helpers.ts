import { $, createContextId, useContext, useStore } from '@builder.io/qwik'
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
