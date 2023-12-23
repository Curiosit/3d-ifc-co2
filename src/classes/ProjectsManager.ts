import { IProject, Project } from "./Project"
import { v4 as uuidv4 } from 'uuid'
export class ProjectsManager {
    list: Project [] = []
    id: string
    ui: HTMLElement

    constructor(container: HTMLElement) {
        this.ui = container
        this.id = uuidv4()
        console.log(`Project Manager is running, with id: ${this.id}`)
    }

    newProject(data:IProject) {
        const projectNames = this.list.map((project) => {
            return project.name
        })
        const nameInUse = projectNames.includes(data.name)
        if (nameInUse) {
            throw new Error(`A project with the name "${data.name}" already exists`)
        }
        const project = new Project(data)
        console.log(this.ui)
        this.ui.append(project.ui)
        this.list.push(project)
        console.log(this.list)
        return project
    }

    getProject(id: string) {
        const project = this.list.find((project) => {
            return project.id === id
        })
        return project
        
    }

    deleteProject(id: string) {
        const project = this.getProject(id)
        if (!project) { return }
        project.ui.remove()
        const remaining = this.list.filter((project) => {
            return project.id !== id
        })
        this.list = remaining
        
    }

    exportToJSON() {

    }

    importFromJSON() {

    }


}