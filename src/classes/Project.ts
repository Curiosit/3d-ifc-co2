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
    this.loadTasks();
    this.setTaskUI () 
    this.setUI();
    
  }

  loadTasks() {
    let i = 0;
    for(const task of this.toDoList) {
      this.toDoList[i] = new ToDo(task)
      i++

    }
    console.log(this.toDoList)
  }

  addNewTask(newTaskData: IToDo) {
    console.log("adding a new task")
    const newTask = new ToDo(newTaskData)

    this.toDoList.push(newTask)
    //console.log(this.toDoList)
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
      for (let task of this.toDoList) {
        console.log(task)
        console.log(task.ui.innerHTML)
        //task = new ToDo(task)
        task.ui.addEventListener("click", () => { 
          showModal("edit-to-do-modal");
          this.setupEditToDoModal(task)
        })

        this.taskUI.append(task.ui)
        //console.log(this.taskUI)
      }
      //console.log(this.taskUI)
    }
    
  }
  setupEditToDoModal(renderTask:ToDo) {
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

    const closeEditToDoBtn = document.getElementById(
      "close-edit-to-do-modal-btn"
    );
    if (closeEditToDoBtn) {
      closeEditToDoBtn.addEventListener("click", () => {
        console.log("Closing modal...");
        closeModal("edit-to-do-modal");
      });
    } else {
      console.warn("Close modal button was not found");
    }
    const editToDoForm = document.getElementById("edit-to-do-form") as HTMLFormElement
    console.log(editToDoForm)
    if(editToDoForm) {
      editToDoForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const editToDoFormData = new FormData(editToDoForm)
        try {
          const editedTask: IToDo = {
              taskType: editToDoFormData.get("taskType") as ToDoTaskType,
              name:  editToDoFormData.get("name") as string,
              description:  editToDoFormData.get("description") as string,
              dueDate: new Date(editToDoFormData.get("dueDate") as string),
              status: editToDoFormData.get("status") as Status,
              id: renderTask.id
          }
      
          console.log("trying to add a new task...")
          
          this.modifyTask(editedTask)
          editToDoForm.reset()
          closeModal("edit-to-do-modal")
          
          
          
      }
      catch (err) {
          showModal("error-modal", true, err)
      } 
      })
    }
    
  }

  modifyTask(editedTask: IToDo) {
    const modifiedTask = new ToDo(editedTask)
    for (let task of this.toDoList) {
      if(modifiedTask.id == task.id) {
        task = modifiedTask
        this.setTaskUI()
      }
    }
  }
}
