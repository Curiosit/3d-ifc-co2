import * as OBC from "openbim-components"
import { ElementQtyCard } from "./ElementQtyCard"
import { ElementSetNameCard } from "./ElementSetNameCard"



export class ElementCard extends OBC.SimpleUIComponent {
    onDelete = new OBC.Event()
    onCardClick = new OBC.Event()
    //elementData
    elementDataset
    elementGWP
    result: number
    setList: HTMLParagraphElement
    private _qtyElement: HTMLParagraphElement
    slots: {
        actionButtons: OBC.SimpleUIComponent
    }

    set elementName(value: string) {
        const elementNameHTML = this.getInnerElement("ElementName") as HTMLParagraphElement
        elementNameHTML.textContent = value
    }
    get elementData() {
        return this.elementDataset
    }
    set elementData(object) {
        console.log("setting elementData")
        this.elementDataset = object
        this.calculateGWP(object)
        console.log(this.elementDataset)
        const set = object
        console.log(set)
        if (this.setList) {
            while (this.setList.firstChild) {
                console.log("clearing children:")
                console.log(this.setList.firstChild)
                const setCard = this.setList.firstChild
                
                this.setList.removeChild(this.setList.firstChild)
                //setCard.dispose()

            }
        }
        
        for (const setName in set) {
            console.log(setName)
            if(setName == "CF values") {
                console.log(set[setName])
                if (set.hasOwnProperty(setName)) {
                    const setCard = new ElementSetNameCard(this.components)
                
                    setCard.setName = setName
                    setCard.setData = set[setName]
                    
                    console.log(setCard)
                    this.setList.appendChild(setCard.domElement)
                    //this.addChild(setCard)
                }
            }
            
        }
    }

    

    constructor(components: OBC.Components) {
        
        const template = `
        
            <div class="element-item" >
            
            <div class="" >
                <div style="display: flex; column-gap: 15px; align-items: center;">
                
                    <div>
                        <h3 id="ElementName">
                        
                        </h3>
                    </div>
                    <div>
                        <h4 id="ElementResult">
                        
                        </h4>
                    </div>
                    
                </div>
                <div id="setList"> </ div>
                <div data-tooeen-slot="actionButtons"></div>
            </div>
            
            </div>
      
        `
        
        super(components, template)
        
        

        this._qtyElement = this.getInnerElement("ElementName") as HTMLParagraphElement
        this.setList = this.getInnerElement("setList") as HTMLParagraphElement
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

    async setupOnClick(materialForm) {
        this.onCardClick.add(() => {

            console.log("Setup onclick")
            console.log(materialForm)
            //this.setupEditForm(materialForm)  
            materialForm.visible = true
        })
        
        
    }
    calculateGWP(set) {
        console.log("Calculating GWP")
        
        for (const setName in set) {
            console.log(setName)
            if(setName == "CF values") {
                console.log(set["CF values"])
                console.log(set["CF values"]["Amount"])
                console.log(set["CF values"]["Element GWP / unit"])
                set["CF values"]["Amount"] * set["CF values"]["Element GWP / unit"]
                set["CF values"]["Carbon Footprint"] = set["CF values"]["Amount"] * set["CF values"]["Element GWP / unit"]
            }
        }


    }
}