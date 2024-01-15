import * as OBC from "openbim-components"
import { ElementQtyCard } from "./ElementQtyCard"
import { ElementSetNameCard } from "./ElementSetNameCard"


export class ElementCard extends OBC.SimpleUIComponent {
    onDelete = new OBC.Event()
    onCardClick = new OBC.Event()
    
    private _qtyElement: HTMLParagraphElement
    slots: {
        actionButtons: OBC.SimpleUIComponent
    }

    set elementName(value: string) {
        const elementNameHTML = this.getInnerElement("ElementName") as HTMLParagraphElement
        elementNameHTML.textContent = value
    }
    

    

    constructor(components: OBC.Components) {
        
        const template = `
        
            <div class="qty-item tooltip" >
            <div class="" style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; column-gap: 15px; align-items: center;">
                
                    <div>
                        <div id="ElementName">
                        
                        </div>
                    </div>
                </div>
                <div data-tooeen-slot="actionButtons"></div>
            </div>

            </div>
      
        `
        
        super(components, template)
        
        
        this._qtyElement = this.getInnerElement("ElementName") as HTMLParagraphElement
        
        console.log(this._qtyElement)

        
        const cardElement = this.get()
        cardElement.addEventListener("click", () => {
            this.onCardClick.trigger()
        })
        this.setSlot("actionButtons", new OBC.SimpleUIComponent(this._components))
        

        
    }
    async dispose () {
        
        while (this._qtyElement.firstChild) {
            console.log("child:")
            console.log(this._qtyElement.firstChild)
            this._qtyElement.removeChild(this._qtyElement.firstChild)
        }
        
        //this.dispose()
    }

}