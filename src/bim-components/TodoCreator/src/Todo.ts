import * as OBC from "openbim-components"
import { TodoCard } from "./TodoCard"
import * as THREE from "three"
import { v4 as uuidv4 } from 'uuid'
import { Status } from "../../../types/types"
import { parseFragmentIdMap } from "../../../utils/utils"

export type ToDoPriority = "Low" | "Medium" | "High"

export class Todo extends OBC.Component<null>  {
    description: string
    date: Date
    fragmentMap: OBC.FragmentIdMap
    camera: OBC.OrthoPerspectiveCamera
    todoCamera: {position: THREE.Vector3, target: THREE.Vector3}
    status: Status
    priority: ToDoPriority
    id: string
    private _components: OBC.Components
    enabled = true
    projectId: string

    TodoCard: TodoCard
    get(...args: any): null {
        return null
    }
    highlighter: OBC.FragmentHighlighter
    
    constructor(components: OBC.Components, {
        description,
        date,
        status,
        priority,
        projectId,
        fragmentMap, 
        todoCamera,
        id
    }: {
        description: string;
        date: Date;
        status: Status;
        priority: ToDoPriority;
        projectId: string;
        fragmentMap?: OBC.FragmentIdMap; 
        todoCamera?: {position: THREE.Vector3, target: THREE.Vector3}
        id?: string
    })
    {
        super(components)
        this._components = components
        if(fragmentMap) {
            this.fragmentMap = fragmentMap
        }
        else {
        
        }
        console.log(id)
        this.id = id as string
        this.status = status
        
        console.log(components.camera)
        if (!this.enabled) { return }
        const camera = this._components.camera
        
        if (!(camera instanceof OBC.OrthoPerspectiveCamera)) {
            throw new Error("TodoCreator needs the Ortho Perspective Camera in order to work!")
        }
        this.projectId = projectId
        //camera.controls

        const position = new THREE.Vector3()
        camera.controls.getPosition(position)
        const target = new THREE.Vector3()
        camera.controls.getTarget(target)
        this.camera = camera
        
        
        
        if(!todoCamera) {
            this.todoCamera = {position, target}
        }
        else {
            this.todoCamera = todoCamera
        }
        


        


        this.description = description
        this.date = date
        
        
        this.priority = priority
        
        

        this.TodoCard = new TodoCard(components)
        this.TodoCard.priority = this.priority
        this.TodoCard.status = this.status
        console.log(this.fragmentMap)
        
        console.log (this.TodoCard)
        this.TodoCard.description = this.description
        this.TodoCard.date = this.date
        
        
        
        /* this.TodoCard.onDelete.add(() => {
            this.removeTodo(todo, todoCard)
            
        })  */
        
    }

    async setupOnClick() {
        console.log("Setup onclick")
        this.highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
        
        if (!this.fragmentMap) {
            this.fragmentMap = this.highlighter.selection.select
        }
        this.TodoCard.count = this.fragmentMap[Object.keys(this.fragmentMap)[0]].size
        
        this.TodoCard.onCardClick.add(async () => {
            console.log("clicked!!!")
            console.log(this.todoCamera)
            this.camera.controls.setLookAt(
                this.todoCamera.position.x,
                this.todoCamera.position.y,
                this.todoCamera.position.z,
                this.todoCamera.target.x,
                this.todoCamera.target.y,
                this.todoCamera.target.z,
                true

            )
            
            const fragmentMapLength = Object.keys(this.fragmentMap).length
            //this.TodoCard.count = this.fragmentMap.set.size as unknown as number
            //console.log (this.fragmentMap.set.size)
           
            if(fragmentMapLength === 0) {return}
            this.highlighter.highlightByID("select", this.fragmentMap)
            
        })
    }
    async setupSelection() {
        this.highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
        this.fragmentMap = this.highlighter.selection.select
        
        this.setupOnClick()
    }

    

}