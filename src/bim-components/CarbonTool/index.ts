import * as OBC from "openbim-components"
import * as THREE from "three"
import * as WEBIFC from "web-ifc"
import { addDocument, deleteDocument, getCollection } from "../../firebase"
import { Project } from "../../classes/Project"
import * as Firestore from "firebase/firestore"
import { addArrayList, parseFragmentIdMap, stringifyFragmentIdMap } from "../../utils/utils"
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
        activationBtn.onClick.add(() => {
            this.getQuantities()
            activationBtn.active = !activationBtn.active
            qtoWindow.visible = activationBtn.active
        })

        this.uiElement.set({activationBtn, qtoWindow})

    }
    updateUI () {
        const qtoList = this.uiElement.get("qtoWindow")
        console.log(this._qtoResultByElementName)
        this._qtoList = []
        for (const elementName in this._qtoResultByElementName) {
            console.log(this._qtoResultByElementName[elementName])
            
            const elementCard = new ElementCard(this.components)
            elementCard.elementName = elementName
            qtoList.addChild(elementCard)
            const set = this._qtoResultByElementName[elementName]
            this._qtoList = []
            for (const setName in set) {
                
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
            qtyCard.dispose()
            qtyCard.removeFromParent()
            
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
                    console.log(setID)
                    console.log(set)
                    console.log(relatedIDs)
                    console.log(idMap)
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
                                resultRow[setName][qtoName] = value
                            
                            }
                            if ((qtoName in resultRow[setName])) {
                                resultRow[setName][qtoName] = Math.min(resultRow[setName][qtoName], value) //find a lower value, as there are multiple netVolumes !!!!!!
                            
                            }
                            //resultRow[setName][qtoName] = value
                        }
                    )
                    //console.log("Element area: ")
                    //const volume = resultRow["BaseQuantities"]["NetVolume"]

                    
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
    

