import {
    component$,
    useStylesScoped$,
    type PropFunction,
    $,
    QRL,
    QwikChangeEvent,
    QwikAnimationEvent,
} from '@builder.io/qwik'
import starStyle from '../star/star.scss?inline'

interface SVGProps {
    onClick$?: PropFunction<() => void>
    isSelected?: boolean
    color?: string
    hoverColor?: string
    activeColor?: string
}
export default component$<SVGProps>((props) => {
    useStylesScoped$(starStyle)
    const test = props.onClick$
    const isSelected = props.isSelected

    return (
        <div class={'container-svg'}>
            <svg
                id="star"
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                class={isSelected === false ? 'star' : 'starend'}
                onClick$={test}
                type="checkbox"
            >
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
            </svg>
        </div>
    )
})
