export interface User {
   login?: UserLogin
   register: UserRegister
}

export interface UserLogin {
   id?: number
   identifier: string
   password: string
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
