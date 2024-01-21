import * as OBC from "openbim-components"
import * as WEBIFC from "web-ifc"
import  {FragmentsGroup} from "bim-fragment"
import { QtyCard, qtyValue } from "./src/QtyCard"

type QtoResult = {
    [setName: string]: {[qtoName: string]: number}

}


/* const sum = {
    Qto_WallBaseQuantities: {
        volume:
    }

} */


export class SimpleQto extends OBC.Component<QtoResult> implements OBC.UI, OBC.Disposable  {
    static uuid = "c9ffb4b0-c077-4244-90a6-c4eec04a6a6f"
    enabled: boolean = true
    private _components: OBC.Components
    private _qtoResult: QtoResult
    private _qtoList: { [key: string]: any }[] = [];
    uiElement = new OBC.UIElement<{
        activationBtn: OBC.Button
        qtoList: OBC.FloatingWindow
    }>()
    private _model: FragmentsGroup
    constructor(components: OBC.Components) {

        super(components)
        this._components = components
        this.setUI()
        this.setup()
    }
    async setup() {
        const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
        highlighter.events.select.onClear.add(async () => {
            this.resetQuantities()
            this.resetWindow()
            console.log("reseting window")
            
            
            
        })
        highlighter.events.select.onHighlight.add((fragmentIdMap) => {
            
            console.log("calculating")
            this.sumQuantities(fragmentIdMap)
        })
        
        
        //const fragmentManager = await this._components.tools.get(OBC.FragmentManager)
        this._qtoResult = {}
        
        
    }
    resetWindow() {
        
        const qtoList = this.uiElement.get("qtoList")
        //console.log(qtoList)
        //console.log(qtoList.children[0].children)
        for (const childID in qtoList.children[0].children) {
            
            const qtyCard = qtoList.children[0].children[childID] as QtyCard
            
            
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

    private setUI() {
        const activationBtn = new OBC.Button(this._components)
        activationBtn.materialIcon = "functions"
        activationBtn.tooltip = "Quantity Takeoff"

        const qtoList = new OBC.FloatingWindow(this._components)
        qtoList.title = "Quantity Takeoff"
        this._components.ui.add(qtoList)
        qtoList.visible = false
        activationBtn.onClick.add(() => {
            activationBtn.active = !activationBtn.active
            qtoList.visible = activationBtn.active
        })

        this.uiElement.set({activationBtn, qtoList})
    }

    async dispose() {
        this.resetQuantities()
        this.uiElement.dispose()
        
    }

    get(): QtoResult {
        return this._qtoResult
    }

    
    resetQuantities() {
        this._qtoResult = {}
    }
    


    updateUI () {
        const qtoList = this.uiElement.get("qtoList")
        //console.log(this._qtoList)
        this._qtoList = []
        
        for (const setName in this._qtoResult) {
            
            if (this._qtoResult.hasOwnProperty(setName)) {
                const qtyCard = new QtyCard(this.components)
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

    async sumQuantities(fragmentIdMap: OBC.FragmentIdMap) {
        
        const fragmentManager = await this._components.tools.get(OBC.FragmentManager)
        for (const fragmentID in fragmentIdMap) {
            console.log(fragmentID)
            const fragment = fragmentManager.list[fragmentID]
            /* console.log(fragment) */
            const model = fragment.mesh.parent
            if (!(model instanceof FragmentsGroup && model.properties )) { continue }
            const properties = model.properties
            
            //console.log(properties)
            
           
            
            OBC.IfcPropertiesUtils.getRelationMap(
                properties, 
                WEBIFC.IFCRELDEFINESBYPROPERTIES,
                (setID, relatedIDs) => {
                    const set = properties[setID]
                    /* console.log(setID)
                    console.log(set) */
                    const expressIDs = fragmentIdMap[fragmentID]
                    /* console.log(fragmentIdMap)
                    console.log(expressIDs)
                    console.log(relatedIDs) */
                    
                    const workingIDs = relatedIDs.filter(id => expressIDs.has(id.toString()))
                   
                    const { name: setName} = OBC.IfcPropertiesUtils.getEntityName(properties, setID)
                    
                    /* console.log(setName)
                    console.log(workingIDs.length)
                    console.log(set.type) */
                    if ( !setName || workingIDs.length === 0  || set.type !== WEBIFC.IFCELEMENTQUANTITY) { return}
                    //console.log("?@?@?@?@@?@?@?@?@@?@?@@@?")
                    //console.log("FOUND!")
                    //console.log(workingIDs)
                    if (!(setName in this._qtoResult)) {
                        this._qtoResult[setName] = {}
                    }
                    //console.log("SetID")
                    //console.log(setID)
                    
                    OBC.IfcPropertiesUtils.getQsetQuantities(
                        properties,
                        setID,
                        (qtoID) => {
                            //console.log(properties[qtoID])
                            const { name: qtoName} = OBC.IfcPropertiesUtils.getEntityName(properties, qtoID)
                            const { value } = OBC.IfcPropertiesUtils.getQuantityValue(properties, qtoID)
                           
                            if(!qtoName || !value) {return}
                            //console.log(qtoName)
                            if (!(qtoName in this._qtoResult[setName])) {
                                this._qtoResult[setName][qtoName] = 0
                            
                            }
                            this._qtoResult[setName][qtoName] += value
                        }
                    )
                    
                }
                
            )
        }
        console.log(this._qtoResult)
        this.resetWindow()
        this.updateUI()
    }

}
