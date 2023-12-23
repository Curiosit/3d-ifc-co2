import { IProject, Project } from "./Project"
import { v4 as uuidv4 } from 'uuid'
export class ProjectsManager {
    list: Project [] = []

    ui: HTMLElement

    constructor(container: HTMLElement) {
        this.ui = container
    }

    newProject(data:IProject) {
        const project = new Project(data)
        this.ui.append(project.ui)
        this.list.push(project)
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