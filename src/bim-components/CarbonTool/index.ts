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
            console.log(fragmentManager.groups[0])
            console.log(fragmentManager.groups[0].properties)
            for (const group in fragmentManager.groups) {
                console.log(group[0])
                
                for (const fragmentID in fragmentManager) {
                    console.log(fragmentID)
                    const fragment = fragmentManager.list[fragmentID]
                    
                    const model = fragment.mesh.parent
                    if (!(model instanceof FragmentsGroup && model.properties )) { continue }
                    const properties = model.properties
                    
                    console.log(properties)
            }
            
                
               
                
               
        }
    }




}