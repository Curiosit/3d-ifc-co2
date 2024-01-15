import * as OBC from "openbim-components"
import { ElementQtyCard } from "./ElementQtyCard"

export type qtyValue = [
    {[qtoName: string]: number}
]

export class ElementSetNameCard extends OBC.SimpleUIComponent {
    onDelete = new OBC.Event()
    onCardClick = new OBC.Event()
    private _qtyValueListElement: HTMLParagraphElement
    slots: {
        actionButtons: OBC.SimpleUIComponent
    }

    set setName(value: string) {
        const setNameElement = this.getInnerElement("setName") as HTMLParagraphElement
        setNameElement.textContent = value
    }
    set qtyValueList(values: any) {
        
        console.log(this._qtyValueListElement)
        while (this._qtyValueListElement.firstChild) {
            console.log("clearing children:")
            console.log(this._qtyValueListElement.firstChild)
            this._qtyValueListElement.removeChild(this._qtyValueListElement.firstChild)

        }
        for (const qtyEntry of values) {
            console.log(qtyEntry)
            for (const qtoName in qtyEntry) {
                const number = qtyEntry[qtoName];
                const qtyValueCard = new ElementQtyCard(this.components)

                //console.log(`qtoName: ${qtoName}, number: ${number}`);
                qtyValueCard.qtyName = qtoName
                qtyValueCard.qtyValue = number
                
                //console.log(qtyValueCard)
                this._qtyValueListElement.appendChild(qtyValueCard.domElement)
            }
        }
        console.log(this._qtyValueListElement)
    }

    

    constructor(components: OBC.Components) {
        
        const template = `
        
            <div class="qty-item tooltip" >
            <div class="" style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; column-gap: 15px; align-items: center;">
                
                    <div>
                        <div id="setName" >
                            SetName
                        </div>
                        <div id="qtyValueList">
                        
                        </div>
                    </div>
                </div>
                <div data-tooeen-slot="actionButtons"></div>
            </div>

            </div>
      
        `
        
        super(components, template)
        
        
        this._qtyValueListElement = this.getInnerElement("qtyValueList") as HTMLParagraphElement
        console.log(this._qtyValueListElement)

        
        const cardElement = this.get()
        cardElement.addEventListener("click", () => {
            this.onCardClick.trigger()
        })
        this.setSlot("actionButtons", new OBC.SimpleUIComponent(this._components))
        

        
    }
    async dispose () {
        
        while (this._qtyValueListElement.firstChild) {
            console.log("child:")
            console.log(this._qtyValueListElement.firstChild)
            this._qtyValueListElement.removeChild(this._qtyValueListElement.firstChild)
        }
        
        //this.dispose()
    }

}