import { Project, IProject } from "./classes/Project"
import { UserRole, Status } from "./types/types"
import { ProjectsManager } from "./classes/ProjectsManager"
import { ErrorModal } from "./classes/ErrorModal"
import { closeModal } from "./utils/utils"
import { formatDate, modifyDateInput } from "./utils/utils"
import { showModal } from "./utils/utils"
import { v4 as uuidv4 } from 'uuid'
console.log("index.ts started")

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

