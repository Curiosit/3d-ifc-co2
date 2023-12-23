
export class ErrorModal{
    //container: HTMLElement
    container: HTMLElement
    ui: HTMLDivElement
    msg: string
    msgContainer: HTMLElement
    constructor (modal: HTMLElement, msg: string) {
        
        this.container = modal
        this.msg = msg
        
        this.setUI()
    }

    setUI() {
        this.msgContainer = document.getElementById("error-msg") as HTMLElement
        this.msgContainer.innerHTML = this.msg
        
        
        
      }
}