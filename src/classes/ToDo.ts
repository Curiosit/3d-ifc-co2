import { HexColor, Status, ToDoTaskType } from "../types/types";
import { formatDate } from "../utils/utils";
export interface IToDo {
  taskType: ToDoTaskType;
  name: string;
  description: string;
  dueDate: Date;
  status: Status;
}

export class ToDo implements IToDo {
  taskType: ToDoTaskType;
  name: string;
  description: string;
  dueDate: Date;
  status: Status;

  ui: HTMLDivElement;
  backgroundColor: HexColor;

  constructor(data: IToDo) {
    this.taskType = data.taskType;
    this.name = data.name;
    this.description = data.description;
    this.dueDate = data.dueDate;
    this.status = data.status;

    this.setUIColor();
    this.setUI();
  }

  setUI() {
    this.ui = document.createElement("div");
    this.ui.className = "";
    this.ui.innerHTML = `
          <div class="todo-item" style="background-color: ${
            this.backgroundColor
          }">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; column-gap: 15px; align-items: center;">
                <span class="material-icons-round" style="padding: 10px; background-color: #686868; border-radius: 10px;">${
                  this.name
                }</span>
                <p></p>
              </div>
              <p style="text-wrap: nowrap; margin-left: 10px;">${formatDate(
                this.dueDate
              )}</p>
            </div>
            <div class="description-flag" style="display: none; position: absolute; top: 100%; left: 0; background-color: #fff; border: 1px solid #ccc; padding: 5px; border-radius: 5px;">
              ${this.description}
            </div>
          </div>
        `;
  }

  setUIColor() {
    let colorString = ''
    console.log(this.status)
    if (this.status == "active") {
      colorString = "--active";
    } else if (this.status == "pending") {
      colorString = "--pending";
    } else if (this.status == "finished") {
      colorString = "--finished";
    }
    console.log(colorString)
    this.backgroundColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue(colorString);
  }
}
