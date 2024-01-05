import * as OBC from "openbim-components"

export class SimpleQto extends OBC.Component<null> implements OBC.UI, OBC.Disposable  {
    static uuid = "c9ffb4b0-c077-4244-90a6-c4eec04a6a6f"
    enabled: boolean = true
    private _components: OBC.Components
    uiElement = new OBC.UIElement<{
        activationBtn: OBC.Button
        qtoList: OBC.FloatingWindow
    }>()

    constructor(components: OBC.Components) {

        super(components)
        this._components = components
    }

    async dispose() {
        
    }

    get(): null {
        return null
     }

}
