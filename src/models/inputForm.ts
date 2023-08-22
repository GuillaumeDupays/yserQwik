export interface InputType {
   inputName: string
   element: HTMLInputElement
   type: 'tel' | 'date' | 'text' | 'email'
   inputWidth?: number
   minLength?: number
   maxlength?: number
   required: boolean
   userCapture?: string
   isFocused: boolean
}
export interface LabelType {
   element: HTMLLabelElement
   labelId: string
   labelName: string
   labelClass?: string
   labelWidth?: number
   transformLength?: number
}
export interface HtmlStore {
   labelType?: LabelType
   inputType?: InputType
   errorMessage?: string
}
