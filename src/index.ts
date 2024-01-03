import { Project, IProject } from "./classes/Project"
import { UserRole, Status } from "./types/types"
import { ProjectsManager } from "./classes/ProjectsManager"
import { ErrorModal } from "./classes/ErrorModal"
import { closeModal } from "./utils/utils"
import { formatDate, modifyDateInput } from "./utils/utils"
import { showModal } from "./utils/utils"
import { v4 as uuidv4 } from 'uuid'

import { OBJLoader} from "three/examples/jsm/loaders/OBJLoader"
import { MTLLoader} from "three/examples/jsm/loaders/MTLLoader"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as THREE from "three"

import * as OBC from "openbim-components"

const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)

// Menu Buttons
const menuProjectBtn = document.getElementById("menu-project-btn")
if (menuProjectBtn) {
  
  menuProjectBtn.addEventListener("click", () => {showProjects()})
} else {
  console.warn("Menu project button was not found")
}


//
function showProjects () {
  console.log("clicked")
  const projectsPage = document.getElementById("projects-page")
  const detailsPage = document.getElementById("project-details")
  if (!projectsPage || !detailsPage) {return}
  detailsPage.style.display = "none"
  projectsPage.style.display = "flex"
}

// This document object is provided by the browser, and its main purpose is to help us interact with the DOM.
const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {showModal("new-project-modal")})
} else {
  console.warn("New projects button was not found")
}
const editProjectBtn = document.getElementById("edit-project-details-btn")
if (editProjectBtn) {
  editProjectBtn.addEventListener("click", () => {
    showModal("edit-project-modal")
    projectsManager.setupEditProjectModal();
  })
} else {
  console.warn("Edit projects button was not found")
}

const projectForm = document.getElementById("new-project-form")
if (projectForm && projectForm instanceof HTMLFormElement) {
  const currentDateInput = document.getElementById("createdDate") as HTMLInputElement
  const finishedDateInput = document.getElementById("finishDate") as HTMLInputElement
  console.log(currentDateInput)
  console.log(finishedDateInput)
  const today = new Date();
  modifyDateInput(currentDateInput, today)

  const nextYear = new Date(today.setFullYear(today.getFullYear() + 1));
  modifyDateInput(finishedDateInput, nextYear)
  
  console.log("projectForm found")
  const closeNewProjectBtn = document.getElementById("close-new-project-modal-btn")
  if (closeNewProjectBtn) {
    console.log("Found close new modal button")
    closeNewProjectBtn.addEventListener("click", () => {closeModal("new-project-modal")})
  } else {
    console.warn("Close modal button was not found")
  }
  projectForm.addEventListener("submit", (e) => {
    console.log("event listener fired")
    e.preventDefault()
    const formData = new FormData(projectForm)
    const finishDateInput = formData.get("finishDate") as string;

    let finishDate;
    if (finishDateInput) {
      finishDate = new Date(finishDateInput);
    } else {
      
      finishDate = nextYear;
    }

    const projectData: IProject = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as Status,
      userRole: formData.get("userRole") as UserRole,
      finishDate: finishDate,
      createdDate: new Date(),
      cost: 0,
      progress: 0,
      toDoList: [],
      id: uuidv4()

    };
    try {
      console.log("trying...")
      const project = projectsManager.newProject(projectData)
      console.log(project)
      projectForm.reset()
      closeModal("new-project-modal")
    }
    catch (err) {
      showModal("error-modal", true, err)
    }

  })

  
} else {
	console.warn("The project form was not found. Check the ID!")
}


const exportProjectsBtn= document.getElementById("export-projects-btn")
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectsManager.exportToJSON()
  })
}

const importProjectsBtn = document.getElementById("import-projects-btn")
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectsManager.importFromJSON()
  })
}

//THREE.JS viewer

