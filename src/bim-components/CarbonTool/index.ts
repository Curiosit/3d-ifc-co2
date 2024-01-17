import * as OBC from "openbim-components"
import * as THREE from "three"
import * as WEBIFC from "web-ifc"
import { addDocument, deleteDocument, getCollection } from "../../firebase"
import { Project } from "../../classes/Project"
import * as Firestore from "firebase/firestore"
import { addArrayList, parseFragmentIdMap, showModal, stringifyFragmentIdMap } from "../../utils/utils"
import { BuildingCarbonFootprint, Status } from "../../types/types"
import  {FragmentsGroup} from "bim-fragment"
import { ElementCard } from "./src/ElementCard"
import { ElementQtyCard } from "./src/ElementQtyCard"
import { ElementSetNameCard } from "./src/ElementSetNameCard"

//const todosCollection = getCollection<ToDoData>("/todos")
type QtoResult = {
    [setName: string]: {[qtoName: string]: number}

}

type QtoResultByElementName = {
    [elementName: string] : {
        [setName: string]: {[qtoName: string]: number}
    }
    

}

export class CarbonTool extends OBC.Component<BuildingCarbonFootprint> implements OBC.UI, OBC.Disposable {
    materialForm: OBC.Modal
    GWPInput
    currentElementCard
    carbonFootprint: BuildingCarbonFootprint
    static uuid = "932ed24b-87de-46a2-869f-8fda0d684c15"
    properties
    private _qtoResult: QtoResult
    private _qtoResultByElementName: QtoResultByElementName
    private _qtoList: { [key: string]: any }[] = [];
    enabled: boolean = true
    private _components: OBC.Components
    uiElement = new OBC.UIElement<
    {
        activationBtn: OBC.Button
        qtoWindow: OBC.FloatingWindow
        carbonWindow: OBC.FloatingWindow
    }>()

    async dispose() {

    }
    get(): BuildingCarbonFootprint {
        return this.carbonFootprint
    }

    constructor (components: OBC.Components) {
        super(components)
        this._components = components
        components.scene
        this._qtoResultByElementName = {}
        this._qtoResult = {}
        this.setUI()
        //this.getQuantities()
    }

