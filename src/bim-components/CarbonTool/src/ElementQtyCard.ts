import * as OBC from "openbim-components"
import { roundNumber } from "../../../utils/utils"

export class ElementQtyCard extends OBC.SimpleUIComponent {
    onDelete = new OBC.Event()
    onCardClick = new OBC.Event()


    set qtyName(value: string) {
        const qtyNameElement = this.getInnerElement("qtyName") as HTMLParagraphElement
        qtyNameElement.textContent = value
    }

    set qtyValue(value: number) {
        const qtyValueElement = this.getInnerElement("qtyValue") as HTMLParagraphElement
        qtyValueElement.textContent = roundNumber(value).toString()
    }

    

    constructor(components: OBC.Components) {
        const template = `
        
            <div class="element-value-item" style="" >
            <span id="qtyName" style="font-weight: bold;"></span>: <span id="qtyValue"></span>

            </div>
      
        `


        super(components, template)
        
    }
    async dispose() {
        this.dispose()
    }
}