import * as OBC from "openbim-components"
import { ElementQtyCard } from "./ElementQtyCard"
import { ElementSetNameCard } from "./ElementSetNameCard"
import { roundNumber } from "../../../utils/utils"



export class ResultsCard extends OBC.SimpleUIComponent {
    onDelete = new OBC.Event()
    onCardClick = new OBC.Event()
    resultDataset
    resultContainer
    
    private _qtyElement: HTMLParagraphElement
    slots: {
        actionButtons: OBC.SimpleUIComponent
    }

    
    get resultData() {
        return this.resultDataset
    }
    set resultData(object) {
        this.calculateGWP(object)
    }
    set totalResult(value) {
        console.log(value)
        this.resultContainer.textContent = roundNumber(value).toString() + ' kgCO2e'
    }

    

    constructor(components: OBC.Components) {
        
        const template = `
        
            <div class="result-item" >
            
            <div class="" >
                <div style="display: flex; column-gap: 15px; align-items: center;">
                
                    <div>
                        <h4 id="resultName">
                        Total Carbon Footprint [kgCO2e]: 
                        </h4>
                    </div>
                    
                    
                </div>
                <div>
                        <h4 id="resultsContainer">
                        
                        </h4>
                    </div>
                <div id=""> </ div>
                <div data-tooeen-slot="actionButtons"></div>
            </div>
            
            </div>
      
        `
        
        super(components, template)
        this.resultContainer = this.getInnerElement("resultsContainer") as HTMLParagraphElement 
        
        

        
        

        
        
        
    }
    async dispose () {
        this.dispose()
       
        
   
    }

    async setupOnClick(materialForm) {
        
        
        
    }
    calculateGWP(list) {
        //console.log("Calculating GWP")
        let tempResult = 0
        for (const item in list) {
            const sets = list[item]
            for(const setName in sets) {
                //console.log(setName)
                if(setName == "CF values") {
                    const element = sets[setName]
                    //console.log(element)
                    //console.log(element["Carbon Footprint"])
                    const result = element["Carbon Footprint"]
                    tempResult += result
    
                }
            }
        }
        
        

        this.totalResult = tempResult
        //console.log(tempResult)
    }
}