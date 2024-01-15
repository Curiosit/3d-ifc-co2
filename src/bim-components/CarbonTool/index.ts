import * as OBC from "openbim-components"
import * as THREE from "three"
import * as WEBIFC from "web-ifc"
import { addDocument, deleteDocument, getCollection } from "../../firebase"
import { Project } from "../../classes/Project"
import * as Firestore from "firebase/firestore"
import { parseFragmentIdMap, stringifyFragmentIdMap } from "../../utils/utils"
import { BuildingCarbonFootprint, Status } from "../../types/types"
import  {FragmentsGroup} from "bim-fragment"
import { ElementCard } from "./src/ElementCard"

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
        //console.log(this._qtoList)
        this._qtoList = []
        
        for (const setName in this._qtoResult) {
            
            if (this._qtoResult.hasOwnProperty(setName)) {
                const qtyCard = new ElementCard(this.components)
                console.log(`Set Name: ${setName}`);
                qtyCard.setName = setName
                // Iterate over qto names and values within each set
                const qtoValues = this._qtoResult[setName];
                //console.log(qtoValues)
                
                
                for (const qtoName in qtoValues) {
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
                qtoList.addChild(qtyCard)
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
            qtyCard.qtyValueList = []
            qtyCard.dispose()
            qtyCard.removeFromParent()
            
        }
        qtoList.cleanData()
        /* while (qtoList.children[0]) {
            qtoList.removeChild(qtoList.children[0]);
        } */
    }




    

    async getQuantities() {
            console.log("_______________________________________")
            const fragmentManager = await this._components.tools.get(OBC.FragmentManager)
            console.log(fragmentManager)
            console.log(fragmentManager.groups)
            
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
                    const properties = model.properties
                    
                    console.log(properties)
            
                    
                    const fragmentIdMap = fragmentMap[fragmentUUID]
                    /* console.log(fragmentIdMap)
                    const walls = OBC.IfcPropertiesUtils.getAllItemsOfType(
                        properties,
                        WEBIFC.IFCWALLTYPE
                        ) */

                    
                    const slabs = OBC.IfcPropertiesUtils.getAllItemsOfType(
                        properties,
                        WEBIFC.IFCSLAB
                        )
                    
                    //console.log(walls)
                    console.log(slabs)
                    //WEBIFC.IFCELEMENTQUANTITY
                    console.log(slabs[0].HasPropertySets)
                    let idMap = new Array()
                    for (const slabID in slabs) {
                        
                        console.log("???????????????????????????????????????????????????")
                        
                        console.log(properties[slabs[slabID].expressID].Name) // RETURNS name object!
                        const name = properties[slabs[slabID].expressID].Name.value
                        console.log("???????????????????????????????????????????????????")
                        idMap.push(slabs[slabID].expressID)
                        /* for (const psetID in properties[slabs[slabID].expressID].HasPropertySets) {
                            console.log(psetID)
                            console.log(properties[psetID])
                            const id = properties[slabs[slabID].expressID].HasPropertySets[psetID]
                            console.log(id)
                            const props = OBC.IfcPropertiesUtils.getEntityName(properties, id.value)
                            console.log(props)
                            const set = properties[id.value]
                        } */
                        
                        if (!(name in this._qtoResultByElementName)) {
                            this._qtoResultByElementName[name] = {}
                        }
                        const resultRow = this._qtoResultByElementName[name]
                        console.log(idMap) // List of express ids of either IFC SLAB or IFC SLAB TYPE

                    console.log("________________________________________________________________________")
                    console.log("________________________________________________________________________")
                    console.log("________________________________________________________________________")
                        console.log("SUMMING UP SLABS:")
                        OBC.IfcPropertiesUtils.getRelationMap(
                            properties, 
                            WEBIFC.IFCRELDEFINESBYPROPERTIES,
                            (setID, relatedIDs) => {
                                const set = properties[setID]
                                if ( set.type !== WEBIFC.IFCELEMENTQUANTITY) { return}
                                //console.log(set)
                                //console.log(idMap)
                                const expressIDs = idMap
                                //console.log(expressIDs)
                                //console.log(relatedIDs)
                                //const workingIDs = relatedIDs.filter(id => expressIDs.includes(id.toString())) //// <= NOT WORKING

                                const workingIDs = expressIDs.filter(id => relatedIDs.includes(id));

                                if (workingIDs.length > 0) {
                                console.log('Working IDs:', workingIDs);
                                } else {
                                //console.log('No common IDs found between expressIDs and relatedIDs');
                                }

                                const { name: setName} = OBC.IfcPropertiesUtils.getEntityName(properties, setID)
                                //console.log(setName)
                                //console.log(workingIDs)
                                if ( !setName || workingIDs.length === 0  || set.type !== WEBIFC.IFCELEMENTQUANTITY) { return}
                                
                                if (!(setName in resultRow)) {
                                    resultRow[setName] = {}
                                }
                                //console.log("SetID")
                                //console.log(setID)
                                
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
                        console.log("________________________________________________________________________")
                        console.log("########################################################################")
                    }
                    
                    }





                        }
                        
                        


                        console.log(this._qtoResultByElementName)
                        this.resetWindow()
                        this.updateUI()
                        }
                    
                    
                    
               
                    
                }
    

