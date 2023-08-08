import { $ } from '@builder.io/qwik'
import InstaPost from '~/models/instapost'

const API = 'http://localhost:1337'

export const postRefactoredInstaPostService = $(async (post: InstaPost) => {
    console.log('post', post)

    const response = await fetch(`${API}/api/dessins`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
    })
    const data = await response.json()
    // setToken(data.jwt)
    return data
})
