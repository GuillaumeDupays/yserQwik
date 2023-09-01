import {
   component$,
   createContextId,
   Slot,
   useContextProvider,
   useStore,
} from '@builder.io/qwik'
import type { RequestHandler } from '@builder.io/qwik-city'
import Header from '~/components/header/header'
import Menu from '~/components/menu/menu'
import { UserInfo } from '~/helpers/helpers'
import { Login, User, UserConnect } from '~/models/user'

export const onGet: RequestHandler = async ({ cacheControl }) => {
   // Control caching for this request for best performance and to reduce hosting costs:
   // https://qwik.builder.io/docs/caching/
   cacheControl({
      // Always serve a cached response by default, up to a week stale
      staleWhileRevalidate: 60 * 60 * 24 * 7,
      // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
      maxAge: 5,
   })
}

export const UserSessionCtxt = createContextId<User>('user-session')

export default component$(() => {
   const userSession: User = useStore({
      login: {
         id: -1,
         identifier: 'anonyme',
         password: '',
      },
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
   })
   useContextProvider(UserSessionCtxt, userSession)
   return (
      <>
         <Menu></Menu>
         <Slot />
      </>
   )
})