    private setUI() {
        const activationBtn = new OBC.Button(this._components)
        activationBtn.materialIcon = "co2"
        activationBtn.tooltip = "Carbon Footprint"

        

        const qtoWindow = new OBC.FloatingWindow(this._components)
        qtoWindow.title = "Quantities"
        this._components.ui.add(qtoWindow)
        qtoWindow.visible = false

        const carbonWindow = new OBC.FloatingWindow(this._components)
        carbonWindow.title = "Results"
        this._components.ui.add(carbonWindow)
        carbonWindow.visible = false

        activationBtn.onClick.add(() => {
            //this.getQuantities()
            activationBtn.active = !activationBtn.active
            //qtoWindow.visible = activationBtn.active
        })

        const qtoWindowBtn = new OBC.Button(this._components, {name: "Quantities"})
        activationBtn.addChild(qtoWindowBtn)

        const carbonWindowBtn = new OBC.Button(this._components, {name: "Results"})
        activationBtn.addChild(carbonWindowBtn)

        this.uiElement.set({activationBtn, qtoWindow, carbonWindow})
        
        qtoWindowBtn.onClick.add(() => {
            this.getQuantities()
            qtoWindowBtn.active = !qtoWindowBtn.active
            qtoWindow.visible = qtoWindowBtn.active
            console.log(qtoWindowBtn.active)
            console.log(qtoWindow.visible)
        })

        carbonWindowBtn.onClick.add(() => {
            
            carbonWindowBtn.active = !carbonWindowBtn.active
            carbonWindow.visible = carbonWindowBtn.active
            console.log(carbonWindowBtn.active)
            console.log(carbonWindow.visible)
        })


        this.materialForm = new OBC.Modal(this._components)
        this._components.ui.add(this.materialForm)
        this.materialForm.title = "Set Material Data"

        const GWPInput = new OBC.TextInput(this._components)
        GWPInput.label = "Component GWP [kgCO2e/unit]"
        this.GWPInput = GWPInput
        this.materialForm.slots.content.addChild(GWPInput)


        this.materialForm.slots.content.get().style.padding = "20px"
        this.materialForm.slots.content.get().style.display = "flex"
        this.materialForm.slots.content.get().style.flexDirection = "column"
        this.materialForm.slots.content.get().style.rowGap = "20px"
        

        this.materialForm.onAccept.add(() => {
            //elementCard.updateGWP(GWPInput.value)
            this.currentElementCard.data["CF values"]["Element GWP / unit"] = this.GWPInput.value 
            
            GWPInput.value = ""
            this.materialForm.visible = false

        })

        this.materialForm.onCancel.add(() => {
            this.materialForm.visible = false
        })
        console.log(this.materialForm)
    }
    async updateUI () {
        const qtoList = this.uiElement.get("qtoWindow")
        console.log(this._qtoResultByElementName)
        this._qtoList = []
        for (const elementName in this._qtoResultByElementName) {
            console.log(this._qtoResultByElementName[elementName])
            
            const elementCard = new ElementCard(this.components)
            elementCard.data = this._qtoResultByElementName[elementName]
            elementCard.elementName = elementName
            console.log(this.materialForm)
            await elementCard.setupOnClick(this.materialForm)

            
            qtoList.addChild(elementCard)
            const set = this._qtoResultByElementName[elementName]
            this._qtoList = []
            for (const setName in set) {
                if(setName == "CF values") {
                    if (set.hasOwnProperty(setName)) {
                        const qtyCard = new ElementSetNameCard(this.components)
                    
                        qtyCard.setName = setName
                        
                        const qtoValues = set[setName];
                    
                        
                        
                        for (const qtoName in qtoValues) {
                            console.log(qtoName)
                            if (qtoValues.hasOwnProperty(qtoName)) {
                                const qtoValue = qtoValues[qtoName];
                                //console.log(`  Qto Name: ${qtoName}, Value: ${qtoValue}`);
                                const item = { [qtoName]: qtoValue };

                                // Push the object into qlist
                                this._qtoList.push(item);
                            }
                        }
                        console.log(qtyCard)
                        qtyCard.qtyValueList = this._qtoList
                        //console.log(qtyCard)
                        console.log(qtyCard)
                        elementCard.addChild(qtyCard)
                    }
                }
            console.log(this.materialForm)
            elementCard.onCardClick.add(() => {
                console.log(elementCard)
                this.currentElementCard = elementCard
                
                
                this.GWPInput.value = this.currentElementCard.data["CF values"]["Element GWP / unit"]
                })    
            }
            
        } 
    }
    resetWindow() {
        
        const qtoList = this.uiElement.get("qtoWindow")
        //console.log(qtoList)
        //console.log(qtoList.children[0].children)
        for (const childID in qtoList.children[0].children) {
            
            const qtyCard = qtoList.children[0].children[childID] as ElementCard
            
            
            //qtyCard.dispose()
            
            //console.log(childID)
            //console.log(qtyCard)
            //qtyCard.qtyElementList = []
            
            qtyCard.removeFromParent()
            qtyCard.dispose()
            
        }
        qtoList.cleanData()
        /* while (qtoList.children[0]) {
            qtoList.removeChild(qtoList.children[0]);
        } */
    }




