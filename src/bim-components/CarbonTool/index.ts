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
import { ResultsCard } from "./src/ResultsCard"
import { getFirestoreComponents, getFirestoreMaterials } from "../../utils/materialdata"
import { Component } from "../../classes/Component"
import { convertToEpdx } from "../../utils/epdx"
import { EPD } from "epdx"


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
    resultsCard: ResultsCard
    currentElementCard: ElementCard
    elementCardList : ElementCard[] = []
    carbonFootprint: BuildingCarbonFootprint
    definedComponents
    static uuid = "932ed24b-87de-46a2-869f-8fda0d684c15"
    properties
    private _qtoResult: QtoResult
    private _qtoResultByElementName: QtoResultByElementName
    private _qtoList: { [key: string]: any }[] = [];
    enabled: boolean = true
    private _components: OBC.Components
    constructionComponents: Component[] = [];
    epdxData: EPD[] = []
    constructionSetWindow
    
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

        this.callback = this.callback.bind(this);
        this.sumGWP = this.sumGWP.bind(this);

        this.setUI()
        //this.getQuantities()
        
    }
    async loadData() {
        try {
            this.constructionComponents = await getFirestoreComponents();
            console.log(this.constructionComponents)
        } catch (error) {
            console.error("Error loading components:", error);
        }
        try {
            const data = await getFirestoreMaterials()
            const epdData = convertToEpdx(data)
            this.epdxData = epdData
            console.log(this.epdxData)
        } catch (error) {
            console.error("Error loading components:", error);
        }
    }


    private async setUI() {
        
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

        const constructionListWindow = new OBC.FloatingWindow(this._components)
        constructionListWindow.title = "Components List"
        this._components.ui.add(constructionListWindow)
        constructionListWindow.visible = false

        const constructionSetWindow = new OBC.FloatingWindow(this._components)
        constructionSetWindow.title = "Set Component"
        this._components.ui.add(constructionSetWindow)
        constructionSetWindow.visible = false
        
        
        this.constructionSetWindow = constructionSetWindow

        activationBtn.onClick.add(() => {

            activationBtn.active = !activationBtn.active

        })

        const qtoWindowBtn = new OBC.Button(this._components, {name: "Quantities"})
        activationBtn.addChild(qtoWindowBtn)

        const carbonWindowBtn = new OBC.Button(this._components, {name: "Results"})
        activationBtn.addChild(carbonWindowBtn)

        const constructionListWindowBtn = new OBC.Button(this._components, {name: "Components"})
        activationBtn.addChild(constructionListWindowBtn)

        this.uiElement.set({activationBtn, qtoWindow, carbonWindow})
        
        qtoWindowBtn.onClick.add(() => {
            this.getQuantities()
            qtoWindowBtn.active = !qtoWindowBtn.active
            qtoWindow.visible = qtoWindowBtn.active

        })
        

        carbonWindowBtn.onClick.add(() => {
            
            carbonWindowBtn.active = !carbonWindowBtn.active
            carbonWindow.visible = carbonWindowBtn.active
            if(carbonWindow.visible) {
                
            }

            console.log(carbonWindowBtn.active)
            console.log(carbonWindow.visible)
        })


        constructionListWindowBtn.onClick.add(() => {
            
            constructionListWindowBtn.active = !constructionListWindowBtn.active
            constructionListWindow.visible = constructionListWindow.active


        })

        await this.loadData()
        

        
        
        





        
        

        /* this.materialForm.onAccept.add(() => {
            //elementCard.updateGWP(GWPInput.value)
            console.log("Modifying")
            console.log(this.currentElementCard.elementData)
            console.log(Number(this.GWPInput.value))
            const elData = this.currentElementCard.elementData
            elData["CF values"]["Element GWP / unit"] = Number(this.GWPInput.value)
            console.log(elData)
            this.currentElementCard.elementData = elData
            console.log(elData)
            console.log(this.currentElementCard.elementData)
            GWPInput.value = ""
            this.updateUI()
            this.materialForm.visible = false

        }) */

        
    }
    callback() {
        console.log("Calling back from card")
        this.sumGWP()
        
    }

    sumGWP() {
        // Initialize the total sum of GWP (Global Warming Potential)
        let totalGWP = 0;
    
        // Iterate through each ElementCard in the elementCardList
        this.elementCardList.forEach((elementCard) => {
            // Check if the elementData and 'CF values' exist to avoid runtime errors
            if (elementCard.elementData && elementCard.elementData['CF values']) {
                // Access the 'Carbon Footprint' value and add it to the totalGWP
                const carbonFootprint = elementCard.elementData['CF values']['Carbon Footprint'];
                if (typeof carbonFootprint === 'number') {
                    totalGWP += carbonFootprint;
                }
            }
        });
    
        // Optionally, you can log or perform further actions with the totalGWP
        console.log(`Total Carbon Footprint: ${totalGWP} kg CO2eq`);
    
        // Return the total GWP if needed




        const resultsWindow = this.uiElement.get("carbonWindow")
        if(this.resultsCard) {
            this.resultsCard.removeFromParent()
        }
        const resultsCard = new ResultsCard(this.components)
        this.resultsCard = resultsCard

        resultsCard.totalResult = totalGWP

        resultsWindow.addChild(resultsCard)



        return totalGWP;
    }
    async updateUI () {
        const qtoList = this.uiElement.get("qtoWindow")
        console.log(this._qtoResultByElementName)
        this._qtoList = []

        for (const elementName in this._qtoResultByElementName) {
            console.log(this._qtoResultByElementName[elementName])
            
            const elementCard = new ElementCard(this.components, this.epdxData, this.constructionComponents, this.callback);
            //elementCard.callback = this.callback()
            elementCard.data = this._qtoResultByElementName[elementName]
            elementCard.elementName = elementName
            console.log(this.materialForm)
            await elementCard.setupOnClick(this.constructionSetWindow)
            
            
            qtoList.addChild(elementCard)
            const set = this._qtoResultByElementName[elementName]
            this._qtoList = []
            console.log(set)
            elementCard.elementData = set
            this.elementCardList.push(elementCard)
            console.log(this.materialForm)
            elementCard.onCardClick.add(() => {
                console.log(elementCard)
                this.currentElementCard = elementCard

                //this.GWPInput.value = this.currentElementCard.elementData["CF values"]["Element GWP / unit"]
            })    
        }
        const resultsWindow = this.uiElement.get("carbonWindow")
        if(this.resultsCard) {
            this.resultsCard.removeFromParent()
        }
        const resultsCard = new ResultsCard(this.components)
        this.resultsCard = resultsCard
        let elementData = new Array()
        for (const card in this.elementCardList) {
            elementData.push(this.elementCardList[card].elementData)
        }
        console.log(elementData)
        console.log("UPDATING RESULTS")
        resultsCard.resultData=elementData
        console.log(elementData)
        console.log(resultsCard.totalResult)
        resultsWindow.addChild(resultsCard)
    }
    resetWindow() {
        
        const qtoList = this.uiElement.get("qtoWindow")

        for (const childID in qtoList.children[0].children) {
            
            const qtyCard = qtoList.children[0].children[childID] as ElementCard

            
            qtyCard.removeFromParent()
            qtyCard.dispose()
            
        }
        qtoList.cleanData()

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
        let qtoResultByElementFamily: QtoResultByElementName
        let result
        
        qtoResultByElementName = {}
        qtoResultByElementFamily = {}
        console.log(qtoResultByElementName)
        console.log(qtoResultByElementFamily)
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
        const byInstance = false
        for (const elementID in elements) {
            idMap = []
            //console.log("________________________________________________________________________")
            //console.log(elementID)
            console.log(elements[elementID])
            const name = properties[elements[elementID].expressID].Name.value
            
            let nameValue
            if (byInstance) {
                const nameWithID = name + '#' + elements[elementID].expressID
                nameValue = nameWithID
            }
            else {
                const family = properties[elements[elementID].expressID].ObjectType.value
                nameValue = family
            }
            idMap.push(elements[elementID].expressID)
            
            qtoResultByElementName[nameValue] = {}
            const resultRow = qtoResultByElementName[nameValue]
            //console.log(qtoResultByElementName[nameWithID])
            //console.log("________________________________________________________________________")

            console.log(resultRow)
            OBC.IfcPropertiesUtils.getRelationMap(
                properties, 
                WEBIFC.IFCRELDEFINESBYPROPERTIES,
                (setID, relatedIDs) => {
                    //console.log("GET RELATION MAP")
                    
                    const set = properties[setID]
                    //console.log(setID)
                    //console.log(set)
                    //console.log(relatedIDs)
                    /* if ( set.type !== WEBIFC.IFCELEMENTQUANTITY) { return} */
                    
                    // PROPERTYSETSINGLEVALUE DIMENSIONS (PANELS)
                    if(elementType == 'curtainPanels') {

                        console.log("PANELS")
                        if ( set.type == WEBIFC.IFCPROPERTYSET) { 
                            console.log(set) 
                            const expressIDs = idMap
                            const workingIDs = expressIDs.filter(id => relatedIDs.includes(id));
                            if (workingIDs.length > 0) {
                                console.log('Working IDs:', workingIDs);
                                } else {
                                console.log('No common IDs found between expressIDs and relatedIDs');
                            }
                            const { name: setName} = OBC.IfcPropertiesUtils.getEntityName(properties, setID)
                            console.log(setName)
                            if ( !setName || workingIDs.length === 0 || setName != 'Dimensions') { return}
                            
                            if (!(setName in resultRow)) {
                                resultRow[setName] = {}
                            }
                            // setName = dimensions
                            console.log(workingIDs[0])
                            OBC.IfcPropertiesUtils.getPsetProps(properties, workingIDs[0], (foundID) => {
                                console.log(`Property found with expressID: ${foundID}`);
                            })
                            

                            OBC.IfcPropertiesUtils.getQsetQuantities(
                                properties,
                                setID,
                                (qtoID) => {
                                    console.log(properties[qtoID])
                                    const { name: qtoName} = OBC.IfcPropertiesUtils.getEntityName(properties, qtoID)
                                    console.log(qtoName)
                                    const { value } = OBC.IfcPropertiesUtils.getQuantityValue(properties, qtoID)
                                    console.log(value)
                                    if(!qtoName || !value) {return}
                                    console.log(qtoName)
                                    if (!(qtoName in resultRow[setName])) {
                                        resultRow[setName][qtoName] = value
                                    
                                    }
                                    if ((qtoName in resultRow[setName])) {
                                        resultRow[setName][qtoName] = Math.min(resultRow[setName][qtoName], value) //find a lower value, as there are multiple netVolumes !!!!!!
                                    
                                    }
                                    //resultRow[setName][qtoName] = value


                                    console.log(resultRow)
                                }
                            )
                        
                        }
                        console.log(resultRow)
                    }
                    
                    
                    
                    // BASE QUANTITIES
                    if ( set.type !== WEBIFC.IFCELEMENTQUANTITY) { return }
                    const expressIDs = idMap

                    const workingIDs = expressIDs.filter(id => relatedIDs.includes(id));
                    //console.log(workingIDs)
                    

                    if (workingIDs.length > 0) {
                    console.log('Working IDs:', workingIDs);
                    } else {
                    console.log('No common IDs found between expressIDs and relatedIDs');
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
                            console.log(properties[qtoID])
                            const { name: qtoName} = OBC.IfcPropertiesUtils.getEntityName(properties, qtoID)
                            console.log(qtoName)
                            const { value } = OBC.IfcPropertiesUtils.getQuantityValue(properties, qtoID)
                            //console.log(value)
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
                    //console.log(nameValue)
                    //console.log(qtoResultByElementFamily)

                    if (!(nameValue in qtoResultByElementFamily)) {
                        qtoResultByElementFamily[nameValue] = {}; // Initialize if not exists
                    }
                    //console.log(qtoResultByElementFamily[nameValue])

                    if (!("CF values" in qtoResultByElementFamily[nameValue])) {
                        qtoResultByElementFamily[nameValue]["CF values"] = {
                            "Amount": 0, // Initialize with 0
                            "Element GWP / unit": 0,
                            "Carbon Footprint": 0
                        };
                    }
                    
                    if (!("CF values" in qtoResultByElementName[nameValue])) {
                        qtoResultByElementName[nameValue]["CF values"] = {
                            "Amount": 0, // Initialize with 0
                            "Element GWP / unit": 0,
                            "Carbon Footprint": 0
                        };
                    }

                    console.log(qtoResultByElementName[nameValue])
                    console.log(elementType)
                    console.log(resultRow)
                    console.log(resultRow["BaseQuantities"])
                    let area
                    if(elementType == "windows" || elementType == "doors") {
                        
                        console.log("Element width: ")
                        const width = resultRow["BaseQuantities"]["Width"] / 1000
                        console.log(width)
                        console.log("Element height: ")
                        const height = resultRow["BaseQuantities"]["Height"] / 1000
                        console.log(height)
                        


                        console.log("Element area: ")
                        area = height * width
                        console.log(area)
                        //qtoResultByElementName[nameWithID]["CF values"]["Area"] = area
                        //qtoResultByElementName[nameWithID]["CF values"]["Element GWP"] = 0
                        
                    }

                    else {

                    
                        console.log("Element thickness: ")
                        const thickness = resultRow["BaseQuantities"]["Width"] / 1000
                        console.log(thickness)
                        console.log("Element volume: ")
                        const volume = resultRow["BaseQuantities"]["NetVolume"]
                        console.log(volume)

                        console.log("Element area: ")
                        area = volume / thickness
                        console.log(area)
                        //qtoResultByElementName[nameWithID]["CF values"]["Area"] = area
                        //qtoResultByElementName[nameWithID]["CF values"]["Element GWP"] = 0
                        
                    }
                    qtoResultByElementName[nameValue]["CF values"]["Amount"] += area;
                    qtoResultByElementFamily[nameValue]["CF values"]["Amount"] += area;
                }
                
            )
            console.log(resultRow)
            
            
        }
        return qtoResultByElementFamily
        
    }
    

    getQuantities() {
                    
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
        const windows = OBC.IfcPropertiesUtils.getAllItemsOfType(
            properties,
            WEBIFC.IFCWINDOW
        )
        const curtainWalls = OBC.IfcPropertiesUtils.getAllItemsOfType(
            properties,
            WEBIFC.IFCCURTAINWALL
        )
        console.log(curtainWalls)

        const curtainPanels = OBC.IfcPropertiesUtils.getAllItemsOfType(
            properties,
            WEBIFC.IFCPLATE
        )
         
        const elements = typeList
                    
        //const elements = slabs
        console.log(elements)
                    
        const wallResults = this.calculateQuantities(properties, walls, "walls")
        console.log(wallResults)
        const slabResults = this.calculateQuantities(properties, slabs, "slabs")
        console.log(slabResults)
        const doorResults = this.calculateQuantities(properties, doors, "doors")
        console.log(doorResults)
        const windowResults = this.calculateQuantities(properties, windows, "windows")
        console.log(windowResults)
        const curtainWallsRes = this.calculateQuantities(properties, curtainPanels, "curtainPanels")
        console.log(curtainWallsRes)

        this._qtoResultByElementName = { ...wallResults, ...slabResults , ...windowResults, ...doorResults};
        
        console.log(this._qtoResultByElementName)
        this.resetWindow()
        this.updateUI()
    }
                    
                    
                    
               
                    
}
    

