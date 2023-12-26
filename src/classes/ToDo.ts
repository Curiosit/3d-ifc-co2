import { HexColor, Status, ToDoTaskType } from "../types/types"

export interface IToDo {
    taskType: ToDoTaskType
    name: string
    description: string
    dueDate: Date
    status: Status
}

export class ToDo implements IToDo {

    taskType: ToDoTaskType
    name: string
    description: string
    dueDate: Date
    status: Status

    ui: HTMLDivElement
    backgroundColor: HexColor


    
     

    constructor (data: IToDo) {
        this.taskType = data.taskType
        this.name = data.name
        this.description = data.description
        this.dueDate = data.dueDate
        this.status = data.status

        this.setUIColor()
    }

    setUI() {
        this.ui = document.createElement("div")
        this.ui.className = "project-card"
        this.ui.innerHTML = `
          <div class="todo-item" style="background-color: ${this.backgroundColor}" onmouseover="showDescriptionFlag(this)" onmouseout="hideDescriptionFlag(this)">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; column-gap: 15px; align-items: center;">
                <span class="material-icons-round" style="padding: 10px; background-color: #686868; border-radius: 10px;">${this.taskType}</span>
                <p>${this.name}</p>
              </div>
              <p style="text-wrap: nowrap; margin-left: 10px;">${this.dueDate}</p>
            </div>
            <div class="description-flag" style="display: none; position: absolute; top: 100%; left: 0; background-color: #fff; border: 1px solid #ccc; padding: 5px; border-radius: 5px;">
              ${this.description}
            </div>
          </div>
        `;
    }
    showDescriptionFlag(element) {
      const flag = element.querySelector('.description-flag');
      flag.style.display = 'block';
    }
    
    hideDescriptionFlag(element) {
      const flag = element.querySelector('.description-flag');
      flag.style.display = 'none';
    }
    setUIColor () {
      if (this.status === 'active') {
        this.backgroundColor = '--active'; 
    } else if (this.status === 'pending') {
        this.backgroundColor = '--pending'; 
    } else if (this.status === 'finished') {
        this.backgroundColor = '--finished'; 
    }
    }
}