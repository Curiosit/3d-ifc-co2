import { IProject, Project } from "./Project";
import { v4 as uuidv4 } from "uuid";
import {
  convertPercentageStringToNumber,
  formatDate,
  isFirstCharacterLetterOrNumber,
  convertCurrencyStringToNumber,
} from "../utils/utils";
import { closeModal } from "../utils/utils";
import { Status, UserRole } from "../types/types";
import { showModal } from "../utils/utils";
export class ProjectsManager {
  list: Project[] = [];
  id: string;
  ui: HTMLElement;
  currentProject: Project;
  constructor(container: HTMLElement) {
    this.ui = container;
    this.id = uuidv4();
    console.log(`Project Manager is running, with id: ${this.id}`);
    console.log(this.list);
  }

  newProject(data: IProject) {
    const projectNames = this.list.map((project) => {
      return project.name;
    });
    const nameInUse = projectNames.includes(data.name);
    if (nameInUse) {
      throw new Error(`A project with the name "${data.name}" already exists`);
    }

    if (data.name.length < 5) {
      throw new Error(`Name "${data.name}" has to be 5 characters or longer!`);
    }

    if (!isFirstCharacterLetterOrNumber(data.name)) {
      throw new Error(
        `Name "${data.name}" has to start with a letter or number!`
      );
    }

    const project = new Project(data);
    project.ui.addEventListener("click", () => {
      const projectsPage = document.getElementById("projects-page");
      const detailsPage = document.getElementById("project-details");
      if (!projectsPage || !detailsPage) {
        return;
      }
      projectsPage.style.display = "none";
      detailsPage.style.display = "flex";
      this.currentProject = project;
      this.setDetailsPage(project);
    });
    this.ui.append(project.ui);
    this.list.push(project);

    return project;
  }
  createProjectFromData(projectData: Project) {
    const project = new Project(projectData);
    project.ui.addEventListener("click", () => {
      const projectsPage = document.getElementById("projects-page");
      const detailsPage = document.getElementById("project-details");
      if (!projectsPage || !detailsPage) {
        return;
      }
      projectsPage.style.display = "none";
      detailsPage.style.display = "flex";
      this.currentProject = project;
      this.setDetailsPage(project);
    });
    this.ui.append(project.ui);
    this.list.push(project);
  }

  updateProjectData(projectData: Project, id: string) {
    console.log("updating project data");
    const foundProject = this.list.find((project) => project.id === id);

    if (foundProject) {
      console.log("Found project: ");
      console.log(foundProject);
      foundProject.updateProject(projectData);
      const foundUI = document.getElementById(id);
      if (foundUI) {
        console.log(`Found UI of a project with id ${id} `);
        console.log(foundUI);
        foundUI.innerHTML = foundProject.ui.innerHTML;
      } else {
        console.log(`UI of a project with id ${id} not found!`);
      }
    } else {
      throw new Error(`A project with an id: ${id} has not been found`);
    }
  }

  setupEditProjectModal() {
    const editModal = document.getElementById("edit-project-modal");
    if (!editModal) {
      return;
    }
    const name = editModal.querySelector(
      "[data-edit-project-info='name']"
    ) as HTMLInputElement;
    if (name) {
      name.value = this.currentProject.name;
    }
    const description = editModal.querySelector(
      "[data-edit-project-info='description']"
    ) as HTMLInputElement;
    if (description) {
      description.value = this.currentProject.description;
    }

    const status = editModal.querySelector(
      "[data-edit-project-info='status']"
    ) as HTMLInputElement;
    if (status) {
      status.value = this.currentProject.status;
    }

    const userRole = editModal.querySelector(
      "[data-edit-project-info='userRole']"
    ) as HTMLInputElement;
    if (userRole) {
      userRole.value = this.currentProject.userRole;
    }

    const progress = editModal.querySelector(
      "[data-edit-project-info='progress']"
    ) as HTMLInputElement;
    if (progress) {
      progress.value = this.currentProject.progress * 100 + "%";
    }

    const finishDate = editModal.querySelector(
      "[data-edit-project-info='finishDate']"
    ) as HTMLInputElement;
    if (finishDate) {
      finishDate.value = new Date(
        this.currentProject.finishDate
      ).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }

    const createdDate = editModal.querySelector(
      "[data-edit-project-info='createdDate']"
    ) as HTMLInputElement;
    if (createdDate) {
      createdDate.value = new Date(
        this.currentProject.createdDate
      ).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }

    const cost = editModal.querySelector(
      "[data-edit-project-info='cost']"
    ) as HTMLInputElement;
    if (cost) {
      cost.textContent = "$ " + this.currentProject.cost;
      cost.value = "$ " + this.currentProject.cost;
    }

    const closeEditProjectBtn = document.getElementById(
      "close-edit-project-modal-btn"
    );
    if (closeEditProjectBtn) {
      closeEditProjectBtn.addEventListener("click", () => {
        console.log("Closing modal...");
        closeModal("edit-project-modal");
      });
    } else {
      console.warn("Close modal button was not found");
    }
    const editProjectForm = document.getElementById("edit-project-form");
    if (editProjectForm && editProjectForm instanceof HTMLFormElement) {
      console.log("Listening for submit...");
      editProjectForm.addEventListener("submit", (e) => {
        console.log("event listener fired");
        e.preventDefault();
        const editFormData = new FormData(editProjectForm);
        console.log("Cost:");

        console.log(editFormData.get("cost"));
        try {
          const projectData: IProject = {
            name: editFormData.get("name") as string,
            description: editFormData.get("description") as string,
            status: editFormData.get("status") as Status,
            userRole: editFormData.get("userRole") as UserRole,
            finishDate: new Date(editFormData.get("finishDate") as string),
            createdDate: new Date(editFormData.get("createdDate") as string),
            cost: convertCurrencyStringToNumber(
              editFormData.get("cost") as string
            ) as number,
            progress: convertPercentageStringToNumber(
              editFormData.get("progress") as string
            ) as number,
            toDoList: [],
            id: this.currentProject.id,
          };

          this.currentProject.updateProject(projectData);

          this.replaceProjectById(this.list);

          this.setDetailsPage(this.currentProject);
          this.renderProjectList(this.list);
          closeModal("edit-project-modal");
        } catch (err) {
          showModal("error-modal", true, err);
        }
      });
    }
  }

