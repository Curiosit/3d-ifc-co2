import { formatDate, modifyDateInput } from "./utils/utils"
import { showModal } from "./utils/utils"
import * as Router from "react-router-dom"
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { Sidebar } from "./react-components/Sidebar"
import { ProjectsPage } from "./react-components/ProjectsPage"
import { ProjectDetailsPage } from "./react-components/ProjectDetailsPage"

import { ViewerProvider } from "./react-components/IFCViewer"
import { FragmentsGroup } from "bim-fragment"

import * as OBC from "openbim-components"
import { TodoCreator } from "./bim-components/TodoCreator"
import { SimpleQto } from "./bim-components/SimpleQto"
import { ProjectsManager } from "./classes/ProjectsManager"
import { E404 } from "./react-components/E404"
import { Modal } from "./react-components/Modal"


const projectsManager = new ProjectsManager()

const rootElement = document.getElementById("app") as HTMLDivElement
const appRoot = ReactDOM.createRoot(rootElement)


appRoot.render(
  <>
    <Router.BrowserRouter>
      <ViewerProvider>
      
      <Sidebar />
      <Modal />
      <Router.Routes>
        <Router.Route path="/404" element={<E404 message="" />}></Router.Route>
        <Router.Route path="/" element={<ProjectsPage projectsManager = {projectsManager} />}></Router.Route>
        <Router.Route path="/project/:id" element={<ProjectDetailsPage projectsManager = {projectsManager} />}></Router.Route>
        
        
      </Router.Routes>
      </ViewerProvider>
    </Router.BrowserRouter>
  </>
)






