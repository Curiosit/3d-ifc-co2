import { v4 as uuidv4 } from "uuid";
import { getRandomColorFromList, uppercaseInitials } from "../utils/utils";
import { HexColor, Status, UserRole } from "../types/types";
import { IToDo, ToDo } from "./ToDo";
import { colors } from "../utils/utils";
export interface IProject {
  name: string;
  description: string;
  status: Status;
  userRole: UserRole;
  finishDate: Date;
  createdDate: Date;
  cost: number;
  progress: number;
  toDoList: ToDo[];
  id: string;
}

export class Project implements IProject {
  //To satisfy IProject
  name: string;
  description: string;
  status: Status;
  userRole: UserRole;
  createdDate: Date;
  finishDate: Date;
  cost: number = 0;
  progress: number = 0;
  toDoList: ToDo[];
  id: string;

  //Class internals
  ui: HTMLDivElement;
  initials: string;
  inColor: HexColor;
  taskUI: HTMLDivElement;
  

  constructor(data: IProject) {
    //Project data
    this.id = uuidv4();
    this.inColor = getRandomColorFromList(colors);
    for (const key in data) {
      this[key] = data[key];
    }

    console.log(this.inColor);
    this.initials = uppercaseInitials(this.name);
    this.setTaskUI () 
    this.setUI();
    
  }

  addNewTask(newTaskData: IToDo) {
    console.log("adding a new task")
    const newTask = new ToDo(newTaskData)

    this.toDoList.push(newTask)
    console.log(this.toDoList)
    this.setTaskUI ()

  }

  updateProject(data: IProject) {
    for (const key in data) {
      this[key] = data[key];
    }
    this.initials = uppercaseInitials(this.name);
    this.setUI;
  }

  setUI() {
    //if (this.ui) {return}
    this.ui = document.createElement("div");
    this.ui.className = "project-card";
    this.ui.id = this.id;
    this.ui.innerHTML = `
        <div class="card-header">
            <p class="initials" style="background: ${this.inColor}">${
      this.initials
    }</p>
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
    `;
  }
  setTaskUI () {
    const container = document.getElementById("to-do-list")
    //console.log(container)
    if(container && container instanceof HTMLDivElement) {
      container.innerHTML = ''
      this.taskUI = container
      this.renderTaskList()
      
      
    }
    
    
    
  }
  renderTaskList() {
    console.log(this.toDoList)
    //console.log(this.taskUI)
    if (this.toDoList == null) {

    }
    else {
      for (const task of this.toDoList) {
        console.log(task)
        const renderTask = new ToDo(task)
        this.taskUI.append(renderTask.ui)
        //console.log(this.taskUI)
      }
      //console.log(this.taskUI)
    }
    
  }
}
