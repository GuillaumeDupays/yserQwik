import { component$ } from '@builder.io/qwik'
import chevronRight from '../../../public/chevron/right-chevron.svg'
import chevronLeft from '../../../public/chevron/left-chevron.svg'
import { JSX } from '@builder.io/qwik/jsx-runtime'

interface SVGButtonProps {
    onClick$: () => void
    direction: 'left' | 'right'
}

export default component$<SVGButtonProps>((props) => {
    const onClick$ = props.onClick$
    const direction = props.direction

    const svgChevronLeft = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
        >
            <path
                d="M15 6L9 12L15 18"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    )

    const svgChevronRight = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
        >
            <path
                d="M9 6L15 12L9 18"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    )

    return (
        <button class="svg-button" onClick$={onClick$}>
            {direction === 'left' ? svgChevronLeft : svgChevronRight}
        </button>
    )
})
