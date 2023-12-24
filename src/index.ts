import { Project, IProject, UserRole, ProjectStatus } from "./classes/Project"
import { ProjectsManager } from "./classes/ProjectsManager"
import { ErrorModal } from "./classes/ErrorModal"
import { formatDate, modifyDateInput } from "./utils/utils"
console.log("index.ts started")
function showModal(id, errorModal = false, msg = '') {
  const modal = document.getElementById(id)
  console.log(id)
  if (modal && modal instanceof HTMLDialogElement) {
    if (errorModal) {
      const errorModal = new ErrorModal(modal, msg, id)
    }
    modal.showModal()
    
  } else {
    console.warn("The provided modal wasn't found. ID: ", id)
  }
}

export function closeModal(id) {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    modal.close()
  } else {
    console.warn("The provided modal wasn't found. ID: ", id)
  }
}


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

const projectForm = document.getElementById("new-project-form")
if (projectForm && projectForm instanceof HTMLFormElement) {
  const currentDateInput = document.getElementById("current-date") as HTMLInputElement
  const today = new Date();
  const nextYear = new Date(today.setFullYear(today.getFullYear() + 1));
  modifyDateInput(currentDateInput, nextYear)
  
  console.log("projectForm found")
  const closeNewProjectBtn = document.getElementById("close-new-project-modal-btn")
  if (closeNewProjectBtn) {
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
      status: formData.get("status") as ProjectStatus,
      userRole: formData.get("userRole") as UserRole,
      finishDate: finishDate,
      createdDate: new Date(),
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