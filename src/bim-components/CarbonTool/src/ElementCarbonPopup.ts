import * as OBC from "openbim-components"
import { ElementQtyCard } from "./ElementQtyCard"
import { ElementSetNameCard } from "./ElementSetNameCard"


export class ElementCarbonPupup extends OBC.SimpleUIComponent {
    onDelete = new OBC.Event()
    onPopupClick = new OBC.Event()
    
    

    set elementCarbonFootprint(value: string) {
        const elementNameHTML = this.getInnerElement("ElementCarbonFootprint") as HTMLParagraphElement
        elementNameHTML.textContent = value
    }
    

    

    constructor(components: OBC.Components) {
        
        const template = `
        
            
            <dialog id="delete-project-modal">
            <h2>Delete Project</h2>
                <p>Are you sure you want to delete project: <b>{project.name}</b>?</p>
            </dialog>
            <dialog id="edit-project-modal">
                <form id="edit-project-form">
                <h2>Edit Project</h2>
                <div className="input-list">
                    <div className="form-field-container">
                    <label>
                        <span className="material-symbols-rounded">apartment</span>Name
                    </label>
                    <input
                        data-edit-project-info="name"
                        name="name"
                        type="text"
                        placeholder="What's the name of your project?"
                        defaultValue={project.name}
                    />
                    </div>
                    <div className="form-field-container">
                    <label>
                        <span className="material-symbols-rounded">subject</span>Description
                    </label>
                    <textarea
                        data-edit-project-info="description"
                        cols={30}
                        rows={3}
                        name="description"
                        placeholder="Give your project a nice description! So people are jealous about it."
                        defaultValue={project.description}
                    />
                </div>
                    <div className="form-field-container">
                    <label>
                        <span className="material-symbols-rounded">person</span>Role
                    </label>
                    <select data-edit-project-info="userRole" name="userRole" defaultValue={project.userRole}>
                        <option>Architect</option>
                        <option>Engineer</option>
                        <option>Developer</option>
                    </select>
                    </div>
                    <div className="form-field-container">
                    <label>
                        <span className="material-symbols-rounded">
                        not_listed_location
                        </span>
                        Status
                    </label>
                    <select data-edit-project-info="status" name="status" defaultValue={project.status}>
                        <option>pending</option>
                        <option>active</option>
                        <option>finished</option>
                    </select>
                    </div>
                    <div className="form-field-container">
                    <label>
                        <span className="material-symbols-rounded">monetization_on</span>
                        Cost
                    </label>
                    <input
                        data-edit-project-info="cost"
                        name="cost"
                        type="text"
                        placeholder="Cost of your project..."
                        defaultValue={project.cost}
                    />
                    </div>
                    <div className="form-field-container">
                    <label>
                        <span className="material-symbols-rounded">clock_loader_40</span>
                        Progress
                    </label>
                    <input
                        data-edit-project-info="progress"
                        name="progress"
                        type="text"
                        placeholder="Progress in %"
                        defaultValue={}
                    />
                    </div>
                    <div className="form-field-container">
                    <label htmlFor="finishDate">
                        <span className="material-symbols-rounded">calendar_month</span>
                        Created Date
                    </label>
                    <input
                        data-edit-project-info="createdDate"
                        id="edit-created-date"
                        type="date"
                        name="createdDate"
                    />
                    </div>
                    <div className="form-field-container">
                    <label htmlFor="finishDate">
                        <span className="material-symbols-rounded">calendar_month</span>
                        Finish Date
                    </label>
                    <input
                        data-edit-project-info="finishDate"
                        id="edit-finish-date"
                        type="date"
                        name="finishDate"
                    />
                    </div>
                    <div
                    style={{
                        display: "flex",
                        margin: "10px 0px 10px auto",
                        columnGap: 10
                    }}
                    >
                    <button
                        id="close-edit-project-modal-btn"
                        type="button"
                        style={{ backgroundColor: "transparent" }}
                        className="btn-secondary" >
                        Cancel
                    </button>
                    <button onClick={(e) => { e.preventDefault(); props.projectsManager.onEditProject(routeParams.id as string)}} className="positive">
                        Accept
                    </button>
                    </div>
                </div>
                </form>
            </dialog>
      
        `
        
        super(components, template)
        
        
        

        
        const cardElement = this.get()
        cardElement.addEventListener("click", () => {
            this.onPopupClick.trigger()
        })
        this.setSlot("actionButtons", new OBC.SimpleUIComponent(this._components))
        

        
    }
    async dispose () {
        
        /* while (this._qtyElement.firstChild) {
            console.log("child:")
            console.log(this._qtyElement.firstChild)
            this._qtyElement.removeChild(this._qtyElement.firstChild)
        } */
        
        //this.dispose()
    }

}