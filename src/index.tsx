
import * as Router from "react-router-dom"
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { Sidebar } from "./react-components/Sidebar"
import { ProjectsPage } from "./react-components/ProjectsPage"
import { ProjectDetailsPage } from "./react-components/ProjectDetailsPage"
import { ViewerProvider } from "./react-components/IFCViewer"
import { ProjectsManager } from "./classes/ProjectsManager"
import { E404 } from "./react-components/E404"
import { MaterialsPage } from "./react-components/MaterialsPage"
import { MaterialPage } from "./react-components/MaterialPage"
import { ComponentsPage } from "./react-components/ComponentsPage"


const projectsManager = new ProjectsManager()

const rootElement = document.getElementById("app") as HTMLDivElement
const appRoot = ReactDOM.createRoot(rootElement)


appRoot.render(
  <>
    <Router.BrowserRouter>
      <ViewerProvider>
      
      <Sidebar />
      
      <Router.Routes>
        <Router.Route path="/3d-ifc-co2/404" element={<E404 message="" />}></Router.Route>
        <Router.Route path="/3d-ifc-co2/" element={<ProjectsPage projectsManager = {projectsManager} />}></Router.Route>
        <Router.Route path="/3d-ifc-co2/project/:id" element={<ProjectDetailsPage projectsManager = {projectsManager} />}></Router.Route>
        <Router.Route path="/3d-ifc-co2/materials" element={<MaterialsPage />}></Router.Route>
        <Router.Route path="/3d-ifc-co2/materials/:id" element={<MaterialPage />}></Router.Route>
        <Router.Route path="/3d-ifc-co2/components" element={<ComponentsPage />}></Router.Route>
      </Router.Routes>
      </ViewerProvider>
    </Router.BrowserRouter>
  </>
)






