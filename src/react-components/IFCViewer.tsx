import * as React from "react"
import * as OBC from "openbim-components"
import { FragmentsGroup } from "bim-fragment"
import { TodoCreator } from "../bim-components/TodoCreator"
import { Project } from "../classes/Project"
import { CarbonTool } from "../bim-components/CarbonTool"
import TWEEN from '@tweenjs/tween.js'
import * as THREE from "three"


//import { WalkingCameraTool } from "../bim-components/WalkingCameraTool"
import html2canvas from "html2canvas"
interface Props {
  project: Project,
  updateDimensions: boolean
}

interface IViewerContext {
  viewerComponent: OBC.Components | null,
    setViewerComponent: (viewer: OBC.Components | null) => void
}

export const ViewerContext = React.createContext<IViewerContext>({
    viewerComponent: null, 
    setViewerComponent: () => {}
})

export function ViewerProvider(props: { children: React.ReactNode }) {
  const [viewerComponent, setViewerComponent] = React.useState<OBC.Components | null>(null);

  return (
      <ViewerContext.Provider value={{ viewerComponent, setViewerComponent }}>
          {props.children}
      </ViewerContext.Provider>
  );
}





export function IFCViewer(props: Props) {

    const [initialized, setInitialized] = React.useState(false);
    //const [viewer, setViewer] = React.useState(new OBC.Components())
    let properties
    const { viewerComponent, setViewerComponent } = React.useContext(ViewerContext);
    let viewer
    let tempViewer: OBC.Components
    let scene

    const meshes: any[] = [];
    const createViewer = async () => {
        viewer = new OBC.Components()
        
        setViewerComponent(viewer)
        console.log(viewer)
        if(!viewer) {return}
        const sceneComponent = new OBC.SimpleScene(viewer)
        viewer.scene = sceneComponent
        scene = sceneComponent.get()


        const setupLights = () => {
          const config = {
            directionalLight: {
                color: new THREE.Color(0xFEFAF3),
                intensity: 0.6,
                position: new THREE.Vector3(5, 10, 3),
            },
            ambientLight: {
                color: new THREE.Color(0xF4FCFF ),
                intensity: 0.5,
            },
        };
          const directionalLight = new THREE.DirectionalLight(config.directionalLight.color, config.directionalLight.intensity);
          directionalLight.position.copy(config.directionalLight.position);


         
          directionalLight.position.set(10,45,25)
          directionalLight.intensity = 2


          directionalLight.castShadow = true
          directionalLight.shadow.mapSize.width = 4096
          directionalLight.shadow.mapSize.height = 4096
          directionalLight.shadow.camera.near = 1
          directionalLight.shadow.camera.far = 75
          directionalLight.shadow.camera.left = -25
          directionalLight.shadow.camera.right= 25
          directionalLight.shadow.camera.bottom = -25
          directionalLight.shadow.camera.top= 25
          const ambientLight = new THREE.AmbientLight(config.ambientLight.color, config.ambientLight.intensity);
          ambientLight.intensity =0.45


         
          scene.add(ambientLight, directionalLight);

        }
        
        setupLights()

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
        await ifcLoader.setup();

        ifcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
        ifcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

        const highlighter = new OBC.FragmentHighlighter(viewer)
        
        highlighter.setup()
    
        const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer)
        
        
        highlighter.events.select.onHighlight.add((e) => {
          console.log(e)
          console.log("HIGHLIGHTING")

          
          
        })
        
        /* const highlightMaterial = new THREE.MeshBasicMaterial({
          color: '#BCF124',
          depthTest: false,
          opacity: 0.8,
          transparent: true
          });
        highlighter.add('default', highlightMaterial); */
        highlighter.outlineMaterial.color.set(0xf0ff7a);


        let lastSelection;
        let singleSelection = {
        value: true,
        };
        async function highlightOnClick(event) {
          const result = await highlighter.highlight('', singleSelection.value)
          //const result = await highlighter.highlight('default', singleSelection.value);
          if (result) {
            lastSelection = {};
            for (const fragment of result.fragments) {
              const fragmentID = fragment.id;
              lastSelection[fragmentID] = [result.id];
            }
          }
        }
          viewerContainer.addEventListener('click', (event) => highlightOnClick(event));

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
          if(!viewer) {return}
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
            
            model.traverse(function(node) {
              
              node.castShadow = true
              node.receiveShadow = true
              console.log(node.receiveShadow)
            })
            console.log(model)
           
          } catch (error) {
            alert(error)
          }

          
          for (const fragment of model.items) {
            console.log(fragment.mesh.material)
            fragment.mesh.receiveShadow = true
            meshes.push(fragment.mesh);
          }
          //walkingCameraTool.addMeshes(meshes)

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



        const todoCreator = new TodoCreator(viewer)
        await todoCreator.setup(props.project)
        //const simpleQto = new SimpleQto(viewer)
        const carbonTool = new CarbonTool(viewer)
        //const expressSelect = new ExpressSelect(viewer, highlighter)
        //const walkingCameraTool = new WalkingCameraTool(viewer)
        //await walkingCameraTool.setup()

        const thumbnailBtn = new OBC.Button(viewer)
        thumbnailBtn.tooltip = "Generate Thumbnail"
        thumbnailBtn.materialIcon ="photo"

        thumbnailBtn.onClick.add(() => {
          
          html2canvas(viewerContainer).then(canvas => {
            document.body.appendChild(canvas)
        });
        })

        const toolbar = new OBC.Toolbar(viewer)
        toolbar.addChild(
          ifcLoader.uiElement.get("main"),
          importFragmentBtn,
          classificationsBtn,
          thumbnailBtn,
          propertiesProcessor.uiElement.get("main"),
          todoCreator.uiElement.get("activationButton"),
          fragmentManager.uiElement.get("main"),
          //simpleQto.uiElement.get("activationBtn"),
          carbonTool.uiElement.get("activationBtn"),
          //expressSelect.uiElement.get("activationBtn"),
          //Tool.uiElement.get("walkingActivationButton"),
          //walkingCameraTool.uiElement.get("orbitActivationButton")
        )
        viewer.ui.addToolbar(toolbar)
        
        setViewerComponent(viewer)
        console.log(viewer)
        //return viewer
        
      }
      
    

      const initializedRef = React.useRef(false);

     
      React.useEffect(() => {
        if(!initialized) {
          createViewer()
          setInitialized(true)
        }
        else {
          console.log("Initialized")
        }
        
        return () => {
            
            viewer.dispose()
            setViewerComponent(null)
        }
      }, [])
      React.useEffect(() => {
        if(initialized) {
          console.log(viewerComponent)
          const renderer = viewerComponent?.renderer.get()
          const camera = viewerComponent?.camera.get() as THREE.PerspectiveCamera;
          if (!renderer) {return}

          const viewerContainer = document.getElementById("viewer-container") as HTMLDivElement;
          const { clientWidth, clientHeight } = viewerContainer;

          
          renderer.setSize(clientWidth, clientHeight);
          if (camera) {
            
            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();
          }
        }
        else {
          
        }
        
        return () => {

        }
      }, [initialized, props.updateDimensions])

    return (
        <div
            id="viewer-container"
            className="dashboard-card"
            style={{ minWidth: 0, position: "relative" }}
        />
    )
}