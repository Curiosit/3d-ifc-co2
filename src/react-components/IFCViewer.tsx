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
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
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
    
        //const highlighter = new OBC.FragmentHighlighter(viewer)
        //highlighter.setup()
    
        const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer)
        
        /* 
        highlighter.events.select.onHighlight.add((e) => {
          console.log(e)
          console.log("HIGHLIGHTING")

          
          
        })

        highlighter.events.select.onClear.add(async (e) => {
          console.log(e)
          await propertiesProcessor.cleanPropertiesList()
          const propsListElement = propertiesProcessor.uiElement.get("propsList")
          propsListElement.removeChild()

          
        }) */
        

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
            //highlighter.highlightByID("hover", fragmentMap)
            
          })
          fragmentTree.onSelected.add((fragmentMap) => {
            
            //highlighter.highlightByID("select", fragmentMap)
          })
          const tree = fragmentTree.get().uiElement.get("tree")
          return tree
        }
    


    
        async function onModelLoaded(model: FragmentsGroup) {
          //highlighter.update()

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

                  const edgesGeometry = new THREE.EdgesGeometry(geometry, 18);

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
          //carbonTool.properties = properties
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
              //carbonTool.properties = properties
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
            //highlighter.update();

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
        //scene.add(sphere);

        let pegman
        const loader = new GLTFLoader()
        loader.load(
          // resource URL
          '.././assets/scene.gltf',
          // called when the resource is loaded
          function ( gltf ) {
        
            scene.add( gltf.scene );
        
            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object
            pegman = gltf.scene
            const scale = 0.025
            pegman.scale.set(scale, scale, scale);
          },
          // called while loading is progressing
          function ( xhr ) {
        
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        
          },
          // called when loading has errors
          function ( error ) {
        
            console.log( 'An error happened' );
        
          }
        );

        
        viewerContainer.addEventListener('mousemove', onMouseMove, false);
        //viewerContainer.addEventListener('click', onMouseClick, false);



            var mDragging = false;
            var mDown = false;

            window.addEventListener('mousedown', function () {
                mDown = true;
            });
            window.addEventListener('mousemove', function () {
                if(mDown) {
                    mDragging = true;
                }
            });
            window.addEventListener('mouseup', function(event) {
                // If not dragging, then it's a click!
                if(mDragging === false) {
                    // Perform all your click calculations here
                    onMouseClick(event)
                }

                // Reset variables
                mDown = false;
                mDragging = false;
            });

        function onMouseMove(event) {
          
            
            mouse.x = (event.offsetX / viewerContainer.clientWidth) * 2 - 1;
            mouse.y = -(event.offsetY / viewerContainer.clientHeight) * 2 + 1;

            
            raycaster.setFromCamera(mouse, cameraComponent.activeCamera);
            
           
            var intersects = raycaster.intersectObjects(meshes);
   

            if (intersects.length > 0) {
                
                var intersectionPoint = intersects[0].point;

                //console.log(intersectionPoint)
                const pegmanLocation = {
                  x: intersectionPoint.x,
                  y: intersectionPoint.y,
                  z: intersectionPoint.z,
                }
                pegman.position.copy(pegmanLocation);
            }
        }

        function onMouseClick(event) {
          mouse.x = (event.offsetX / viewerContainer.clientWidth) * 2 - 1;
          mouse.y = -(event.offsetY / viewerContainer.clientHeight) * 2 + 1;

            
            raycaster.setFromCamera(mouse, cameraComponent.activeCamera);
            
           
            var intersects = raycaster.intersectObjects(meshes);
   

            if (intersects.length > 0) {
                
                var intersectionPoint = intersects[0].point;

                console.log("clicked point ", intersectionPoint)
                const newCameraLocation = {
                  x: intersectionPoint.x,
                  y: intersectionPoint.y+1.7,
                  z: intersectionPoint.z,
                }
                console.log("new camera point ", newCameraLocation)
                tweenCamera(newCameraLocation as THREE.Vector3)
            }
        }
        setNavigationMode('FirstPerson')
        function setNavigationMode(navMode) {
          cameraComponent.setNavigationMode(navMode);
        }

        function tweenCamera(finalPosition: THREE.Vector3) {
          
          const position = new THREE.Vector3()
            cameraComponent.controls.getPosition(position)
            const startPosition = {
                x: position.x,
                y: position.y,
                z: position.z,
            };

            const finalLocation = {
              x: finalPosition.x,
                y: finalPosition.y,
                z: finalPosition.z,
            }
            console.log("Camera position: ", position.x,
            position.y,
          position.z)
          const target = new THREE.Vector3()
          cameraComponent.controls.getTarget(target)
          const startTarget = {
                x: target.x,
                y: target.y,
                z: target.z,
            };
            console.log("start target ", startTarget)
            const deltaPosition = {
              x: finalPosition.x - position.x,
              y: finalPosition.y - position.y,
              z: finalPosition.z - position.z,
            }
            console.log("delta positiont ", deltaPosition)
            const finalTarget = {
              x: startTarget.x + deltaPosition.x,
              y: startTarget.y + deltaPosition.y,
              z: startTarget.z + deltaPosition.z,
            }
            console.log("final target ", finalTarget)
            /* const targetPosition = {
                x: this.todoCamera.position.x,
                y: this.todoCamera.position.y,
                z: this.todoCamera.position.z,
            }; */
    
            // Create a new TWEEN animation
            const tweenValues = {
              startX: startPosition.x,
              startY: startPosition.y,
              startZ: startPosition.z,
              targetX: startTarget.x,
              targetY: startTarget.y,
              targetZ: startTarget.z
            };
            const tweenFinal = {
              finalX: finalLocation.x,
              finalY: finalLocation.y,
              finalZ: finalLocation.z,
              targetX: finalTarget.x,
              targetY: finalTarget.y,
              targetZ: finalTarget.z
            };

            const positionTween = new TWEEN.Tween({ x: startPosition.x, y: startPosition.y, z: startPosition.z });
            const targetTween = new TWEEN.Tween({ x: startTarget.x, y: startTarget.y, z: startTarget.z });

            positionTween.to({ x: finalLocation.x, y: finalLocation.y, z: finalLocation.z }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate((obj) => {
              cameraComponent.controls.setPosition(obj.x, obj.y, obj.z);
            })
            .start();

            targetTween.to({ x: finalTarget.x, y: finalTarget.y, z: finalTarget.z }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate((obj) => {
              cameraComponent.controls.setTarget(obj.x, obj.y, obj.z);
            })
            .start();
                      
            /* new TWEEN.Tween(tweenValues)
                .to(tweenFinal, 1000) // Set the duration of the tween (in milliseconds)
                .easing(TWEEN.Easing.Quadratic.Out) // Set the easing function (you can choose a different one)
                .onUpdate(() => {
                  console.log("Tweening: ",  {
                  startx: tweenValues.startX, 
                  starty: tweenValues.startY, 
                  startz: tweenValues.startZ, 
                  targetx: tweenValues.targetX,
                  targety: tweenValues.targetY,
                  targetz: tweenValues.targetZ})  
                  cameraComponent.controls.setLookAt(
                    tweenValues.startX, 
                    tweenValues.startY, 
                    tweenValues.startZ, 
                    tweenValues.targetX,
                    tweenValues.targetY,
                    tweenValues.targetZ,);
                })
                .onComplete(() => {
                    
                    console.log("Tween complete!");
                })
                .start(); */
        }














        const todoCreator = new TodoCreator(viewer)
        await todoCreator.setup(props.project)
        //const simpleQto = new SimpleQto(viewer)
        //const carbonTool = new CarbonTool(viewer)
        //const expressSelect = new ExpressSelect(viewer, highlighter)
        const toolbar = new OBC.Toolbar(viewer)
        toolbar.addChild(
          ifcLoader.uiElement.get("main"),
          importFragmentBtn,
          classificationsBtn,
          propertiesProcessor.uiElement.get("main"),
          todoCreator.uiElement.get("activationButton"),
          fragmentManager.uiElement.get("main"),
          //simpleQto.uiElement.get("activationBtn"),
          //carbonTool.uiElement.get("activationBtn"),
          //expressSelect.uiElement.get("activationBtn"),
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