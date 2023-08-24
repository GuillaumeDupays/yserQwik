export interface InputType {
   inputName: string
   element?: HTMLInputElement
   type: 'tel' | 'date' | 'text' | 'email' | 'password'
   inputWidth?: number
   minLength?: number
   maxlength?: number
   required: boolean
   userCapture?: string
   isFocused: boolean
}
export interface LabelType {
   element?: HTMLLabelElement
   labelId: string
   labelName: string
   labelText: string
   labelClass?: string
   labelWidth?: number
   errorSpanWidth?: number
   transformLength?: number
}
export interface HtmlStore {
   labelType?: LabelType
   inputType?: InputType
   errorMessage?: string
   isFormValid?: boolean
}
