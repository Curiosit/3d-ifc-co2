import { Project, IProject } from "./classes/Project"
import { UserRole, Status } from "./types/types"
import { ProjectsManager } from "./classes/ProjectsManager"
import { ErrorModal } from "./classes/ErrorModal"
import { closeModal } from "./utils/utils"
import { formatDate, modifyDateInput } from "./utils/utils"
import { showModal } from "./utils/utils"
import { v4 as uuidv4 } from 'uuid'

import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { Sidebar } from "./react-components/Sidebar"
import { ProjectsPage } from "./react-components/ProjectsPage"

import { OBJLoader} from "three/examples/jsm/loaders/OBJLoader"
import { MTLLoader} from "three/examples/jsm/loaders/MTLLoader"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as THREE from "three"

import { FragmentsGroup } from "bim-fragment"

import * as OBC from "openbim-components"
import { TodoCreator } from "./bim-components/TodoCreator"
import { SimpleQto } from "./bim-components/SimpleQto"

const rootElement = document.getElementById("app") as HTMLDivElement
const appRoot = ReactDOM.createRoot(rootElement)
appRoot.render(
  <>
    <Sidebar /><ProjectsPage />
  </>
)


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

const fragmentManager = new OBC.FragmentManager(viewer)
function exportFragments(model: FragmentsGroup ) {
  const fragmentsBinaryData = fragmentManager.export(model)
  const blob = new Blob([fragmentsBinaryData]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${model.name.replace(".ifc", "")}.frag`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportJSON (model: FragmentsGroup) {
  const json = JSON.stringify(model.properties, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${model.name.replace(".ifc", "")}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importJSON (model) {
  const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const json = reader.result as string;
      if (!json) {
        return;
      }
      const loadedModel =  { ...model, properties:JSON.parse(json)};
      onModelLoaded(loadedModel) 
      return;
      
    });
    input.addEventListener("change", () => {
      const filesList = input.files;
      if (!filesList) {
        return;
      }
      reader.readAsText(filesList[0]);
    });
    input.click();
    
}

const ifcLoader = new OBC.FragmentIfcLoader(viewer)
ifcLoader.settings.wasm = {
  path: "https://unpkg.com/web-ifc@0.0.44/",
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
    "model",
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

const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer)
const qtyList = new SimpleQto(viewer)

highlighter.events.select.onClear.add(() => {
  propertiesProcessor.cleanPropertiesList()
})

const culler = new OBC.ScreenCuller(viewer)
cameraComponent.controls.addEventListener("sleep", () => {
  culler.needsUpdate = true
})

async function onModelLoaded(model: FragmentsGroup) {
  console.log("Model loaded")
  highlighter.update()

  for(const fragment of model.items) {
    culler.add(fragment.mesh)
  }
  culler.needsUpdate = true

  try {
    classifier.byModel(model.name, model)
    classifier.byStorey(model)
    classifier.byEntity(model)

    const tree = await createModelTree()
    await classificationWindow.slots.content.dispose(true)
    classificationWindow.addChild(tree)
    

    propertiesProcessor.process(model)
    
    highlighter.events.select.onHighlight.add((fragmentMap) => {
      const expressID = [...Object.values(fragmentMap)[0]][0]
      propertiesProcessor.renderProperties(model, Number(expressID))
    })
  } catch (error) {
    showModal("error-modal", true, error)
  }
  console.log (model)
  
  
}

ifcLoader.onIfcLoaded.add( async (model) => {
  exportFragments(model)
  exportJSON(model)
  console.log(model)
  onModelLoaded(model)
})

fragmentManager.onFragmentsLoaded.add((model) => {
  model.properties = {} // From JSON file exported from the IFC!
  importJSON(model)
  console.log(model)
  onModelLoaded(model)
})

const importFragmentBtn = new OBC.Button(viewer)
importFragmentBtn.materialIcon = "upload"
importFragmentBtn.tooltip = "Load .frag file"

importFragmentBtn.onClick.add(() => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".frag";
  const reader = new FileReader();
  reader.addEventListener("load", async () => {
    const binary = reader.result;
      if (!(binary instanceof ArrayBuffer)) {
        return;
      }
      const fragmentBinary = new Uint8Array(binary)
      await fragmentManager.load(fragmentBinary)
  });
  input.addEventListener("change", () => {
      const filesList = input.files;
      if (!filesList) {
        return;
      }
      reader.readAsArrayBuffer(filesList[0]);
  });
  input.click();
})


/* const importJSONBtn = new OBC.Button(viewer)
importJSONBtn.materialIcon = "book"
importJSONBtn.tooltip = "Load .json file"

importJSONBtn.onClick.add(() => { 
  
}) */

const todoCreator = new TodoCreator(viewer)
await todoCreator.setup()


const propsFinder = new OBC.IfcPropertiesFinder(viewer)
await propsFinder.init()
propsFinder.onFound.add((fragmentIDMap) => {
  highlighter.highlightByID("select", fragmentIDMap)
})



const toolbar = new OBC.Toolbar(viewer)
toolbar.addChild(
  ifcLoader.uiElement.get("main"),
  importFragmentBtn,
  classificationsBtn,
  
  propertiesProcessor.uiElement.get("main"),
  propsFinder.uiElement.get("main"),
  fragmentManager.uiElement.get("main"),
  todoCreator.uiElement.get("activationButton"),
  qtyList.uiElement.get("activationBtn")
)
viewer.ui.addToolbar(toolbar)