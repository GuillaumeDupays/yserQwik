import {
    component$,
    createContextId,
    Slot,
    useContextProvider,
    useStore,
} from '@builder.io/qwik'
import type { RequestHandler } from '@builder.io/qwik-city'
import { UserInfo } from '~/helpers/helpers'

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

export const UserSessionCtxt = createContextId<UserInfo>('user-session')

export default component$(() => {
    const userSession: UserInfo = useStore({
        jwt: '',
        user: {
            id: 0,
            username: '',
            email: '',
            provider: '',
            confirmed: false,
            blocked: true,
            createdAt: '',
            updatedAt: '',
        },
    })
    useContextProvider(UserSessionCtxt, userSession)
    return <Slot />
})
