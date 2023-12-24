import { IProject, Project } from "./Project"
import { v4 as uuidv4 } from 'uuid'
import { formatDate, isFirstCharacterLetterOrNumber } from "../utils/utils"
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

        if (data.name.length < 5) {
            throw new Error(`Name "${data.name}" has to be 5 characters or longer!`)
        }

        if (isFirstCharacterLetterOrNumber(data.name)) {
            throw new Error(`Name "${data.name}" has to start with a letter or number!`)
        }
        const project = new Project(data)
        project.ui.addEventListener("click", () => {
            const projectsPage = document.getElementById("projects-page")
            const detailsPage = document.getElementById("project-details")
            if (!projectsPage || !detailsPage) {return}
            projectsPage.style.display = "none"
            detailsPage.style.display = "flex"
            this.setDetailsPage(project)
        })
        this.ui.append(project.ui)
        this.list.push(project)
        
        return project
    }

    private setDetailsPage(project: Project) {
        const detailsPage = document.getElementById("project-details")
        if (!detailsPage) {return}
        const name = detailsPage.querySelector("[data-project-info='name']")
        if (name) { name.textContent = project.name }
        const description = detailsPage.querySelector("[data-project-info='description']")
        if (description) { description.textContent = project.description }

        const status = detailsPage.querySelector("[data-project-info='status']")
        if (status) { status.textContent = project.status }

        const userRole = detailsPage.querySelector("[data-project-info='userRole']")
        if (userRole) { userRole.textContent = project.userRole }

        const finishDate = detailsPage.querySelector("[data-project-info='finishDate']")
        if (finishDate) { finishDate.textContent = formatDate(project.finishDate)}

        const cost = detailsPage.querySelector("[data-project-info='cost']")
        if (cost) { cost.textContent = '$ ' + project.cost }
        
        
        
        
        
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

    exportToJSON(fileName: string = "projects") {
        const json = JSON.stringify(this.list, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        URL.revokeObjectURL(url)
      }
      
      importFromJSON() {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'application/json'
        const reader = new FileReader()
        reader.addEventListener("load", () => {
          const json = reader.result
          if (!json) { return }
          const projects: IProject[] = JSON.parse(json as string)
          for (const project of projects ) {
            try {
              const projectSetup = this.newProject(project)
              console.log(projectSetup)
            } catch (error) {
              console.log(error)
            }
          }
        })
        input.addEventListener('change', () => {
          const filesList = input.files
          if (!filesList) { return }
          reader.readAsText(filesList[0])
        })
        input.click()
      }

    

}