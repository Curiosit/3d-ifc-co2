import * as OBC from "openbim-components"

export class SimpleQto extends OBC.Component<null> implements OBC.UI, OBC.Disposable  {
    enabled: boolean;

    get(...args: any): null {
        throw new Error("Method not implemented.");
    }
    dispose: () => Promise<void>;
    
    uiElement: OBC.UIElement<any>;

    

}
