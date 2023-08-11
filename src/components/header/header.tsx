import { component$, useStylesScoped$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import styleHeader from '../header/header.scss?inline'
export default component$(() => {
    useStylesScoped$(styleHeader)
    return (
        <>
            <header>
                <ul>
                    <Link href="/projets">PROJETS</Link>
                </ul>
                <ul>
                    <Link href="/reservation">Réserver un créneau</Link>
                </ul>
                <ul>
                    <Link href="/login">Se connecter</Link>
                </ul>
            </header>
        </>
    )
})
