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
   isShow: boolean
   isToDelete?: boolean
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
      <>
         {props.isShow && (
            <div class="modal-overlay" onClick$={() => closeModal()}>
               <div class="modal-content" onClick$={(e) => e.stopPropagation()}>
                  <h2>Confirmation</h2>
                  <p>
                     {props.isToDelete === true
                        ? 'Voulez-vous supprimer cette réservation ?'
                        : 'Voulez-vous ajouter cette réservation ?'}
                  </p>
                  <div class="modal-buttons">
                     <button onClick$={() => props.onCancel$()}>Annuler</button>
                     <button onClick$={() => props.onConfirm$(true)}>
                        Confirmer
                     </button>
                  </div>
               </div>
            </div>
         )}
      </>
   )
})
