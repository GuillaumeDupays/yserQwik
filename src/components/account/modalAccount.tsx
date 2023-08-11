import {
    component$,
    useSignal,
    $,
    Slot,
    useStylesScoped$,
} from '@builder.io/qwik'
import styles from './modal.css?inline'

export interface ModalStore {
    isOpen: boolean
}

export interface ModalProps {
    title: string
    store: ModalStore
    btnConnexion?: HTMLButtonElement
}

export default component$(({ title, store, btnConnexion }: ModalProps) => {
    useStylesScoped$(styles)
    if (store.isOpen)
        return (
            <div
                class="modal"
                aria-labelledby={title}
                role="dialog"
                aria-modal="true"
            >
                <div class="modal-content">
                    <div>
                        {/* <Panel>           */}
                        <Slot></Slot>
                        <p class="overlay">{title}</p>
                        <button>{btnConnexion} Se connecter</button>
                        <button onClick$={() => (store.isOpen = false)}>
                            X
                        </button>

                        {/* </Panel> */}
                    </div>
                </div>
            </div>
        )

    return null
})

// export const Overlay = component$(() => {
//   return (
//     <div class="overlay">Créneaux disponibles</div>
//   );
// });

// export const Panel = component$(() => {
//   return (
//     <div>
//       <Slot />
//     </div>
//   );
// });