    sumQuantities(properties, elements, elementType) {
        let idMap = new Array()
        let qtoResultByElementName: QtoResultByElementName
        qtoResultByElementName = {}
        for (const elementID in elements) {

            const name = properties[elements[elementID].expressID].Name.value
            idMap.push(elements[elementID].expressID)
            
            if (!(name in qtoResultByElementName)) {
                qtoResultByElementName[name] = {}
                
            }
            const resultRow = qtoResultByElementName[name]

        console.log("________________________________________________________________________")

            
            OBC.IfcPropertiesUtils.getRelationMap(
                properties, 
                WEBIFC.IFCRELDEFINESBYPROPERTIES,
                (setID, relatedIDs) => {
                    const set = properties[setID]
                    if ( set.type !== WEBIFC.IFCELEMENTQUANTITY) { return}

                    const expressIDs = idMap

                    const workingIDs = expressIDs.filter(id => relatedIDs.includes(id));

                    if (workingIDs.length > 0) {
                    console.log('Working IDs:', workingIDs);
                    } else {
                    //console.log('No common IDs found between expressIDs and relatedIDs');
                    }

                    const { name: setName} = OBC.IfcPropertiesUtils.getEntityName(properties, setID)

                    if ( !setName || workingIDs.length === 0  || set.type !== WEBIFC.IFCELEMENTQUANTITY) { return}
                    
                    if (!(setName in resultRow)) {
                        resultRow[setName] = {}
                    }

                    
                    OBC.IfcPropertiesUtils.getQsetQuantities(
                        properties,
                        setID,
                        (qtoID) => {
                            //console.log(properties[qtoID])
                            const { name: qtoName} = OBC.IfcPropertiesUtils.getEntityName(properties, qtoID)
                            console.log(qtoName)
                            const { value } = OBC.IfcPropertiesUtils.getQuantityValue(properties, qtoID)
                            console.log(value)
                            if(!qtoName || !value) {return}
                            //console.log(qtoName)
                            if (!(qtoName in resultRow[setName])) {
                                resultRow[setName][qtoName] = 0
                            
                            }
                            resultRow[setName][qtoName] += value
                        }
                    )
                }
                
            )

        }
        return qtoResultByElementName
        
    }
    calculateQuantities(properties, elements, elementType) {

        let idMap = new Array()
        let qtoResultByElementName: QtoResultByElementName
        let result
        
        qtoResultByElementName = {}
        console.log(qtoResultByElementName)

        console.log("________________________________________________________________________")
        console.log("________________________________________________________________________")
        console.log("________________________________________________________________________")
        
        if (elementType == "walls") {
            result = {
                name: "Walls",
                elements: []

            }
        }
        console.log(elements)
        for (const elementID in elements) {
            idMap = []
            console.log("________________________________________________________________________")
            console.log(elementID)
            console.log(elements[elementID])
            const name = properties[elements[elementID].expressID].Name.value
            const nameWithID = name + '#' + elements[elementID].expressID
            idMap.push(elements[elementID].expressID)
            
            /* if (!(name in qtoResultByElementName)) {
                qtoResultByElementName[name] = {}
                result.elements.push(name)
            } */
            qtoResultByElementName[nameWithID] = {}
            const resultRow = qtoResultByElementName[nameWithID]
            console.log(qtoResultByElementName[nameWithID])
            console.log("________________________________________________________________________")

            console.log(resultRow)
            OBC.IfcPropertiesUtils.getRelationMap(
                properties, 
                WEBIFC.IFCRELDEFINESBYPROPERTIES,
                (setID, relatedIDs) => {
                    console.log("GET RELATION MAP")
                    
                    const set = properties[setID]
                    if ( set.type !== WEBIFC.IFCELEMENTQUANTITY) { return}
                    //console.log(setID)
                    //console.log(set)
                    //console.log(relatedIDs)
                    //console.log(idMap)
                    const expressIDs = idMap

                    const workingIDs = expressIDs.filter(id => relatedIDs.includes(id));

                    if (workingIDs.length > 0) {
                    //console.log('Working IDs:', workingIDs);
                    } else {
                    //console.log('No common IDs found between expressIDs and relatedIDs');
                    }

                    const { name: setName} = OBC.IfcPropertiesUtils.getEntityName(properties, setID)

                    if ( !setName || workingIDs.length === 0  || set.type !== WEBIFC.IFCELEMENTQUANTITY) { return}
                    
                    if (!(setName in resultRow)) {
                        resultRow[setName] = {}
                    }

                    
                    OBC.IfcPropertiesUtils.getQsetQuantities(
                        properties,
                        setID,
                        (qtoID) => {
                            //console.log(properties[qtoID])
                            const { name: qtoName} = OBC.IfcPropertiesUtils.getEntityName(properties, qtoID)
                            console.log(qtoName)
                            const { value } = OBC.IfcPropertiesUtils.getQuantityValue(properties, qtoID)
                            console.log(value)
                            if(!qtoName || !value) {return}
                            //console.log(qtoName)
                            if (!(qtoName in resultRow[setName])) {
                                resultRow[setName][qtoName] = value
                            
                            }
                            if ((qtoName in resultRow[setName])) {
                                resultRow[setName][qtoName] = Math.min(resultRow[setName][qtoName], value) //find a lower value, as there are multiple netVolumes !!!!!!
                            
                            }
                            //resultRow[setName][qtoName] = value
                        }
                    )
                    console.log("Element thickness: ")
                    const thickness = resultRow["BaseQuantities"]["Width"] / 1000
                    console.log(thickness)
                    console.log("Element volume: ")
                    const volume = resultRow["BaseQuantities"]["NetVolume"]
                    console.log(volume)

                    console.log("Element area: ")
                    const area = volume / thickness
                    console.log(area)
                    //qtoResultByElementName[nameWithID]["CF values"]["Area"] = area
                    //qtoResultByElementName[nameWithID]["CF values"]["Element GWP"] = 0
                    qtoResultByElementName[nameWithID]["CF values"] =   {
                        "Area": area,
                        "Element GWP / unit": 0,
                        "Carbon Footprint": 0
                    } 
                }
                
            )
            console.log(resultRow)
            
            
        }
        return qtoResultByElementName
        
    }
    

