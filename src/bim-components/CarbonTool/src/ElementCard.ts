import * as OBC from "openbim-components"
import { ElementQtyCard } from "./ElementQtyCard"
import { ElementSetNameCard } from "./ElementSetNameCard"
import { calculateTotalComponentGWP } from "../../../utils/epdx"
import { EPD } from "epdx"
import { Component } from "../../../classes/Component"



export class ElementCard extends OBC.SimpleUIComponent {
    callback: VoidFunction
    onDelete = new OBC.Event()
    onCardClick = new OBC.Event()
    //elementData
    elementSet
    epdxData: EPD[];
    constructionComponents: Component[];
    elementDataset
    elementGWP
    elementComponentID
    
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
    set elementComponent(value: string) {
        const elementComponentHTML = this.getInnerElement("ElementComponent") as HTMLParagraphElement
        elementComponentHTML.textContent = value
    }
    get elementData() {
        return this.elementDataset
    }
    set elementData(object) {
        this.elementSet = object
        //console.log("setting elementData")
        this.elementDataset = object
        this.calculateGWP(object)
        //console.log(this.elementDataset)
        const set = object
        //console.log(set)
        if (this.setList) {
            while (this.setList.firstChild) {
                //console.log("clearing children:")
                //console.log(this.setList.firstChild)
                const setCard = this.setList.firstChild
                
                this.setList.removeChild(this.setList.firstChild)
                //setCard.dispose()

            }
        }
        
        for (const setName in set) {
            //console.log(setName)
            if(setName == "CF values") {
                //console.log(set[setName])
                if (set.hasOwnProperty(setName)) {
                    const setCard = new ElementSetNameCard(this.components)
                
                    setCard.setName = setName
                    setCard.setData = set[setName]
                    
                    //console.log(setCard)
                    this.setList.appendChild(setCard.domElement)
                    //this.addChild(setCard)
                }
            }
            
        }
    }
    setCallback(callbackFunction) {
        this.callback = callbackFunction;
    }
    

    constructor(components: OBC.Components, epdxData, constructionComponents, callback) {
        
        
        const template = `
        
            <div class="element-item" >
            
            <div class="" >
                <div style="column-gap: 15px; align-items: center;">
                
                    <div>
                        <h3 id="ElementName">
                        
                        </h3>
                    </div>
                    <div>
                        <div class="element-component" id="ElementComponent">
                        ...select a component
                        </div>
                    </div>
                    
                </div>
                <div id="setList"> </ div>
                <div data-tooeen-slot="actionButtons"></div>
            </div>
            
            </div>
      
        `
        
        super(components, template)
        
        
        this.epdxData = epdxData;
        this.constructionComponents = constructionComponents;

        this._qtyElement = this.getInnerElement("ElementName") as HTMLParagraphElement
        this.setList = this.getInnerElement("setList") as HTMLParagraphElement
        //console.log(this._qtyElement)

        
        const cardElement = this.get()
        cardElement.addEventListener("click", () => {
            this.onCardClick.trigger()
        })
        this.setSlot("actionButtons", new OBC.SimpleUIComponent(this._components))
        
        this.callback = callback
        
    }
    async dispose () {
        
        while (this._qtyElement.firstChild) {
            //console.log("child:")
            //console.log(this._qtyElement.firstChild)
            this._qtyElement.removeChild(this._qtyElement.firstChild)
        }
        
        //this.dispose()
    }

