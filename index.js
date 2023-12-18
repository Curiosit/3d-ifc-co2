function showModal() {
    const modal = document.getElementById("new-project-modal")
    modal.showModal()
  }
  
  // This document object is provided by the browser, and its main purpose is to help us interact with the DOM.
  const newProjectBtn = document.getElementById("new-projects-btn")
  newProjectBtn.addEventListener("click", showModal)