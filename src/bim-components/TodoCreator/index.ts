import * as OBC from "openbim-components"
import * as THREE from "three"
import { TodoCard } from "./src/TodoCard"


import { ToDoPriority, Todo } from "./src/Todo"


interface ToDo {
    description: string
    date: Date
    fragmentMap: OBC.FragmentIdMap
    camera: {position: THREE.Vector3, target: THREE.Vector3}
    priority: ToDoPriority
    id: string
}

export class TodoCreator extends OBC.Component<number> implements OBC.UI, OBC.Disposable {
    static uuid = "79a04980-11cf-42c7-963d-67ccb0ff0dad"
    onProjectCreated = new OBC.Event<ToDo>()

    enabled = true
    uiElement = new OBC.UIElement<
    {
        activationButton: OBC.Button
        todoList: OBC.FloatingWindow
    }>()
    private _components: OBC.Components
    private _list: Todo[] = []
    //private _Todo: Todo

    constructor(components: OBC.Components) {
        super(components)
        this._components = components
        
        

        components.tools.add(TodoCreator.uuid, this)
        this.setUI()
    }

    async dispose() {
        this.uiElement.dispose()
        this._list = []
        this.enabled = false
    }
    async setup() {
        const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
        highlighter.add(`${TodoCreator.uuid}-priority-Low`, [new THREE.MeshStandardMaterial({color: 0x00d02b})])
        highlighter.add(`${TodoCreator.uuid}-priority-Medium`, [new THREE.MeshStandardMaterial({color: 0x7fbd45})])
        highlighter.add(`${TodoCreator.uuid}-priority-High`, [new THREE.MeshStandardMaterial({color: 0x8eb161})])
    }   

    removeTodo(toDo, toDoCard) {
       const updatedToDos = this._list.filter((todo)=> {
        return (todo.id!=toDo.id)
       })
       this._list = updatedToDos 
       toDoCard.dispose()
    }

    async addTodo(description: string, priority: ToDoPriority) {
        const date = new Date()
        const data = {
            description: description,
            date: date,
            priority: priority,
        }
        const todo = new Todo(this.components, data)
        await todo.setupOnClick()
        this._list.push(todo)
        const todoList = this.uiElement.get("todoList")
        todoList.addChild(todo.TodoCard)
        todo.TodoCard.onDelete.add(() => {
            this.removeTodo(todo, todo.TodoCard)
        })
        this.onProjectCreated.trigger()
    }

    private async setUI() {
        const activationButton = new OBC.Button(this._components)
        activationButton.materialIcon = "construction"
        activationButton.tooltip = "ToDo List"

        const newTodoBtn = new OBC.Button(this._components, {name: "Create"})
        activationButton.addChild(newTodoBtn)

        const form = new OBC.Modal(this._components)
        this._components.ui.add(form)
        form.title = "Create a New ToDo"

        const descriptionInput = new OBC.TextArea(this._components)
        descriptionInput.label = "Description..."
        form.slots.content.addChild(descriptionInput)

        const priorityDropdown = new OBC.Dropdown(this._components)
        priorityDropdown.label = "Priority"
        priorityDropdown.addOption("Low", "Medium", "High")
        priorityDropdown.value = "Normal"
        form.slots.content.addChild(priorityDropdown)

        form.slots.content.get().style.padding = "20px"
        form.slots.content.get().style.display = "flex"
        form.slots.content.get().style.flexDirection = "column"
        form.slots.content.get().style.rowGap = "20px"

        form.onAccept.add(() => {
            this.addTodo(descriptionInput.value, priorityDropdown.value as ToDoPriority)
            descriptionInput.value = ""
            form.visible = false
        })

        form.onCancel.add(() => {
            form.visible = false
        })
        newTodoBtn.onClick.add(() => {
            form.visible = true
        })

        const todoList = new OBC.FloatingWindow(this._components)
        this._components.ui.add(todoList)
        todoList.visible = false
        todoList.title = "ToDo List"

        const todoListToolbar = new OBC.SimpleUIComponent(this._components)
        todoList.addChild(todoListToolbar)

        const menuContainer =  new OBC.SimpleUIComponent(this._components)
        menuContainer.get().style.display="flex"
        todoListToolbar.addChild(menuContainer)


        const searchBar = this.addSearch() 
        menuContainer.addChild(searchBar)


        const colorizeBtn = new OBC.Button(this._components)
        colorizeBtn.materialIcon = "format_color_fill"
        colorizeBtn.tooltip = "Colorize by priority"
        menuContainer.addChild(colorizeBtn)

        
        

        const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
        colorizeBtn.onClick.add(() => {
            colorizeBtn.active = !colorizeBtn.active
            if (colorizeBtn.active) {
                for (const todo of this._list ) {
                    const fragmentMapLength = Object.keys(todo.fragmentMap).length
                    if(fragmentMapLength === 0) {return}
                    highlighter.highlightByID(`${TodoCreator.uuid}-priority-${todo.priority}`, todo.fragmentMap)
                }

            }
            else {
                highlighter.clear(`${TodoCreator.uuid}-priority-Low`)
                highlighter.clear(`${TodoCreator.uuid}-priority-Medium`)
                highlighter.clear(`${TodoCreator.uuid}-priority-High`)
            }
        })

        const todoListBtn  = new OBC.Button(this._components, {name: "List"})
        activationButton.addChild(todoListBtn)
        todoListBtn.onClick.add(() => todoList.visible = !todoList.visible)

        this.uiElement.set({
            activationButton,
            todoList
        })
    }

    addSearch() {
        const searchContainer = new OBC.SimpleUIComponent(this._components)
        searchContainer.get().style.display="flex"
        const searchIcon = new OBC.Button(this._components)
        searchIcon.materialIcon = "search"
        const searchInput = new OBC.TextInput(this._components)
        searchInput.label = ""
        const input = searchInput.innerElements.input
        input.style.padding = "1px"

        
        if (input) {
            input.addEventListener("input", (e) => {
            if(e.target) {
            const target = e.target as HTMLInputElement
            console.log(target.value)
            this.filterList(target.value)
            }
            
        })
        }

        searchContainer.addChild(searchInput)
        searchContainer.addChild(searchIcon)
        
        return searchContainer

    }
    filterList(str) {
        for (let i = 0; i < this._list.length; i++) {
            const todo_item = this._list[i];
            if(todo_item.description.includes(str)) {
                todo_item.TodoCard.visible = true
            }
            else {
                todo_item.TodoCard.visible = false
            }
        }
    }

    get(): number {
        return this._list.length
    }
}