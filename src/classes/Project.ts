import { v4 as uuidv4 } from "uuid";
import { getRandomColorFromList, uppercaseInitials } from "../utils/utils";
import { HexColor, Status, UserRole } from "../types/types";
import { IToDo, ToDo } from "./ToDo";
import { colors } from "../utils/utils";
import { showModal, closeModal } from "../utils/utils";
import { ToDoTaskType } from "../types/types";
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
  
  initials: string;
  inColor: HexColor;
  taskUI: HTMLDivElement;
  

  constructor(data: IProject) {
    //Project data
    this.id = uuidv4();
    
    for (const key in data) {
      this[key] = data[key];
    }

    
    this.initials = uppercaseInitials(this.name);
    this.inColor = getRandomColorFromList(this.initials, colors);
    console.log(this.inColor);
    this.loadTasks();
    this.setTaskUI () 
    
    
    
  }

  loadTasks() {
    let i = 0;
    if (this.toDoList) {
    for(const task of this.toDoList) {
      this.toDoList[i] = new ToDo(task)
      i++

    }
    console.log(this.toDoList)
  }
  }

  addNewTask(newTaskData: IToDo) {
    console.log("adding a new task")
    const newTask = new ToDo(newTaskData)

    this.toDoList.push(newTask)
    //console.log(this.toDoList)
    this.setTaskUI ()

  }

  updateProject(data: IProject) {
    console.log(this)
    for (const key in data) {
      this[key] = data[key];
    }
    this.initials = uppercaseInitials(this.name);
    
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
      for (let task of this.toDoList) {
        console.log(task)
        console.log(task.ui.innerHTML)
        //task = new ToDo(task)
        task.ui.addEventListener("click", () => { 
          showModal("edit-to-do-modal");
          this.updateEditToDoModal(task)
        })

        this.taskUI.append(task.ui)
        //console.log(this.taskUI)
      }
      //console.log(this.taskUI)
    }
    
  }


  updateEditToDoModal(renderTask:ToDo) {
    console.log(this)
    console.log(renderTask)
    const editToDoModal = document.getElementById("edit-to-do-modal");
    if (!editToDoModal) {
      return;
    }
    const name = editToDoModal.querySelector(
      "[edit-to-do-info='name']"
    ) as HTMLInputElement;
    if (name) {
      name.value = renderTask.name;
    }
    const description = editToDoModal.querySelector(
      "[edit-to-do-info='description']"
    ) as HTMLInputElement;
    if (description) {
      description.value = renderTask.description;
    }
    const status = editToDoModal.querySelector(
      "[edit-to-do-info='status']"
    ) as HTMLInputElement;
    if (status) {
      status.value = renderTask.status;
    }
    const id = editToDoModal.querySelector(
      "[edit-to-do-info='id']"
    ) as HTMLInputElement;
    if (id) {
      id.value = renderTask.id;
    }
    const taskType = editToDoModal.querySelector(
      "[edit-to-do-info='taskType']"
    ) as HTMLInputElement;
    if (taskType) {
      taskType.value = renderTask.taskType;
    }

    const dueDate = editToDoModal.querySelector(
      "[edit-to-do-info='dueDate']"
    ) as HTMLInputElement;
    if (dueDate) {
      dueDate.value = new Date(
        renderTask.dueDate
      ).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }

  }
  

}
