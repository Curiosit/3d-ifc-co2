import * as OBC from "openbim-components"

export class TodoCard extends OBC.SimpleUIComponent {
    
    onDelete = new OBC.Event()
    onCardClick = new OBC.Event()
    onEdit = new OBC.Event()
    statusColor
    slots: {
        actionButtons: OBC.SimpleUIComponent
    }

    set description(value: string) {
        const descriptionElement = this.getInnerElement("description") as HTMLParagraphElement
        descriptionElement.textContent = value
    }

    set date(value: Date) {
        console.log(value)
        const dateElement = this.getInnerElement("date") as HTMLParagraphElement
        dateElement.textContent = value.toDateString()
    }

    
    set status(value: string) {
        
        const statusElement = this.getInnerElement("status") as HTMLParagraphElement
        if (value == 'active') {
            statusElement.textContent = 'construction'
            statusElement.style.backgroundColor = this.statusColor
        }
        if (value == 'pending') {
            statusElement.textContent = 'arrow_forward'
            statusElement.style.backgroundColor = this.statusColor
            
        }
        if (value == 'finished') {
            statusElement.textContent = 'done'
            statusElement.style.backgroundColor = '#686868'
            
        }
        
    }
    set priority (value: string) {
        
        if (value == 'Low') {
            this.statusColor = '#8FDB5E'
            
        }
        if (value == 'Medium') {
            this.statusColor = '#FFA500'
            
        }
        if (value == 'High') {
            this.statusColor = '#FF0000'
            
            
        }
    }
    set count (value: number) {
        const countElement = this.getInnerElement("count") as HTMLParagraphElement
        countElement.textContent = value as unknown as string
        
    }
    update(todo) {
        console.log(todo)
        this.description = todo.description
        this.priority = todo.priority
        this.status = todo.status

    }


    constructor(components: OBC.Components) {
        const template = `
        
            <div class="todo-item tooltip" >
            <div class="" style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; column-gap: 15px; align-items: center;">
                <span id="status" class="material-icons-round trigger" style="padding: 10px; background-color: #686868; border-radius: 10px;">
                    construction
                </span>
                    <div>
                        <p id="date" style="text-wrap: nowrap; color: #a9a9a9; font-size: var(--font-sm)">
                            Fri, 20 sep
                        </p>
                        <p id="description">
                            Make anything here as you want, even something longer.
                        </p>
                    </div>
                </div>
                <div style="display: flex; column-gap: 15px; align-items: center">
                
            
                    <span id="count"  style="padding: 5px; background-color: #686868; border-radius: 99px;">
                        1
                    </span>
                    <div data-tooeen-slot="actionButtons" style="display: flex; column-gap: 15px; align-items: flex-end;"></div>
                </div>
            </div>
            
            </div>
      
        `


        super(components, template)
        const cardElement = this.get()
        cardElement.addEventListener("click", () => {
            console.log("clicked")

            this.onCardClick.trigger()
        })
        this.setSlot("actionButtons", new OBC.SimpleUIComponent(this._components))
        const editBtn = new OBC.Button(this._components)
        editBtn.materialIcon = "edit"
        this.slots.actionButtons.addChild(editBtn)
        editBtn.onClick.add(() => {
            console.log("setup edit trigger")
            this.onEdit.trigger()
        })
        const deleteBtn = new OBC.Button(this._components)
        deleteBtn.materialIcon = "delete"
        this.slots.actionButtons.addChild(deleteBtn)
        deleteBtn.onClick.add(() => {
            console.log("Removing...")
            this.onDelete.trigger()
        })
    }
}