export interface User {
   login?: Login
   register?: UserRegister
   connect?: UserConnect
}

export interface Login {
   id?: number
   identifier?: string
   password?: string
   code?: string
   email?: string
}

export type UserConnect = {
   provider?: string
   confirmed: boolean
   blocked: boolean
   createdAt?: string
   updatedAt?: string
   infos: UserRegister
}

export type UserRegister = {
   username: string
   email: string
   nom: string
   birthday: string
   ville: string
   phone: number
   password: string
}
