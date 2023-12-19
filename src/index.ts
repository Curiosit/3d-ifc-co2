import { Project } from "./classes/Project"

function showModal(id) {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    modal.showModal()
  } else {
    console.warn("The provided modal wasn't found. ID: ", id)
  }
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
  projectForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const formData = new FormData(projectForm)
    const projectData = {
      name: formData.get("name"),
      description: formData.get("description"),
      status: formData.get("status"),
      userRole: formData.get("userRole"),
      finishDate: formData.get("finishDate")
    }
    const project = new Project(projectData)
    console.log(project)
  })
} else {
	console.warn("The project form was not found. Check the ID!")
}