/* const scene = new THREE.Scene()

const viewerContainer = document.getElementById("viewer-container") as HTMLElement


const camera = new THREE.PerspectiveCamera(75)
camera.position.z = 5


const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
viewerContainer.append(renderer.domElement)

function resizeViewer() {
  const containerDimensions = viewerContainer.getBoundingClientRect()
  renderer.setSize(containerDimensions.width, containerDimensions.height)
  const aspectRatio = containerDimensions.width / containerDimensions.height
  camera.aspect = aspectRatio
  camera.updateProjectionMatrix()
}
window.addEventListener("resize", resizeViewer)
resizeViewer()

const boxGeometry= new THREE.BoxGeometry()
const material = new THREE.MeshStandardMaterial()
const cube = new THREE.Mesh(boxGeometry, material)
//scene.add(cube)

const directionalLight = new THREE.DirectionalLight()
const ambientLight = new THREE.AmbientLight()
ambientLight.intensity = 0.4
scene.add(directionalLight)
scene.add(ambientLight)

const cameraControls = new OrbitControls(camera, viewerContainer)

function renderScene() {
  renderer.render(scene, camera)
  window.requestAnimationFrame(renderScene)
}
renderScene()

const axes = new THREE.AxesHelper()
scene.add(axes)
const grid = new THREE.GridHelper()
grid.material.transparent = true
grid.material.opacity = 0.4
grid.material.color = new THREE.Color("#808080")
scene.add(grid)

const gui = new GUI()
const cubeControls = gui.addFolder("Cube")


cubeControls.add(cube.position, "x", -10, 10, 1)
cubeControls.add(cube.position, "y", -10, 10, 1)
cubeControls.add(cube.position, "z", -10, 10, 1)
cubeControls.add(cube, "visible")
cubeControls.addColor(cube.material, "color")

const lightControls = gui.addFolder("Light")
lightControls.add(directionalLight, "intensity", 0, 1, 0.1)

lightControls.add(directionalLight.position, "x", -10, 10, 1)
lightControls.add(directionalLight.position, "y", -10, 10, 1)
lightControls.add(directionalLight.position, "z", -10, 10, 1)

const objLoader = new OBJLoader()
const mtlLoader = new MTLLoader()

objLoader.load("../assets/Gear/Gear1.obj", (mesh) => {
  scene.add(mesh)
})

mtlLoader.load("../assets/Gear/Gear1.mtl", (materials) => {
  materials.preload()
  objLoader.setMaterials(materials)
}) */


// OPENBIM VIEWER
const viewer = new OBC.Components()

const sceneComponent = new OBC.SimpleScene(viewer)
sceneComponent.setup()
viewer.scene = sceneComponent
const scene = sceneComponent.get()
scene.background = null

const viewerContainer = document.getElementById("viewer-container") as HTMLDivElement
const rendererComponent = new OBC.PostproductionRenderer(viewer, viewerContainer)
viewer.renderer = rendererComponent

const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer)
viewer.camera = cameraComponent

const raycasterComponent = new OBC.SimpleRaycaster(viewer)
viewer.raycaster = raycasterComponent

viewer.init()
cameraComponent.updateAspect()
rendererComponent.postproduction.enabled = true

const ifcLoader = new OBC.FragmentIfcLoader(viewer)
ifcLoader.settings.wasm = {
  path: "https://unpkg.com/web-ifc@0.0.43/",
  absolute: true
}

const highlighter = new OBC.FragmentHighlighter(viewer)

highlighter.setup()

const classifier = new OBC.FragmentClassifier(viewer)
const classificationWindow = new OBC.FloatingWindow(viewer)
viewer.ui.add(classificationWindow)
classificationWindow.title = "Model Groups"

const classificationsBtn = new OBC.Button(viewer)
classificationsBtn.materialIcon = "account_tree"
classificationWindow.visible = false
//classificationsBtn.active = false

classificationsBtn.onClick.add(() => {
  classificationWindow.visible = !classificationWindow.visible
  classificationsBtn.active = classificationWindow.visible
})

async function createModelTree() {
  const fragmentTree = new OBC.FragmentTree(viewer)
  await fragmentTree.init()
  await fragmentTree.update([
    "storeys",
    "entities"
  ])
  fragmentTree.onHovered.add((fragmentMap) => {
    highlighter.highlightByID("hover", fragmentMap)
  })
  fragmentTree.onSelected.add((fragmentMap) => {
    highlighter.highlightByID("select", fragmentMap)
    console.log(fragmentMap)
    console.log(fragmentMap)
  })
  const tree = fragmentTree.get().uiElement.get("tree")
  return tree
}



ifcLoader.onIfcLoaded.add( async (model) => {
  highlighter.update()
  classifier.byStorey(model)
  classifier.byEntity(model)
  
  console.log(model.uuid)
  const tree = await createModelTree()
  await classificationWindow.slots.content.dispose(true)
  classificationWindow.addChild(tree)
  console.log(viewer.scene.components)
})

const toolbar = new OBC.Toolbar(viewer)
toolbar.addChild(
  ifcLoader.uiElement.get("main"),
  classificationsBtn
)
viewer.ui.addToolbar(toolbar)