  private setDetailsPage(project: Project) {
    const detailsPage = document.getElementById("project-details");
    if (!detailsPage) {
      return;
    }
    const name = detailsPage.querySelector(
      "[data-project-info='name']"
    ) as HTMLElement;
    if (name) {
      name.textContent = project.name;
    }

    const description = detailsPage.querySelector(
      "[data-project-info='description']"
    );
    if (description) {
      description.textContent = project.description;
    }

    const status = detailsPage.querySelector("[data-project-info='status']");
    if (status) {
      status.textContent = project.status;
    }

    const userRole = detailsPage.querySelector(
      "[data-project-info='userRole']"
    );
    if (userRole) {
      userRole.textContent = project.userRole;
    }

    const finishDate = detailsPage.querySelector(
      "[data-project-info='finishDate']"
    );
    if (finishDate) {
      finishDate.textContent = formatDate(project.finishDate);
    }

    const createdDate = detailsPage.querySelector(
      "[data-project-info='createdDate']"
    );
    if (createdDate) {
      createdDate.textContent = formatDate(project.createdDate);
    }

    const cost = detailsPage.querySelector("[data-project-info='cost']");
    if (cost) {
      cost.textContent = "$ " + project.cost;
    }

    const progress = detailsPage.querySelector(
      "[data-project-info='progress']"
    ) as HTMLElement;
    if (progress) {
      progress.textContent = project.progress * 100 + "%";
      progress.style.width = project.progress * 100 + "%";
      console.log(progress.style);
    }

    const initials = detailsPage.querySelector(
      "[data-project-info='initials']"
    ) as HTMLElement;
    if (initials) {
      initials.textContent = project.initials;
      initials.style.backgroundColor = project.inColor;

      console.log(initials.style);
    }

    const addTaskButton = document.getElementById("add-to-do-btn");
    if (addTaskButton) {
      addTaskButton.addEventListener("click", () => {
        showModal("add-to-do-modal");
        this.setupAddToDoModal();
      });
    }
  }
  setupAddToDoModal() {
    try {
      const addToDoModal = document.getElementById("add-to-do-modal");
    } catch (err) {
      console.log(err);
    }
  }

  getProject(id: string) {
    const project = this.list.find((project) => {
      return project.id === id;
    });
    return project;
  }

  deleteProject(id: string) {
    const project = this.getProject(id);
    if (!project) {
      return;
    }
    project.ui.remove();
    const remaining = this.list.filter((project) => {
      return project.id !== id;
    });
    this.list = remaining;
  }

  editProject(id: string) {
    const project = this.getProject(id);
    if (!project) {
      return;
    }
  }
  replaceProjectById(projectList) {
    const index = projectList.findIndex((project) => project.id === this.id);

    if (index !== -1) {
      // If the project with the given id is found, replace it with the new project
      projectList[index] = this;
      projectList[index].setUI();
    } else {
      // If the project is not found, you may want to push the new project to the list
      //projectList.push(newProject);
    }
  }

  exportToJSON(fileName: string = "projects") {
    const json = JSON.stringify(this.list, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  importFromJSON() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const json = reader.result;
      if (!json) {
        return;
      }
      const projects: IProject[] = JSON.parse(json as string);
      this.renderProjectList(projects);
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

  renderProjectList(projects: IProject[]) {
    console.log(projects);
    for (const project of projects) {
      try {
        console.log("trying rendering project list");
        if (project.id != "") {
          console.log(`project id not empty: ${project.id}`);
          const foundProject = this.list.find(
            (listedProject) => listedProject.id === project.id
          );
          if (foundProject) {
            console.log("Found project with this id");
            const updatedProjectData = new Project(project);
            this.updateProjectData(updatedProjectData, project.id);
            console.log("updated project data");
          } else {
            const projectSetup = this.newProject(project);
            console.log(projectSetup);
          }
        } else {
          const projectSetup = this.newProject(project);
          console.log(projectSetup);
        }

        console.log(this.ui);
        console.log(this.list);
      } catch (error) {
        console.log(error);
      }
    }
  }
}