    getQuantities() {
        console.log("_______________________________________") 
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$") 
            /*
            const fragmentManager = await this._components.tools.get(OBC.FragmentManager)
            console.log(fragmentManager)
            console.log(fragmentManager.groups)
            let properties
            for (const groupID in fragmentManager.groups) {
                console.log(groupID)
                const group = fragmentManager.groups[groupID]
                console.log(group.keyFragments)
                const fragmentMap = group.keyFragments 
                for (const fragmentID in fragmentMap) {
                    console.log(fragmentID)
                    
                    const fragmentUUID = fragmentMap[fragmentID]
                    console.log(fragmentUUID as string)
                    const fragment = fragmentManager.list[fragmentUUID]
                    console.log(fragment)
                    const model = fragment.mesh.parent
                    if (!(model instanceof FragmentsGroup && model.properties )) { continue }
                    properties = model.properties
                    console.log(properties)
                }   
            }     
            console.log(properties) */
            
        const properties = this.properties      
        console.log(properties)  

                    
                    
        let typeList = new Array()
        typeList = []
        const walls = OBC.IfcPropertiesUtils.getAllItemsOfType(
                        properties,
                        WEBIFC.IFCWALLSTANDARDCASE
                        ) 
        console.log(walls)
                    
                    
        const slabs = OBC.IfcPropertiesUtils.getAllItemsOfType(
                        properties,
                        WEBIFC.IFCSLAB
                        )
        console.log(slabs)
                    
        const doors = OBC.IfcPropertiesUtils.getAllItemsOfType(
                        properties,
                        WEBIFC.IFCDOOR
        )
                    
                    
        const elements = typeList
                    
        //const elements = slabs
        console.log(elements)
                    
        this._qtoResultByElementName = this.calculateQuantities(properties, walls, "walls")
        
                
                        




            
                        
                        

        
        console.log(this._qtoResultByElementName)
        this.resetWindow()
        this.updateUI()
    }
                    
                    
                    
               
                    
}
    

