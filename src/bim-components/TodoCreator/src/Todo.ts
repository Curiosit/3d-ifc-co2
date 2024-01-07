import * as OBC from "openbim-components"
import { TodoCard } from "./TodoCard"
import * as THREE from "three"
import { v4 as uuidv4 } from 'uuid'

export type ToDoPriority = "Low" | "Medium" | "High"

export class Todo extends OBC.Component<null>  {
    description: string
    date: Date
    fragmentMap: OBC.FragmentIdMap
    camera: OBC.OrthoPerspectiveCamera
    todoCamera: {position: THREE.Vector3, target: THREE.Vector3}
    priority: ToDoPriority
    id: string
    private _components: OBC.Components
    enabled = true

    TodoCard: TodoCard
    get(...args: any): null {
        return null
    }
    highlighter: OBC.FragmentHighlighter

    constructor(components:OBC.Components, {
        description,
        date,
        priority,
    }) 
    {
        

        super(components)
        this._components = components
        console.log(components.camera)
        if (!this.enabled) { return }
        const camera = this._components.camera
        
        if (!(camera instanceof OBC.OrthoPerspectiveCamera)) {
            throw new Error("TodoCreator needs the Ortho Perspective Camera in order to work!")
        }
        //camera.controls

        const position = new THREE.Vector3()
        camera.controls.getPosition(position)
        const target = new THREE.Vector3()
        camera.controls.getTarget(target)
        this.camera = camera
        this.todoCamera = {position, target}


        


        this.description = description
        this.date = date
        
        
        this.priority = priority
        this.id = uuidv4()
        

        this.TodoCard = new TodoCard(components)

        this.TodoCard.description = this.description
        this.TodoCard.date = this.date
        
        
        /* const todoList = this.uiElement.get("todoList")
        console.log(this)
        todoList.addChild(todoCard)
        todoCard.onDelete.add(() => {
            this.removeTodo(todo, todoCard)
            
        }) */
        
    }

    async setupOnClick() {
        this.highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
        this.fragmentMap = this.highlighter.selection.select,
        this.TodoCard.onCardClick.add(() => {
            this.camera.controls.setLookAt(
                this.todoCamera.position.x,
                this.todoCamera.position.y,
                this.todoCamera.position.x,
                this.todoCamera.target.x,
                this.todoCamera.target.y,
                this.todoCamera.target.z,
                true

            )
            const fragmentMapLength = Object.keys(this.fragmentMap).length
            if(fragmentMapLength === 0) {return}
            this.highlighter.highlightByID("select", this.fragmentMap)
        })
    }

}