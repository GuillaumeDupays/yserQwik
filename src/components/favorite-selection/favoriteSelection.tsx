import { component$, useStylesScoped$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import styleHeader from '../header/header.scss?inline'
export default component$(() => {
    useStylesScoped$(styleHeader)
    return (
        <>
            <section>
                <h3>Votre sélection</h3>
            </section>
        </>
    )
})
