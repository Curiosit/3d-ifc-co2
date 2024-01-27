import * as React from "react"

import * as OBC from "openbim-components"
import { FragmentsGroup } from "bim-fragment"
import { TodoCreator } from "../bim-components/TodoCreator"
import { Project } from "../classes/Project"
import { SimpleQto } from "../bim-components/SimpleQto"
import { CarbonTool } from "../bim-components/CarbonTool"
import { ExpressSelect } from "../bim-components/ExpressSelect"
import { Color } from "three"
import { GUI } from 'dat.gui'
import TWEEN from '@tweenjs/tween.js'
import { render } from "react-dom"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass"
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import * as THREE from "three"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader"
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass';
import * as THREE_ADDONS from 'three-addons';
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial"
import { Line2 } from "three/examples/jsm/lines/Line2"
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry';

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
    let scene

    const meshes: any[] = [];
    const createViewer = async () => {
        viewer = new OBC.Components()
        setViewer(viewer)
        
        const sceneComponent = new OBC.SimpleScene(viewer)
        sceneComponent.setup()
        viewer.scene = sceneComponent
        scene = sceneComponent.get()
        scene.background = null
        const viewerContainer = document.getElementById("viewer-container") as HTMLDivElement
        //const rendererComponent = new OBC.PostproductionRenderer(viewer, viewerContainer)
        const rendererComponent = new OBC.SimpleRenderer(viewer, viewerContainer)

        const renderer = rendererComponent.get()
        console.log(renderer)

        renderer.setPixelRatio( window.devicePixelRatio );
        
        
        viewer.renderer = rendererComponent as unknown as OBC.SimpleRenderer
        
        const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer)
        viewer.camera = cameraComponent
    
        const raycasterComponent = new OBC.SimpleRaycaster(viewer)
        viewer.raycaster = raycasterComponent
        
        const grid = new OBC.SimpleGrid(viewer);
        renderer.shadowMap.enabled = true;


        viewer.init()



        function animate() {
          requestAnimationFrame(animate);
          TWEEN.update();
        }
        animate() 



    
        const fragmentManager = new OBC.FragmentManager(viewer)
        function  exportFragments(model: FragmentsGroup) {
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
          path: "../src/web-ifc/",
          absolute: false
        }
    
        const highlighter = new OBC.FragmentHighlighter(viewer)
        highlighter.setup()
    
        const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer)
        
        
        highlighter.events.select.onHighlight.add((e) => {
          console.log(e)
          console.log("HIGHLIGHTING")

          
          
        })

        highlighter.events.select.onClear.add(async (e) => {
          console.log(e)
          await propertiesProcessor.cleanPropertiesList()
          const propsListElement = propertiesProcessor.uiElement.get("propsList")
          propsListElement.removeChild()

          
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
    


    
        async function onModelLoaded(model: FragmentsGroup) {
          highlighter.update()

          try {
            
            console.log(model)
           
          } catch (error) {
            alert(error)
          }

          
          for (const fragment of model.items) {

            meshes.push(fragment.mesh);
          }


          for (let index = 0;index < model.items.length;index++) {
              
                const element = model.items[index]
                const instancedMesh = element.mesh

                const geometry = instancedMesh.geometry;
                const material = instancedMesh.material;


                for (let i = 0; i < instancedMesh.count; i++) {
                  const mesh = new THREE.Mesh(geometry, material);

                  instancedMesh.getMatrixAt(i, mesh.matrix);

                  const position = new THREE.Vector3();
                  const rotation = new THREE.Quaternion();
                  const scale = new THREE.Vector3();
                  mesh.matrix.decompose(position, rotation, scale);

                  mesh.position.copy(position);
                  mesh.setRotationFromQuaternion(rotation);
                  mesh.scale.copy(scale);

                  const edgesGeometry = new THREE.EdgesGeometry(geometry);

                  const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x333333 });
                  const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

                  edges.position.copy(position);
                  edges.setRotationFromQuaternion(rotation);
                  edges.scale.copy(scale);

                  scene.add(edges);
                }

              
          }
          console.log(meshes)
          
          /* meshObjects = meshes.filter(obj => obj instanceof THREE.Mesh || obj instanceof THREE.InstancedMesh);

          console.log(meshObjects) */
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
          model.properties = {} 
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
            const group = await fragmentManager.load(fragmentBinary)

            
            scene.add(group);
            highlighter.update();

          })
          input.addEventListener('change', () => {
            const filesList = input.files
            if (!filesList) { return }
            reader.readAsArrayBuffer(filesList[0])
          })
          input.click()
        })
    

        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();

        var sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);

        
        viewerContainer.addEventListener('mousemove', onMouseMove, false);

        function onMouseMove(event) {
          
            
            mouse.x = (event.offsetX / viewerContainer.clientWidth) * 2 - 1;
            mouse.y = -(event.offsetY / viewerContainer.clientHeight) * 2 + 1;

            
            raycaster.setFromCamera(mouse, cameraComponent.activeCamera);
            
           
            var intersects = raycaster.intersectObjects(meshes);
   

            if (intersects.length > 0) {
                
                var intersectionPoint = intersects[0].point;

                console.log(intersectionPoint)
                sphere.position.copy(intersectionPoint.clone());
            }
        }














        const todoCreator = new TodoCreator(viewer)
        await todoCreator.setup(props.project)
        const simpleQto = new SimpleQto(viewer)
        const carbonTool = new CarbonTool(viewer)
        const expressSelect = new ExpressSelect(viewer, highlighter)
        const toolbar = new OBC.Toolbar(viewer)
        toolbar.addChild(
          ifcLoader.uiElement.get("main"),
          importFragmentBtn,
          classificationsBtn,
          propertiesProcessor.uiElement.get("main"),
          todoCreator.uiElement.get("activationButton"),
          fragmentManager.uiElement.get("main"),
          simpleQto.uiElement.get("activationBtn"),
          carbonTool.uiElement.get("activationBtn"),
          expressSelect.uiElement.get("activationBtn"),
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