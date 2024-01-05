import { HexColor, Status, ToDoTaskType } from "../types/types";
import { formatDate } from "../utils/utils";
export interface IToDo {
  taskType: ToDoTaskType;
  name: string;
  description: string;
  dueDate: Date;
  status: Status;
  id: string;
}

export class ToDo implements IToDo {
  taskType: ToDoTaskType;
  name: string;
  description: string;
  dueDate: Date;
  status: Status;
  id: string;

  ui: HTMLDivElement;
  backgroundColor: HexColor;

  constructor(data: IToDo) {
    this.id = data.id;
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
          <div class="todo-item tooltip" style="background-color: ${
            this.backgroundColor
          }">
            <div class="" style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; column-gap: 15px; align-items: center;">
                <span class="material-icons-round trigger" style="padding: 10px; background-color: #686868; border-radius: 10px;">construction</span><p></p>
              </div>
              <p style="text-wrap: nowrap; margin-left: 10px;">${
                this.name
              }
              </p>
              ${formatDate(
                this.dueDate
              )}
            </div>
            <div class="tooltiptext">
              ${this.description}
            </div>
          </div>
        `;
  }

  setUIColor() {
    let colorString = ''
    console.log(this.status)
    if (this.status == "active") {
      colorString = "--primary";
    } else if (this.status == "pending") {
      colorString = "--pending";
    } else if (this.status == "finished") {
      colorString = "--finished";
    }
    console.log(colorString)
    this.backgroundColor =  getComputedStyle(
      document.documentElement
    ).getPropertyValue(colorString);
  }
}
