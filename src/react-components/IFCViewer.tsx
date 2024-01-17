import * as React from "react"

import * as OBC from "openbim-components"
import { FragmentsGroup } from "bim-fragment"
import { TodoCreator } from "../bim-components/TodoCreator"
import { Project } from "../classes/Project"
import { SimpleQto } from "../bim-components/SimpleQto"
import { CarbonTool } from "../bim-components/CarbonTool"

interface Props {
  project: Project
}

interface IViewerContext {
    viewer: OBC.Components | null,
    setViewer: (viewer: OBC.Components | null) => void
}

export const ViewerContext = React.createContext<IViewerContext>({
    viewer: null, 
    setViewer: () => {}
})

export function ViewerProvider (props: {children: React.ReactNode}) {
    const [viewer, setViewer] = React.useState<OBC.Components | null>(null)
    return (
        <ViewerContext.Provider value={{
            viewer,setViewer
        }} >
            { props.children }
        </ViewerContext.Provider >
    )
}




export function IFCViewer(props: Props) {
    let properties
    const { setViewer } = React.useContext(ViewerContext)
    let viewer: OBC.Components
    
    const createViewer = async () => {
        viewer = new OBC.Components()
        setViewer(viewer)
        
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
        function exportFragments(model: FragmentsGroup) {
          const fragmentBinary = fragmentManager.export(model)
          const blob = new Blob([fragmentBinary])
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${model.name.replace(".ifc", "")}.frag`
          a.click()
          URL.revokeObjectURL(url)
        }
    
        const ifcLoader = new OBC.FragmentIfcLoader(viewer)
        ifcLoader.settings.wasm = {
          path: "https://unpkg.com/web-ifc@0.0.44/",
          absolute: true
        }
    
        const highlighter = new OBC.FragmentHighlighter(viewer)
        highlighter.setup()
    
        const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer)
        
        
        highlighter.events.select.onHighlight.add(() => {
          
        })

        highlighter.events.select.onClear.add(async (e) => {
          console.log(e)
          await propertiesProcessor.cleanPropertiesList()
          const propsListElement = propertiesProcessor.uiElement.get("propsList")
          propsListElement.removeChild()
          console.log(propsListElement)
          for (const prop in propsListElement) {
            console.log(prop)
          }
          
        })
        

        const classifier = new OBC.FragmentClassifier(viewer)
        const classificationWindow = new OBC.FloatingWindow(viewer)
        classificationWindow.visible = false
        viewer.ui.add(classificationWindow)
        classificationWindow.title = "Model Groups"
    
        const classificationsBtn = new OBC.Button(viewer)
        classificationsBtn.materialIcon = "account_tree"
    
        classificationsBtn.onClick.add(() => {
          classificationWindow.visible = !classificationWindow.visible
          classificationsBtn.active = classificationWindow.visible
        })
    
        async function createModelTree() {
          const fragmentTree = new OBC.FragmentTree(viewer)
          await fragmentTree.init()
          await fragmentTree.update(["storeys", "entities"])
          fragmentTree.onHovered.add((fragmentMap) => {
            highlighter.highlightByID("hover", fragmentMap)
          })
          fragmentTree.onSelected.add((fragmentMap) => {
            highlighter.highlightByID("select", fragmentMap)
          })
          const tree = fragmentTree.get().uiElement.get("tree")
          return tree
        }
    
        const culler = new OBC.ScreenCuller(viewer)
        cameraComponent.controls.addEventListener("sleep", () => {
          culler.needsUpdate = true
        })
    
        async function onModelLoaded(model: FragmentsGroup) {
          highlighter.update()
          
          for (const fragment of model.items) {culler.add(fragment.mesh)}
          culler.needsUpdate = true
    
          try {
            classifier.byStorey(model)
            classifier.byEntity(model)
            const tree = await createModelTree()
            await classificationWindow.slots.content.dispose(true)
            classificationWindow.addChild(tree)
          
            propertiesProcessor.process(model)
            highlighter.events.select.onHighlight.add((fragmentMap) => {
              const expressID = [...Object.values(fragmentMap)[0]][0]
              propertiesProcessor.renderProperties(model, Number(expressID))
              console.log(propertiesProcessor.getProperties(model, String(expressID)))
            })
          } catch (error) {
            alert(error)
          }
          todoCreator.update()
        }
    
        ifcLoader.onIfcLoaded.add(async (model) => {
          exportFragments(model)
          exportJSON(model)
          properties = model.properties
          carbonTool.properties = properties
          console.log(properties)
          onModelLoaded(model)
        })
    
        fragmentManager.onFragmentsLoaded.add((model) => {
          model.properties = {} //Get this from a JSON file exported from the IFC first load!
          importJSON(model)
          
        })

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
              console.log(model)
              model.properties = JSON.parse(json)
              const loadedModel =  { ...model, properties:JSON.parse(json)};
              console.log(loadedModel)
              //console.log(loadedModel.properties)
              properties = loadedModel.properties
              carbonTool.properties = properties
              console.log(properties)
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
    
        const importFragmentBtn = new OBC.Button(viewer)
        importFragmentBtn.materialIcon = "upload"
        importFragmentBtn.tooltip = "Load FRAG"
    
        importFragmentBtn.onClick.add(() => {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = '.frag'
          const reader = new FileReader()
          reader.addEventListener("load", async () => {
            const binary = reader.result
            if (!(binary instanceof ArrayBuffer)) { return }
            const fragmentBinary = new Uint8Array(binary)
            await fragmentManager.load(fragmentBinary)
          })
          input.addEventListener('change', () => {
            const filesList = input.files
            if (!filesList) { return }
            reader.readAsArrayBuffer(filesList[0])
          })
          input.click()
        })
    
        const todoCreator = new TodoCreator(viewer)
        await todoCreator.setup(props.project)
    
        const simpleQto = new SimpleQto(viewer)


        const carbonTool = new CarbonTool(viewer)
        
        //carbonTool.getQuantities()
        const toolbar = new OBC.Toolbar(viewer)
        toolbar.addChild(
          ifcLoader.uiElement.get("main"),
          importFragmentBtn,
          classificationsBtn,
          propertiesProcessor.uiElement.get("main"),
          todoCreator.uiElement.get("activationButton"),
          fragmentManager.uiElement.get("main"),
          simpleQto.uiElement.get("activationBtn"),
          carbonTool.uiElement.get("activationBtn")
        )
        viewer.ui.addToolbar(toolbar)
        
      }
    viewer = new OBC.Components()
    React.useEffect(() => {
        createViewer()
        
        return () => {
            
            viewer.dispose()
            setViewer(null)
        }
      }, [])

    


      


    return (
        <div
            id="viewer-container"
            className="dashboard-card"
            style={{ minWidth: 0, position: "relative" }}
        />
    )
}