import {
    component$,
    $,
    useStore,
    useSignal,
    useStylesScoped$,
} from '@builder.io/qwik'
import { DocumentHead, routeLoader$ } from '@builder.io/qwik-city'
import Projets from '../../components/projets/projets'
import { Drawing } from '~/models/drawing.model'
import projet from '../../mock/projet.json'
import styleProjets from '../projets/projets.scss?inline'
import InstaPost from '~/models/instapost'
import Star from '~/components/star/star'
import Header from '~/components/header/header'

const token =
    'EAArZBObBAW7gBO2rmS7kN6TfjmgvQqrixDpH6R3p5pMRGMnHiEleg8bmBkKkXnrs0wT9UZCwXugI29yaZBovQkdIZACUTSuZCiAGXZAbYi71wSsFJWrpE2BKV7w5U4LUyF0zkQGYaVoGmH4D7Ec3g6NaKkLyPS4vhxFO6Tp6S6YIKnZCisEHX1QjZA90iDhO3NEncBuOGECHpL5xEZAHONxIzmGYWEE7eZCmL7bSW9YHsudZBz98V44ikbjvQNJt5kcup4Kr4KVcAZDZD'
export const instaApi = routeLoader$(async () => {
    const url =
        'https://graph.facebook.com/me/feed?fields=object_id,permalink_url,full_picture,message'
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    const data = await res.json()
    return data.data as InstaPost[]
})
export const toFiltered = routeLoader$(async ({ request }) => {
    const datas = projet.data as Drawing[]
    const attributesArray = datas.map((r) => r?.attributes)

    const uniqueStylesSet = new Set(attributesArray.map((attr) => attr?.style))
    const uniqueStylesArray = Array.from(uniqueStylesSet)
    uniqueStylesArray.push('TOUS LES PROJETS')

    return uniqueStylesArray
})

export const filteredDatas = routeLoader$(() => {
    const datas = projet.data as Drawing[]

    return datas
})

export default component$(() => {
    useStylesScoped$(styleProjets)

    const postRefactoredInstaPost = () => {}

    const storePost = useStore<InstaPost[]>([])

    const storeUserPostSelection = useStore<InstaPost[]>([])

    const styleSignal = useSignal('TOUS LES PROJETS')

    const selectStyle = $((style: string) => {
        styleSignal.value = style
        return styleSignal.value
    })

    const removeTags = $((text: string) => {
        const test = text.split('#')[0]
        console.log('text', test)
        return test
    })

    const useToFiltered = toFiltered()

    const useFilteredDatas = filteredDatas()

    const useApiInsta = instaApi().value
    console.log('useApiInsta', useApiInsta)
    const isSelectedBtn = useSignal(false)
    const isSelected = useSignal(false)

    const selectStar = $((e: InstaPost) => {
        const existingSelection = storeUserPostSelection.find(
            (selection) => e.id === selection.id
        )

        if (existingSelection) {
            // isSelected.value = false

            // Supprimer l'élément existant de storeUserPostSelection
            const index = storeUserPostSelection.indexOf(existingSelection)
            if (index !== -1) {
                storeUserPostSelection.splice(index, 1)
            }
        } else {
            // isSelected.value = true
            // Ajouter la nouvelle sélection à storeUserPostSelection
            const newSelection = {
                full_picture: e.full_picture,
                id: e.id,
                message: e.message,
                object_id: e.object_id,
                permalink_url: e.permalink_url,
                tarif: 220,
            }
            storeUserPostSelection.push(newSelection)
        }
        console.log('store user', storeUserPostSelection)
    })

    const selectPost = $((post: InstaPost) => {
        if (!post.isSelected) {
            if (storePost[0].id === '') {
                post.isSelected = true
                isSelectedBtn.value = true
                storePost[0] = post
            } else {
                post.isSelected = true
                isSelectedBtn.value = true
                storePost.push(post),
                    console.log('post', post),
                    console.log('storepost', storePost)
                // removeTags(post.message)
            }
        }
    })
    return (
        <>
            <Header></Header>
            {/* <div class={'container-filtered-btns'}>
                {useToFiltered.value.map(
                    (btnStyle) =>
                        btnStyle && (
                            <button
                                onClick$={() => selectStyle(btnStyle)}
                                class={
                                    btnStyle === styleSignal.value
                                        ? 'clicked'
                                        : 'filtered-btn'
                                }
                            >
                                {btnStyle}
                            </button>
                        )
                )}
            </div> */}

            <div class={'content-page'}>
                <h1>PROJETS DISPONIBLES</h1>
                <div class={'container'}>
                    {useApiInsta.map((e: InstaPost) =>
                        styleSignal.value === 'TOUS LES PROJETS' ? (
                            <section class={'card'}>
                                <img
                                    src={e?.full_picture}
                                    width="400"
                                    height="300"
                                ></img>
                                <p
                                    contentEditable={
                                        isSelectedBtn.value ? 'true' : 'false'
                                    }
                                >
                                    {removeTags(e.message)}
                                </p>
                                <div class={'footer-card'}>
                                    <Star
                                        // onChange$={() =>
                                        //     console.log('change', 2)
                                        // }
                                        isSelected={storeUserPostSelection.some(
                                            (s) =>
                                                s.id === e.id
                                                    ? (isSelected.value = true)
                                                    : (isSelected.value = false)
                                        )}
                                        onClick$={() => selectStar(e)}
                                    ></Star>

                                    <button
                                        onClick$={() => selectPost(e)}
                                        class={storePost.map((r) =>
                                            r.id === e.id
                                                ? 'clicked'
                                                : 'filtered-btn'
                                        )}
                                    >
                                        Modifier ce post
                                    </button>
                                </div>
                            </section>
                        ) : null
                    )}
                </div>

                {/* <div class={'container'}>
                    <>
                        <p>{styleSignal.value}</p>

                        {useFilteredDatas.value.map((e) =>
                            styleSignal.value === 'TOUS LES PROJETS' ? (
                                <div class={'item'}>
                                    <h3>{e.attributes?.title}</h3>
                                    <p>{e.attributes?.description}</p>
                                    <p>{e.attributes?.style}</p>
                                </div>
                            ) : e.attributes?.style === styleSignal.value ? (
                                <div class={'item'}>
                                    <h3>{e.attributes.title}</h3>
                                    <p>{e.attributes.description}</p>
                                    <p>{e.attributes.style}</p>
                                </div>
                            ) : null
                        )}
                    </>
                </div> */}
            </div>

            <Projets></Projets>
        </>
    )
})

export const head: DocumentHead = {
    title: 'Projets',
    meta: [
        {
            name: 'description',
            content: 'Qwik site description',
        },
    ],
}
