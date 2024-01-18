import * as OBC from "openbim-components"
import * as THREE from "three"
import * as WEBIFC from "web-ifc"
import * as Firestore from "firebase/firestore"
import { addArrayList, parseFragmentIdMap, showModal, stringifyFragmentIdMap } from "../../utils/utils"
import  {FragmentsGroup} from "bim-fragment"

export class ExpressSelect extends OBC.Component<void> implements OBC.UI, OBC.Disposable {
    private _components: OBC.Components
    enabled: boolean = true
    expressModal: OBC.Modal
    expressIDInput: OBC.TextInput
    highlighter: OBC.FragmentHighlighter
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


        this.uiElement.set({activationBtn})
    }

    highlightByExpressID(expressID) {
        //OBC.IfcPropertiesUtils.getEntityName(properties, expressID)
        //this._components.
       // this.highlighter.highlightByID
       // this.highlighter.highlight()
    }


    get(): void {

    }

    async dispose() {

    }
}