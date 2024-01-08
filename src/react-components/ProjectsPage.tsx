import * as React from "react"
import { Project, IProject } from "../classes/Project";
import { Status, UserRole } from "../types/types";
import { v4 as uuidv4 } from 'uuid'
import { ProjectsManager } from "../classes/projectsManager";
import { ProjectCard } from "./ProjectCard";

import * as Router from "react-router-dom"
import { SearchBox } from "./Searchbox";

interface Props {
    projectsManager: ProjectsManager
}

export function ProjectsPage(props: Props) {

    
    const [projects, setProjects] = React.useState<Project[]>(props.projectsManager.list)
    props.projectsManager.onProjectCreated = (project) => {setProjects([...props.projectsManager.list])}
    props.projectsManager.onProjectDeleted = (project) => {setProjects([...props.projectsManager.list])}
    
    const projectCards = projects.map((project) => {
        return  <Router.Link to={`/project/${project.id}`} key={project.id}>
                    <ProjectCard project={project} />
                </Router.Link>
        
    })
    
    React.useEffect(() => {
        console.log(projects)
     }, [projects])

    const onNewProjectClick = () => {
        const modal = document.getElementById("new-project-modal");
        if (modal && modal instanceof HTMLDialogElement) {
          modal.showModal();
        } 
        else {
          console.warn("The provided modal wasn't found. ");
        }
    }

    const onExportClick = () => {
        props.projectsManager.exportToJSON()
    }

    const onImportClick = () => {
        props.projectsManager.importFromJSON()
    }

    const onFormSubmit = (e: React.FormEvent) => {
        const projectForm = document.getElementById("new-project-form")
        if (!(projectForm && projectForm instanceof HTMLFormElement)) {return}
        e.preventDefault()
        const formData = new FormData(projectForm)
        const finishDateInput = formData.get("finishDate") as string;

        let finishDate;
        if (finishDateInput) {
        finishDate = new Date(finishDateInput);
        } else {
        const today = new Date();
        const nextYear = new Date(today.setFullYear(today.getFullYear() + 1));
        finishDate = nextYear;
        }

        const projectData: IProject = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        status: formData.get("status") as Status,
        userRole: formData.get("userRole") as UserRole,
        finishDate: finishDate,
        createdDate: new Date(),
        cost: 0,
        progress: 0,
        toDoList: [],
        id: uuidv4()

        };
        try {
            
            const project = props.projectsManager.newProject(projectData)
            
            projectForm.reset()
            const modal = document.getElementById("new-project-modal");
            if (modal && modal instanceof HTMLDialogElement) {
            modal.close();
            } 
            else {
            console.warn("The provided modal wasn't found. ");
            }
        }
        catch (err) {
            alert(err)
        }

    }

    const onProjectSearch = (value: string) => {
        setProjects(props.projectsManager.filterProjects(value))
    }

    return (
        <div className="page" id="projects-page">
            <dialog id="new-project-modal">
                <form onSubmit={(e) => onFormSubmit(e)} id="new-project-form">
                <h2>New Project</h2>
                <div className="input-list">
                    <div className="form-field-container">
                    <label>
                        <span className="material-symbols-rounded">apartment</span>Name
                    </label>
                    <input
                        name="name"
                        type="text"
                        placeholder="What's the name of your project?"
                    />
                    <p
                        style={{
                        color: "gray",
                        fontSize: "var(--font-sm)",
                        marginTop: 5,
                        fontStyle: "italic"
                        }}
                    >
                        TIP: Give it a short name
                    </p>
                    </div>
                    <div className="form-field-container">
                    <label>
                        <span className="material-symbols-rounded">subject</span>Description
                    </label>
                    <textarea
                        cols={30}
                        rows={3}
                        name="description"
                        placeholder="Give your project a nice description! So people are jealous about it."
                        defaultValue={""}
                    />
                    </div>
                    <div className="form-field-container">
                    <label>
                        <span className="material-symbols-rounded">person</span>Role
                    </label>
                    <select name="userRole">
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
                    <select name="status">
                        <option>pending</option>
                        <option>active</option>
                        <option>finished</option>
                    </select>
                    </div>
                    <div className="form-field-container">
                    <label htmlFor="createdDate">
                        <span className="material-symbols-rounded">calendar_month</span>
                        Created Date
                    </label>
                    <input id="createdDate" type="date" name="createdDate" />
                    </div>
                    <div className="form-field-container">
                    <label htmlFor="finishDate">
                        <span className="material-symbols-rounded">calendar_month</span>
                        Finish Date
                    </label>
                    <input id="finishDate" type="date" name="finishDate" />
                    </div>
                    <div
                    style={{
                        display: "flex",
                        margin: "10px 0px 10px auto",
                        columnGap: 10
                    }}
                    >
                    <button
                        id="close-new-project-modal-btn"
                        type="button"
                        style={{ backgroundColor: "transparent" }}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="positive">
                        Accept
                    </button>
                    </div>
                </div>
                </form>
            </dialog>
            <header>
                <h2>
                <span className="material-symbols-rounded">folder_copy</span> Projects
                </h2>
                <SearchBox  onChange={(value) => onProjectSearch(value)}/>
                <div style={{ display: "flex", alignItems: "center", columnGap: 15 }}>
                <span onClick={onImportClick}
                    id="import-projects-btn"
                    className="material-symbols-rounded action-icon"
                >
                    file_upload
                </span>
                <span onClick={onExportClick}
                    id="export-projects-btn"
                    className="material-symbols-rounded action-icon"
                >
                    file_download
                </span>
                <button onClick={onNewProjectClick} id="new-project-btn">
                    <span className="material-symbols-rounded">note_add</span> New project
                </button>
                </div>
            </header>
            {
                projects.length > 0 ? 
                <div id="projects-list">
                    { projectCards }
                </div>
                :
                <p style={{padding:"15px", textAlign: "center"}}>No projects found!</p>
            }
            
        </div>

    ) 
}