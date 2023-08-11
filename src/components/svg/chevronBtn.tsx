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
            width="24px"
            height="24px"
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

    const svgChevronRight = (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L9.58579 13L5.29289 8.70711C4.90237 8.31658 4.90237 7.68342 5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.70711 7.29289L11.7071 12.2929C12.0976 12.6834 12.0976 13.3166 11.7071 13.7071L6.70711 18.7071Z"
                fill="black"
            />
        </svg>
    )

    return (
        <button class="svg-button" onClick$={onClick$}>
            {direction === 'left' ? svgChevronLeft : svgChevronRight}
        </button>
    )
})
