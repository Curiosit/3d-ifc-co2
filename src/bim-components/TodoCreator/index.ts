import * as OBC from "openbim-components"
import * as THREE from "three"
import { TodoCard } from "./src/TodoCard"


import { ToDoPriority, Todo } from "./src/Todo"
import { addDocument, deleteDocument, getCollection } from "../../firebase"
import { Project } from "../../classes/Project"
import * as Firestore from "firebase/firestore"
import { parseFragmentIdMap, stringifyFragmentIdMap } from "../../utils/utils"
import { Status } from "../../types/types"


interface ToDoData {
    description: string
    date: Date
    fragmentMap?: OBC.FragmentIdMap
    todoCamera: {position: THREE.Vector3, target: THREE.Vector3}
    status: Status
    priority: ToDoPriority
    id: string
    projectId: string
}
const todosCollection = getCollection<ToDoData>("/todos")

export class TodoCreator extends OBC.Component<number> implements OBC.UI, OBC.Disposable {
    currentTodo: Todo 
    editForm
    clearList() {
        for(const item  of this._list) {
            item.TodoCard.dispose()
        }
        this._list = []
        console.log("list cleared")
    }
    getFirestoreTodos = async () => {
        console.log("get todos")
        this.clearList()
        
        const firebaseTodos = await Firestore.getDocs(todosCollection)
        
        for (const doc of firebaseTodos.docs) {
            console.log("get todos")
            const data = doc.data() 
            if(data.projectId === this.project.id) {
                console.log(data.fragmentMap)
                console.log(parseFragmentIdMap(data.fragmentMap as unknown as string))
                
                console.log(doc.id)
                
                try {
                    const todo: ToDoData = {
                        ...data,
                        fragmentMap: parseFragmentIdMap(data.fragmentMap as unknown as string),
                        todoCamera: (JSON.parse(data.todoCamera as unknown as string)) as {position: THREE.Vector3, target: THREE.Vector3},
                        date: (data.date as unknown as Firestore.Timestamp).toDate(),
                        id: doc.id
                    }

                    const todoObject = new Todo(this.components, todo)
                    console.log("Calling setup on click!")
                    await todoObject.setupOnClick(this.editForm)
                    //todoObject.countMaps()
                    this._list.push(todoObject)
                    const todoList = this.uiElement.get("todoList")
                    
                    todoList.addChild(todoObject.TodoCard)
                    todoObject.TodoCard.onDelete.add(() => {
                        console.log("removing!")
                        this.removeTodo(todo, todoObject.TodoCard)
                    })
                    todoObject.TodoCard.onEdit.add(() => {
                        console.log(this.currentTodo)
                        this.currentTodo = todoObject
                        console.log(this.currentTodo)
                        
                    })
                    this.onProjectCreated.trigger()
                }
                catch (error) {
                    console.log(error)
                }
            }
            else {

            }
            
            
        
        }

        return firebaseTodos.docs
    }

    project
    static uuid = "79a04980-11cf-42c7-963d-67ccb0ff0dad"
    onProjectCreated = new OBC.Event<ToDoData>()

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
        this.getFirestoreTodos()
        this._components = components
        
        

        components.tools.add(TodoCreator.uuid, this)
        this.setUI()
    }

    async dispose() {
        this.uiElement.dispose()
        this._list = []
        this.enabled = false
    }
    async setup(setupProject: Project) {
        this.project = setupProject

        const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
        highlighter.add(`${TodoCreator.uuid}-priority-Low`, [new THREE.MeshStandardMaterial({color: 0x8FDB5E})])
        highlighter.add(`${TodoCreator.uuid}-priority-Medium`, [new THREE.MeshStandardMaterial({color: 0xFFA500})])
        highlighter.add(`${TodoCreator.uuid}-priority-High`, [new THREE.MeshStandardMaterial({color: 0xFF0000})])
    }   

    async removeTodo(toDo, toDoCard) {

        const result = await deleteDocument("todos", toDo.id)

        const updatedToDos = this._list.filter((todo)=> {
            return (todo.id!=toDo.id)
        })
        this._list = updatedToDos 
        toDoCard.dispose()
    }

    async addTodo(description: string, priority: ToDoPriority, status: Status) {
        const date = new Date()
        const data = {
            description: description,
            date: date,
            priority: priority,
            projectId: this.project.id,
            status: status
        }
        const todo = new Todo(this.components, data)

        await todo.setupSelection()
        
        
       
        const result = await addDocument("todos",{
            description: todo.description,
            projectId: todo.projectId,
            date: todo.date,
            priority: todo.priority,
            status: todo.status,
            fragmentMap: stringifyFragmentIdMap(todo.fragmentMap),
            todoCamera: JSON.stringify(todo.todoCamera)
        })
        todo.id = result
        
        
        this._list.push(todo)
        const todoList = this.uiElement.get("todoList")
        await todo.setupOnClick(this.editForm)
        todoList.addChild(todo.TodoCard)
       
        
        todo.TodoCard.onEdit.add(() => {
            
            this.currentTodo = todo
            
            
        })
        
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

        const statusDropdown = new OBC.Dropdown(this._components)
        statusDropdown.label = "Status"
        statusDropdown.addOption("pending", "active", "finished")
        statusDropdown.value = "pending"
        form.slots.content.addChild(statusDropdown)

        form.slots.content.get().style.padding = "20px"
        form.slots.content.get().style.display = "flex"
        form.slots.content.get().style.flexDirection = "column"
        form.slots.content.get().style.rowGap = "20px"

        form.onAccept.add(() => {
            this.addTodo(descriptionInput.value, priorityDropdown.value as ToDoPriority, statusDropdown.value as Status)
            descriptionInput.value = ""
            form.visible = false
        })

        form.onCancel.add(() => {
            form.visible = false
        })
        newTodoBtn.onClick.add(() => {
            form.visible = true
        })

        this.editForm = new OBC.Modal(this._components)
        const editForm = this.editForm
        this._components.ui.add(editForm)
        editForm.title = "Edit a ToDo"

        const editDescriptionInput = new OBC.TextArea(this._components)
        editDescriptionInput.label = "Description..."
        editDescriptionInput.name = 'description'
        editForm.slots.content.addChild(editDescriptionInput)

        const editPriorityDropdown = new OBC.Dropdown(this._components)
        editPriorityDropdown.name='priority'
        editPriorityDropdown.label = "Priority"
        editPriorityDropdown.addOption("Low", "Medium", "High")
        editPriorityDropdown.value = "Normal"
        editForm.slots.content.addChild(editPriorityDropdown)

        const editStatusDropdown = new OBC.Dropdown(this._components)
        editStatusDropdown.name = 'status'
        editStatusDropdown.label = "Status"
        editStatusDropdown.addOption("pending", "active", "finished")
        editStatusDropdown.value = "pending"
        editForm.slots.content.addChild(editStatusDropdown)

        editForm.slots.content.get().style.padding = "20px"
        editForm.slots.content.get().style.display = "flex"
        editForm.slots.content.get().style.flexDirection = "column"
        editForm.slots.content.get().style.rowGap = "20px"

        editForm.onAccept.add(() => {
            console.log(this.currentTodo)
            this.currentTodo.editTodo(editForm)
            
        })

        editForm.onCancel.add(() => {
            editForm.visible = false
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
            if(todo_item.description.toLowerCase().includes(str.toLowerCase())) {
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
    update() {
        this.getFirestoreTodos()
    }
}