import * as OBC from "openbim-components"
import { ElementQtyCard, QtyValuePairData } from "./ElementQtyCard"

export type qtyValue = [
    {[qtoName: string]: number}
]

export class ElementSetNameCard extends OBC.SimpleUIComponent {
    onDelete = new OBC.Event()
    onCardClick = new OBC.Event()

    setDataset
    private _qtyValueListElement: HTMLParagraphElement
    slots: {
        actionButtons: OBC.SimpleUIComponent
    }

    

    set setName(value: string) {
        //const setNameElement = this.getInnerElement("setName") as HTMLParagraphElement
        //setNameElement.textContent = value
    }
    set setData(values: any) {
        this.setDataset = values
        //console.log(values)
        //console.log(this._qtyValueListElement)
        while (this._qtyValueListElement.firstChild) {
            //console.log("clearing children:")
            //console.log(this._qtyValueListElement.firstChild)
            this._qtyValueListElement.removeChild(this._qtyValueListElement.firstChild)

        }
        //console.log("reading values")
        //console.log(values)
        
        for (let key in values) {
            if (values.hasOwnProperty(key)) {
                const value = values[key];
                //console.log(`${key}: ${value}`);
                const qtyValueCard = new ElementQtyCard(this.components)

                //console.log(key)
                //console.log(value)
                qtyValueCard.qtyValuePairData = {[key]: value}
                //console.log(qtyValueCard)
                this._qtyValueListElement.appendChild(qtyValueCard.domElement)
            }
        }
        
        //console.log(this._qtyValueListElement)
    }

    

    constructor(components: OBC.Components) {
        
        const template = `
        
            <div class="qty-item tooltip" >
            <div class="" style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; column-gap: 15px; align-items: center;">
                
                    <div>
                        <div class="qtyValueList" style="padding-left: 15px" id="qtyValueList">
                        
                        </div>
                    </div>
                </div>
                <div data-tooeen-slot="actionButtons"></div>
            </div>

            </div>
      
        `
        
        super(components, template)
        
        
        this._qtyValueListElement = this.getInnerElement("qtyValueList") as HTMLParagraphElement
        //console.log(this._qtyValueListElement)

        
        const cardElement = this.get()
        cardElement.addEventListener("click", () => {
            this.onCardClick.trigger()
        })
        this.setSlot("actionButtons", new OBC.SimpleUIComponent(this._components))
        

        
    }
    async dispose () {
        
        while (this._qtyValueListElement.firstChild) {
            //console.log("child:")
            //console.log(this._qtyValueListElement.firstChild)
            this._qtyValueListElement.removeChild(this._qtyValueListElement.firstChild)
        }
        
        //this.dispose()
    }

}