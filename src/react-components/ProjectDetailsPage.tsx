import * as React from "react"
import * as Router from "react-router-dom"
import { ProjectsManager } from "../classes/ProjectsManager"
import { formatDate, setupModal, showModal } from "../utils/utils"
import { renderProgress } from "../utils/utils"
import { IFCViewer } from "./IFCViewer"
import { deleteDocument } from "../firebase"
import { Modal } from "./Modal"
import { Project } from "../classes/Project"



  
interface Props {
    projectsManager: ProjectsManager
}

export function ProjectDetailsPage(props: Props) {
    
    const [hiddenProjectDetails, setHiddenProjectDetails] = React.useState(true);
    const [updateViewerDimensions, setUpdateViewerDimensions]  = React.useState(true);

    const routeParams = Router.useParams<{id: string}>()
    if (!routeParams.id) { return  }
    const project = props.projectsManager.getProject(routeParams.id)
    //console.log(routeParams.id)
    //console.log(project)
    if (!project) { return  }

    const navigateTo = Router.useNavigate()
    props.projectsManager.onProjectDeleted = async (id) => {
        //console.log("deleting...")
        await deleteDocument("projects", id)
        navigateTo("/3d-ifc-co2/")
        }
    
        const onDeleteClick = () => {
            setupModal("Delete project", `Do you want to delete <b>${project.name}</b> ?`,() => {props.projectsManager.deleteProject(project.id)})
            
            
            
            
            
            
    };

    const onEditProjectClick = () => {
        props.projectsManager.setupEditProjectModal(project)
        showModal("edit-project-modal")
    }
    
    
    
    React.useEffect(() => {

        console.log("Dispatching event: ", hiddenProjectDetails)
        setUpdateViewerDimensions(!updateViewerDimensions)
        return () => {
            
            
        }
      }, [hiddenProjectDetails])


    
    return(
        
            <div className="page" id="project-details" >
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
                            defaultValue={`${project.progress*100}%`}
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
                
                
                <header>
                    <div></div>
                </header>
                <div className={ hiddenProjectDetails ? "main-page-content-hide": "main-page-content-show"}>
                { hiddenProjectDetails ? 
                    
                    
                    <div className="" style={{ position:"absolute", padding: "30px 0", }}>
                    <div
                    style={{
                        position:"absolute",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0px 30px",
                        marginTop: 20
                    }}>
                       
                                <p data-project-info="initials" className="initials rotate" style={{ position:"absolute", background: project.inColor, cursor: "pointer", zIndex: 99 }} onClick = {() => {setHiddenProjectDetails(!hiddenProjectDetails); console.log(hiddenProjectDetails)}}>
                                    { project.initials }
                                </p>
                                
                                </div>
                                </div>
                                
                                
                                
                
                    : 
                    <div style={{ display: "flex", flexDirection: "column", rowGap: 30 }}>
                    
                        
                        <div className="dashboard-card" style={{ padding: "30px 0" }}>
                            <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "0px 30px",
                                marginBottom: 30
                            }}
                            >
                            <p data-project-info="initials" className="initials rotate" style={{ background: project.inColor, cursor: "pointer" }} onClick = {() => {setHiddenProjectDetails(!hiddenProjectDetails); console.log(hiddenProjectDetails)}}>
                                    { project.initials }
                                </p>
                            <button id="edit-project-details-btn" className="btn-secondary" onClick={onEditProjectClick}>
                                <p style={{ width: "100%" }}>Edit</p>
                            </button>
                            <button className="btn-red" onClick={onDeleteClick}>Delete</button>
                            </div>
                            <div style={{ padding: "0 30px" }}>
                            <div>
                                <h2 data-project-info="name">{ project.name }</h2>
                                <p style={{ color: "#969696" }} data-project-info="description">
                                { project.description }
                                </p>
                            </div>
                            
                            <div
                                style={{
                                display: "flex",
                                columnGap: 30,
                                padding: "30px 0px",
                                justifyContent: "space-between"
                                }}
                            >
                                <div>
                                <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                                    Status
                                </p>
                                <p data-project-info="status">{ project.status }</p>
                                </div>
                                <div>
                                <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                                    Cost
                                </p>
                                <p data-project-info="cost">$ { project.cost }</p>
                                </div>
                                <div>
                                <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                                    Role
                                </p>
                                <p data-project-info="userRole">{ project.userRole }</p>
                                </div>
                                
                            </div>
                            <div
                                style={{
                                display: "flex",
                                columnGap: 30,
                                padding: "30px 0px",
                                justifyContent: "space-between"
                                }}
                            >
                                <div>
                                <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                                    Created
                                </p>
                                <p data-project-info="createdDate">{ formatDate(project.createdDate)  }</p>
                                </div>
                                <div>
                                <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                                    Finish
                                </p>
                                <p data-project-info="finishDate">{ formatDate(project.finishDate)  }</p>
                                </div>
                            </div>
                            <div
                                style={{
                                backgroundColor: "#202124",
                                borderRadius: 9999,
                                overflow: "auto"
                                }}
                            >

                            <div
                                style={{
                                width:  `${  renderProgress(project.progress) }`,
                                backgroundColor: "#404040",
                                
                                textAlign: "center"
                                }}
                            >
                                <div data-project-info="progress" className="progress-bar">
                                { project.progress*100 }%
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="dashboard-card" style={{ flexGrow: 1 }}>
                            <div
                            style={{
                                padding: "20px 30px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                            >
                            <h4>Results</h4>
                            <div
                                style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "end",
                                columnGap: 20
                                }}
                            >
                                <div
                                style={{ display: "flex", alignItems: "center", columnGap: 10 }}
                                >
                                
                                </div>
                                <button id="add-to-do-btn" className="btn-secondary">
                                <p style={{ width: "100%" }}>Add</p>
                                </button>
                            </div>
                            </div>
                            <div
                            id="to-do-list"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                padding: "10px 30px",
                                rowGap: 20
                            }}
                            ></div>
                        </div>
                    </div>
                    }
                    <IFCViewer project={project } updateDimensions = {updateViewerDimensions} />
                </div>
            </div>
        

    )
}