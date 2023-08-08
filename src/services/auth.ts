import { User } from '~/models/user'
import { $ } from '@builder.io/qwik'

const API = 'http://localhost:1337'

export const authService = $(async (payload: User) => {
    console.log('payload', payload)

    const response = await fetch(`${API}/auth/local`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    const data = await response.json()
    // setToken(data.jwt)
    return data
})
