import * as OBC from "openbim-components"
import * as THREE from "three"
import * as WEBIFC from "web-ifc"
import { addDocument, deleteDocument, getCollection } from "../../firebase"
import { Project } from "../../classes/Project"
import * as Firestore from "firebase/firestore"
import { parseFragmentIdMap, stringifyFragmentIdMap } from "../../utils/utils"
import { BuildingCarbonFootprint, Status } from "../../types/types"
import  {FragmentsGroup} from "bim-fragment"

//const todosCollection = getCollection<ToDoData>("/todos")
type QtoResult = {
    [setName: string]: {[qtoName: string]: number}

}

export class CarbonTool extends OBC.Component<BuildingCarbonFootprint> implements OBC.UI, OBC.Disposable {

    carbonFootprint: BuildingCarbonFootprint
    static uuid = "932ed24b-87de-46a2-869f-8fda0d684c15"

    private _qtoResult: QtoResult
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
                    
                    OBC.IfcPropertiesUtils.getRelationMap(
                        properties, 
                        WEBIFC.IFCRELDEFINESBYPROPERTIES,
                        (setID, relatedIDs) => {
                            const set = properties[setID]
                            console.log(set)
                            const { name: setName} = OBC.IfcPropertiesUtils.getEntityName(properties, setID)
                            if ( !setName || set.type !== WEBIFC.IFCELEMENTQUANTITY) { return}

                            console.log(setName)
                            console.log(this._qtoResult)
                            if (!(setName in this._qtoResult)) {
                                this._qtoResult[setName] = {}
                            }
                            OBC.IfcPropertiesUtils.getQsetQuantities(
                                properties,
                                setID,
                                (qtoID) => {
                                    //console.log(properties[qtoID])
                                    const { name: qtoName} = OBC.IfcPropertiesUtils.getEntityName(properties, qtoID)
                                    const { value } = OBC.IfcPropertiesUtils.getQuantityValue(properties, qtoID)
                                
                                    if(!qtoName || !value ) {return}
                                    console.log(qtoName)
                                    console.log(value)
                                    if (!(qtoName in this._qtoResult[setName])) {
                                        this._qtoResult[setName][qtoName] = 0
                                    
                                    }
                                    this._qtoResult[setName][qtoName] += value 
                                }
                            )
                            
                        }
                        
                    )
                    console.log(this._qtoResult)
               
                }
            }

        }
}