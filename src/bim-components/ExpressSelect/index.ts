import * as OBC from "openbim-components"
import * as THREE from "three"
import * as WEBIFC from "web-ifc"
import * as Firestore from "firebase/firestore"
import { addArrayList, parseFragmentIdMap, showModal, stringifyFragmentIdMap } from "../../utils/utils"
import  {FragmentsGroup} from "bim-fragment"

export class ExpressSelect extends OBC.Component<void> implements OBC.UI, OBC.Disposable {
    static uuid = "47ba1e1f-6e6d-4924-abb0-7dcd3ec4f962"
    private _components: OBC.Components
    enabled: boolean = true
    expressModal: OBC.Modal
    expressIDInput: OBC.TextInput
    highlighter: OBC.FragmentHighlighter
    model
    uiElement = new OBC.UIElement<
    {
        activationBtn: OBC.Button
    }>()

    constructor (components: OBC.Components, highlighter) {
        super(components)
        this._components = components
        this.highlighter = highlighter
        this.setUI()
    }

    private setUI() {
        const activationBtn = new OBC.Button(this._components)
        activationBtn.materialIcon = "pan_tool_alt"
        activationBtn.tooltip = "Express Select"

        activationBtn.onClick.add(() => {
            
            console.log("Pointing!")
            this.expressModal.visible = true
        })
        this.expressModal = new OBC.Modal(this._components)
        this._components.ui.add(this.expressModal)
        this.expressModal.title = "Input Express ID"

        const expressIDInput = new OBC.TextInput(this._components)
        expressIDInput.label = "Express ID:"
        this.expressIDInput = expressIDInput
        this.expressModal.slots.content.addChild(expressIDInput)


        this.expressModal.slots.content.get().style.padding = "20px"
        this.expressModal.slots.content.get().style.display = "flex"
        this.expressModal.slots.content.get().style.flexDirection = "column"
        this.expressModal.slots.content.get().style.rowGap = "20px"
        this.expressModal.onCancel.add(() => {
            this.expressModal.visible = false
        })
        this.expressModal.onAccept.add(() => {
            this.expressModal.visible = false
            console.log(this.expressIDInput.value)
            this.highlightByExpressID(this.expressIDInput.value)
        })

        this.highlighter.events.select.onHighlight.add((e) => {
            console.log(e)
            
  
            console.log("Express ID")
            
              
            for(const id in e) {
              console.log(id)
              console.log(e[id])
              var elementsArray = Array.from(e[id]);
              var element = elementsArray[0];
              console.log(element) //EXPRESS ID
              /* for(const i in e[id]) {
                console.log(e[id][i])
              } */
            }
            
        })
        this.highlighter.events.select.onHighlight.add((fragmentIdMap) => {
            
            console.log(fragmentIdMap)
            
        })


        this.uiElement.set({activationBtn})
    }

    
    addModel(model) {
        this.model = model
    }

    async highlightByExpressID(expressID) {
        console.log(this.model)
        const fragments = this.model.keyFragments
        const properties = this.model.properties
        const fragmentManager = await this._components.tools.get(OBC.FragmentManager)

        console.log(fragmentManager.list)
        for (const fragmentID in fragments) {

            const fragment = fragmentManager.list[fragments[fragmentID]]

            const model = fragment.mesh.parent
            if (!(model instanceof FragmentsGroup && model.properties )) { continue }
            if(fragment.items.includes(expressID)) {
                console.log("FOUND!")
                console.log(fragment.id)
                const fragmentIdMap = this.createFragmentIdMap(fragment, expressID) as OBC.FragmentIdMap
                console.log(fragmentIdMap)
                this.highlighter.highlightByID("select", fragmentIdMap)
            }

        }

    }
    createFragmentIdMap(fragment, expressID) {
        const id = fragment.id
        const mySet = new Set([expressID]);


        const myObject = {
        [id]: mySet
        };
        return myObject
        
    }

    get(): void {

    }

    async dispose() {

    }
}