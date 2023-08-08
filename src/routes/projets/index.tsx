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

const token =
    'EAArZBObBAW7gBO255Qn79ji7EiVPB20IlizZCCNluSrYJeF6ZBOYXq8RlF4yOBfOQ1hZB2zcODZACqgKrtkTcFDlSZCwRvahLRD0QuDU0KKIVVBbMyEZAPdZADJh3viV77HX9dbKiv3UmfkVQzQxIFrc79nNalQo4zXA0rVZACM4hzgzHZB5eFaQTEcK9bEkTJjr78nZCR9I15Y5le7tnGK5Hk5Y0KMSGwRsfJQrXlPvfMR3acDigWZALCQLsKwZBxSDNdWBWfUUoUYwZD'
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

    const storePost = useStore<InstaPost[]>([
        {
            full_picture: '',
            id: '',
            message: '',
            object_id: '',
            permalink_url: '',
            tarif: 0,
        },
    ])

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
    const selectStar = $((e: boolean | undefined) => {
        console.log('checkbox', e)
        if (e === undefined && isSelected.value === false) {
            isSelected.value = true
        } else {
            isSelected.value = false
        }
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
            <div class={'container-filtered-btns'}>
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
            </div>

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
                                        isSelected={isSelected.value}
                                        onClick$={() =>
                                            selectStar(e.isSelected)
                                        }
                                    ></Star>

                                    <button
                                        onClick$={() => selectPost(e)}
                                        class={storePost.map((r) =>
                                            r.id.includes(e.id)
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
