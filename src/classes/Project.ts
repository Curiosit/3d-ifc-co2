import { v4 as uuidv4 } from 'uuid'
import { getRandomColorFromList, uppercaseInitials } from '../utils/utils'
import { HexColor } from '../types/types'

export type ProjectStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "developer"


export interface IProject {
  name: string
  description: string
  status: ProjectStatus
  userRole: UserRole
  finishDate: Date
  createdDate: Date 
  cost: number
  progress: number
  toDoList: IToDoTask[]
}

export interface IToDoTask {
  name: string
  dueDate: Date
  status: ProjectStatus
}


export class Project implements IProject {
  //To satisfy IProject
  name: string
  description: string
  status: ProjectStatus
  userRole: UserRole
  createdDate: Date
  finishDate: Date 
  cost: number = 0
  progress: number = 0
  toDoList: IToDoTask[]

  //Class internals
  ui: HTMLDivElement
  id: string
  initials: string
  inColor: HexColor
  constructor(data: IProject) {
    //Project data
    this.id = uuidv4()
    this.inColor = getRandomColorFromList()
    for (const key in data) {
      this[key] = data[key]
    }
    
    console.log(this.inColor)
    this.initials = uppercaseInitials(this.name)
    
    this.setUI()
  }

  updateProject(data: IProject) {
    this.inColor = getRandomColorFromList()
    for (const key in data) {
      this[key] = data[key]
    }
    this.setUI
  }

  setUI() {
    //if (this.ui) {return}
    this.ui = document.createElement("div")
    this.ui.className = "project-card"
    this.ui.innerHTML = `
        <div class="card-header">
            <p class="initials" style="background: ${this.inColor}">${this.initials}</p>
            <div>
              <h4>${this.name}</h4>
              <p>${this.description}</p>
            </div>
          </div>
          <div class="card-content">
            <div class="card-property">
              <p style="color: #969696;">Status</p>
              <p>${this.status}</p>
            </div>
            <div class="card-property">
              <p style="color: #969696;">Role</p>
              <p>${this.userRole}</p>
            </div>
            <div class="card-property">
              <p style="color: #969696;">Cost</p>
              <p>$${this.cost}</p>
            </div>
            <div class="card-property">
              <p style="color: #969696;">Estimated Progress</p>
              <p>${this.progress * 100}%</p>
            </div>
          </div>
    `

  
  }


}
