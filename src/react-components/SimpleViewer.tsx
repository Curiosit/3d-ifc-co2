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

        console.log(window.devicePixelRatio)
        renderer.setPixelRatio( window.devicePixelRatio );

        
        function resizeRendererToDisplaySize(renderer) {
          const canvas = renderer.domElement;
          const pixelRatio = window.devicePixelRatio;
          const width  = canvas.clientWidth  * pixelRatio | 0;
          const height = canvas.clientHeight * pixelRatio | 0;
          const needResize = canvas.width !== width || canvas.height !== height;
          if (needResize) {
            renderer.setSize(width, height, false);
          }
          return needResize;
        }

        
        viewer.renderer = rendererComponent as unknown as OBC.SimpleRenderer
        

				
        
        const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer)
        viewer.camera = cameraComponent
    
        const raycasterComponent = new OBC.SimpleRaycaster(viewer)
        viewer.raycaster = raycasterComponent
        

        renderer.shadowMap.enabled = true;
        const boxMaterial = new THREE.MeshStandardMaterial({ color: '#6528D7' });
        const boxGeometry = new THREE.BoxGeometry(5,5,5)
        const cube = new THREE.Mesh(boxGeometry, boxMaterial);


        function addSpheresToGeometry(object, color) {
          var geometry = object.geometry
          var spheres: any[] = []
          if (geometry && geometry.attributes && geometry.attributes.position) {

            var positions = geometry.attributes.position.array;
            var sphereMaterial = new THREE.MeshBasicMaterial({
              color: color,
            });
            
            const positionss = object.geometry.attributes.position;


            const worldPositions: THREE.Vector3[] = [];

            
            for (var i = 0; i < positions.length; i += 3) {
              var x = positions[i];
              var y = positions[i + 1];
              var z = positions[i + 2];
              console.log("Vertice ", x, y, z)

              const dotGeometry = new THREE.BufferGeometry();
              dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([x,y,z]), 3));
              const dotMaterial = new THREE.PointsMaterial({ size: 0.3, color: 0xff0000 });
              const dot = new THREE.Points(dotGeometry, dotMaterial);
              scene.add(dot);

            }
          }
          return spheres
        }

        function process (mesh) {
          const geometry = mesh.geometry
          console.log(geometry)
          addSpheresToGeometry(mesh, 0xff0000)
          const edges = new THREE.EdgesGeometry(geometry);
                
          const line2 = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color : 0x333333 }));
          scene.add(line2)
        }
       

        viewer.init()



        function animate() {
          requestAnimationFrame(animate);
          TWEEN.update();
          
          
        }


        cameraComponent.updateAspect()


    
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
          console.log("STOPPING HIGHLIGHTING")
          await propertiesProcessor.cleanPropertiesList()
          const propsListElement = propertiesProcessor.uiElement.get("propsList")
          propsListElement.removeChild()

          for (const prop in propsListElement) {

          }
          
        })
        

    
        
 
 

     
       
      
    
        async function onModelLoaded(model: FragmentsGroup) {
          highlighter.update()

          try {
            
            console.log(model)
           
          } catch (error) {
            alert(error)
          }

          const meshes: any[] = [];
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

          const meshes2: any[] = [];
          for (const mesh of meshes) {
            
            meshes2.push(mesh);
          }
          console.log(meshes2)



        }
    
        ifcLoader.onIfcLoaded.add(async (model) => {
          exportFragments(model)
          exportJSON(model)
          console.log(properties)
          onModelLoaded(model)
        })
    
        fragmentManager.onFragmentsLoaded.add((model) => {
          model.properties = {} 
          importJSON(model)
          onModelLoaded(model)
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
            function isOdd(number) {
              return number % 2 !== 0;
            }
            
          })
          input.addEventListener('change', () => {
            const filesList = input.files
            if (!filesList) { return }
            reader.readAsArrayBuffer(filesList[0])
          })
          input.click()
        })

        const toolbar = new OBC.Toolbar(viewer)
        toolbar.addChild(
          ifcLoader.uiElement.get("main"),
          importFragmentBtn,

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