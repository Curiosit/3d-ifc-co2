

export class ErrorModal{
    //container: HTMLElement
    container: HTMLElement
    ui: HTMLDivElement
    msg: string
    msgContainer: HTMLElement
    id: string

    constructor (modal: HTMLElement, msg: string, id: string) {
        
        this.container = modal
        this.msg = msg
        this.id = id
        
        this.setUI()
    }

    setUI() {
        this.msgContainer = document.getElementById("error-msg") as HTMLElement
        this.msgContainer.innerHTML = this.msg
        const closeButton = document.getElementById("close-error-modal") as HTMLElement
        closeButton.addEventListener("click", () => {
            const modal = document.getElementById(this.id) as HTMLDialogElement
            modal.close()})
        
        
      }
}