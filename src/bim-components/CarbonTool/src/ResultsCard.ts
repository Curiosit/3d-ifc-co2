import * as OBC from "openbim-components"
import { ElementQtyCard } from "./ElementQtyCard"
import { ElementSetNameCard } from "./ElementSetNameCard"
import { roundNumber } from "../../../utils/utils"

import Chart, { ChartItem } from 'chart.js/auto';

export class ResultsCard extends OBC.SimpleUIComponent {
    onDelete = new OBC.Event()
    onCardClick = new OBC.Event()
    resultDataset
    resultContainer
    ctxChartComponentsGWP
    ctx2
    private _qtyElement: HTMLParagraphElement
    slots: {
        actionButtons: OBC.SimpleUIComponent
    }

    
    get resultData() {
        return this.resultDataset
    }
    set resultData(object) {
        console.log("Set result")
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
                    
                    <div id=""> 
                        
                        <canvas class="chart-area-componentsGWP" id="chart-area-componentsGWP"></canvas>
                    
                    </ div>
                    <div data-tooeen-slot="actionButtons"></div>
                    
                </div>
            
            </div>
      
        `
        
        super(components, template)
        this.resultContainer = this.getInnerElement("resultsContainer") as HTMLParagraphElement 
        console.log(this.resultContainer)
        
        
        this.ctxChartComponentsGWP = document.getElementsByClassName('chart-area-componentsGWP')
        this.ctx2 = this.getInnerElement("chart-area-componentsGWP") 
        console.log(this.ctxChartComponentsGWP)
        console.log(this.ctx2)
        
        
    }
    

    async dispose () {
        this.dispose()
       
        
   
    }

    async setupOnClick(materialForm) {
        
        
        
    }
    calculateGWP(data: any) {
        

        
        console.log("Calculating GWP")
        const componentsGWPtable = new Array()
        const componentLabels = new Array()
        let tempResult = 0
        //console.log(list)
        console.log(data)
        for (const item in data) {
            console.log(item)
            const card = data[item]
            console.log(card)
            //console.log(item)
            const list = card.elementDataset
            console.log(list)
            const sets = list
            for(const setName in sets) {
                console.log(setName)
                if(setName == "CF values") {
                    const element = sets[setName]
                    console.log(element)
                    console.log(element["Carbon Footprint"])
                    
                    const result = element["Carbon Footprint"]
                    console.log(result)
                    tempResult += result
                    console.log(tempResult)
                    componentsGWPtable.push(element["Carbon Footprint"])
                    componentLabels.push(card.name)
    
                }
            }
        }
        
        
        
        console.log(componentsGWPtable)
        console.log(componentLabels)
        this.totalResult = tempResult
        //console.log(tempResult)
    }

    generateElementGWPChart(zippedGWP) {
        Chart.defaults.color = '#fff';
        Chart.defaults.borderColor = '#415A66';

        const componentLabels = zippedGWP.map(tuple => tuple[0]);
        const componentsGWPtable = zippedGWP.map(tuple => tuple[1]);
        

        const ctx = this.ctxChartComponentsGWP[0] 
        if(!this.ctx2) { return }
        let ChartComponentsGWP = new Chart(this.ctx2, {
                                type: 'bar',
                                data: {
                                    labels: componentLabels,
                                    fontColor : '#fff',
                                    scales: {
                                        x: {
                                        ticks: {
                                            color: "#415A66"
                                        },
                                        },
                                        y: {
                                        ticks: {
                                            color: "#415A66",
                                            }
                                        },
                                        grid: {
                                            color: '#415A66'
                                        },
                                        },
                                    
                                    datasets:  [
                                        {
                                            label: 'GWP by Element [kgCO2]',
                                            data: componentsGWPtable,
                                            backgroundColor: '#ff2452',
                                            stack: 'Stack 0'
                                            
                                        },

                                    ],

                                },
                                options: {
                                    showLines: false,
                                    plugins: { 
                                        datalabels: {
                                            color: "#fff",
                                        },
                                        legend: {
                                            labels: {
                                                color: "#fff", 
                                                font: {
                                                size: 18
                                                }
                                            }
                                        }
                                    },
                                    responsive: true,
                                    scales: {
                                        x: {
                                        stacked: true,
                                        },
                                        y: {
                                        stacked: true
                                        }
                                    }
                            
                                },
        });

        console.log(ChartComponentsGWP)
    }
}