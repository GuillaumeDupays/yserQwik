import {
    PropFunction,
    component$,
    useSignal,
    $,
    useStylesScoped$,
} from '@builder.io/qwik'
import modalStyle from '../reservation/modal.scss?inline'

interface ModalProps {
    onConfirm$: PropFunction<(value: boolean) => void>
    onCancel$: PropFunction<() => void>
}

export const Modal = component$<ModalProps>((props) => {
    useStylesScoped$(modalStyle)
    const confirmClicked = useSignal(false)

    const confirmHandler = $(() => {
        confirmClicked.value = true
    })

    const closeModal = $(() => {
        if (!confirmClicked) {
            props.onCancel$()
        }
    })

    return (
        <div class="modal-overlay" onClick$={() => closeModal()}>
            <div class="modal-content" onClick$={(e) => e.stopPropagation()}>
                <h2>Confirmation</h2>
                <p>Voulez-vous supprimer cette reservation?</p>
                <div class="modal-buttons">
                    <button onClick$={() => props.onCancel$()}>Annuler</button>
                    <button onClick$={() => props.onConfirm$(true)}>
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    )
})