    async setupOnClick(materialForm: OBC.FloatingWindow) {
        this.onCardClick.add(() => {
            //console.log("Setup onclick");
            //console.log(this.constructionComponents);
            const constructionComponents = this.constructionComponents
            // Clear existing content in materialForm if any
            var parentElement = materialForm.slots.content.domElement;
            while (parentElement.firstChild) {
                parentElement.removeChild(parentElement.firstChild);
            }
    
            // Create a select element for construction components
            const selectElement = document.createElement('select');
            constructionComponents.forEach(component => {
                const optionElement = document.createElement('option');
                optionElement.textContent = component.name;
                optionElement.value = component.id; // Use the component's ID as the value
                selectElement.appendChild(optionElement);
            });
    
            // Append the select element to materialForm's content
            materialForm.slots.content.domElement.appendChild(selectElement);
    
            // Create and add the "Apply" button to materialForm
            const acceptComponentBtn = new OBC.Button(this._components, {name: "Apply"});
            materialForm.addChild(acceptComponentBtn);
    
            // Set up the onClick event handler for the "Apply" button
            acceptComponentBtn.onClick.add(() => {
                // Access the selected value from the select element
                const selectedComponentID = selectElement.value;
    
                // Update the elementComponentID with the selected value
                this.elementComponentID = selectedComponentID;
    
                // Optional: Update UI or other properties as needed
                this.elementComponent = constructionComponents.find(c => c.id === selectedComponentID)?.name;
    
                //console.log("Selected Component ID:", this.elementComponentID);


                this.elementData = this.elementSet
                //this.calculateGWP(this.elementSet)


                this.callback()
            });
    
            
            materialForm.visible = true;
        });
    }
    
            // Ensure dropdownList is initialized
            /* if (!materialForm.innerElements.dropdownList) {
                materialForm.innerElements.dropdownList = document.createElement('ul');
                materialForm.slots.content.appendChild(materialForm.innerElements.dropdownList);
            }
    
            // Clear any previous options in the dropdown
            while (materialForm.innerElements.dropdownList.firstChild) {
                materialForm.innerElements.dropdownList.removeChild(materialForm.innerElements.dropdownList.firstChild);
            }
    
            // Add construction components to the dropdown
            constructionComponents.forEach(component => {
                const listItem = document.createElement('li');
                listItem.dataset.value = component.id;
                listItem.textContent = component.name;
                materialForm.innerElements.dropdownList.appendChild(listItem);
            }); */
    
            
    calculateGWPold(set) {
        //console.log("Calculating GWP")
        
        for (const setName in set) {
            //console.log(setName)
            if(setName == "CF values") {
                //console.log(set["CF values"])
                //console.log(set["CF values"]["Amount"])
                //console.log(set["CF values"]["Element GWP / unit"])
                set["CF values"]["Amount"] * set["CF values"]["Element GWP / unit"]
                set["CF values"]["Carbon Footprint"] = set["CF values"]["Amount"] * set["CF values"]["Element GWP / unit"]
            }
        }


    }
    calculateGWP(set) {
        //console.log("Calculating GWP")
        let compGWP = 0
        //console.log("Component GWP:")
        if (this.elementComponentID) {

        
            const component = this.constructionComponents.find(comp => comp.id === this.elementComponentID);

            if (!component) {
                console.error("Component not found");
                
            } else {
                // Assuming the component's layers field is in the correct format for calculateTotalComponentGWP
                // or you might need to adjust it based on your application's needs
                const layers = component.layers; // Assuming layers is a JSON string or an object/array

                // If layers is not a string but an object/array, you might need to stringify it
                

                compGWP = calculateTotalComponentGWP(layers,this.epdxData)
                //console.log(compGWP)

            }
        }
        
        for (const setName in set) {
            //console.log(setName)
            if(setName == "CF values") {
                //console.log(set["CF values"])
                //console.log(set["CF values"]["Amount"])
                //console.log(set["CF values"]["Element GWP / unit"])
                //set["CF values"]["Amount"] * set["CF values"]["Element GWP / unit"]
                set["CF values"]["Element GWP / unit"] = compGWP
                set["CF values"]["Carbon Footprint"] = set["CF values"]["Amount"] * compGWP
                //set["CF values"]["Carbon Footprint"] = set["CF values"]["Amount"] * set["CF values"]["Element GWP / unit"]


                //console.log(set["CF values"])
            }
        }


    }
}