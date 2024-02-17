import * as OBC from "openbim-components"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import TWEEN from '@tweenjs/tween.js'

export type CameraMode = "FirstPerson" | "Orbit";

export class WalkingCameraTool extends OBC.Component<void> implements OBC.UI, OBC.Disposable {

   
    cameraMode: CameraMode
    static uuid = "e2cace79-5781-4577-9e09-43c6eb3c8dad"
    pegman
    raycaster
    enabled = true
    cameraComponent
    meshes: THREE.Mesh[] = []
    viewerContainer
    mouse
    uiElement = new OBC.UIElement<
    {
        walkingActivationButton: OBC.Button
        orbitActivationButton: OBC.Button
    }>()
    private _components: OBC.Components
    
    constructor(components: OBC.Components) {
        super(components)
        this._components = components
        

        this.cameraComponent = components.camera as OBC.OrthoPerspectiveCamera
        
        this.addMeshes(this._components.meshes)
        this.listener()
    }

    async dispose() {
        this.uiElement.dispose()
        this.enabled = false
    }
    
    
    async setup() {
        console.log(this._components)
        console.log("Setup")
        try {
            //this.pegman = await this.loadPegman()

        } catch (error) {
            console.error('Error loading Pegman:', error);
        }
        

        const walkingActivationButton = new OBC.Button(this._components)
        walkingActivationButton.materialIcon = "directions_walk"
        walkingActivationButton.tooltip = "Walking Camera"

        const orbitActivationButton = new OBC.Button(this._components)
        orbitActivationButton.materialIcon = "language"
        orbitActivationButton.tooltip = "Orbit Camera"


        walkingActivationButton.onClick.add(() => {
            this.toggleCameraMode()
        })
        
        orbitActivationButton.onClick.add(() => {
            this.toggleCameraMode()
        })

        

        
        this.uiElement.set({
            walkingActivationButton,
            orbitActivationButton
        })
        this.uiElement.get("orbitActivationButton").active = true
        this.pegman.visible = false
    }

    

    async loadPegman() {
        console.log(this._components.scene)
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load(
                '../../.././assets/scene.gltf',
                (gltf) => {
                    
                    console.log(this._components.scene)
                    const scene = this._components.scene.get()
                    scene.add(gltf.scene);
                    const pegmanModel = gltf.scene as THREE.Group;
                    const scale = 0.025;
                    pegmanModel.scale.set(scale, scale, scale);
                   
                    resolve(pegmanModel);
                },
                function (xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function (error) {
                    console.log('An error happened');
                    reject(error);
                }
            );
        });
    }


    toggleCameraMode() {
        if(this.cameraMode == "FirstPerson") {
            this.cameraMode = "Orbit"           
            this.cameraComponent.setNavigationMode(this.cameraMode);
            this.uiElement.get("walkingActivationButton").active = false
            this.uiElement.get("orbitActivationButton").active = true
            this.pegman.visible = false
            const projection = this.cameraComponent.currentMode
            console.log(projection)
        }
        else {

            this.cameraMode = "FirstPerson"
            this.cameraComponent.setNavigationMode(this.cameraMode);
            this.uiElement.get("walkingActivationButton").active = true
            this.uiElement.get("orbitActivationButton").active = false
            this.pegman.visible = true
            const projection = this.cameraComponent.currentMode
            console.log(projection)
            

        }
    }
    async listener() {
        this.viewerContainer = await document.getElementById("viewer-container") as HTMLDivElement
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseClick = this.onMouseClick.bind(this);
        
        this.viewerContainer.addEventListener('mousemove', this.onMouseMove, false);
       
    
        var mDragging = false;
        var mDown = false;
       
        window.addEventListener('mousedown', () => {
            mDown = true;
        });
    
        window.addEventListener('mousemove', () => {
            if (mDown) {
                mDragging = true;
            }
        });
    
        window.addEventListener('mouseup', (event) => {
 
            if (mDragging === false) {
                if (this.cameraMode = "FirstPerson") {
                    this.onMouseClick(event);
                }
                
            }
    

            mDown = false;
            mDragging = false;
        });
    }
    

    onMouseClick(event) {
        
        this.mouse.x = (event.offsetX / this.viewerContainer.clientWidth) * 2 - 1;
        this.mouse.y = -(event.offsetY / this.viewerContainer.clientHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.cameraComponent.activeCamera);
        var intersects = this.raycaster.intersectObjects(this.meshes);
 

        if (intersects.length > 0) {
              
              var intersectionPoint = intersects[0].point;

              console.log("clicked point ", intersectionPoint)
              const newCameraLocation = {
                x: intersectionPoint.x,
                y: intersectionPoint.y+1.7,
                z: intersectionPoint.z,
              }
              
              this.tweenCamera(newCameraLocation as THREE.Vector3)
        }
      }

      onMouseMove(event) {
          
        
        this.mouse.x = (event.offsetX / this.viewerContainer.clientWidth) * 2 - 1;
        this.mouse.y = -(event.offsetY / this.viewerContainer.clientHeight) * 2 + 1;

        
        this.raycaster.setFromCamera(this.mouse, this.cameraComponent.activeCamera);
        
       
        var intersects = this.raycaster.intersectObjects(this.meshes);


        if (intersects.length > 0) {
            
            var intersectionPoint = intersects[0].point;


            const pegmanLocation = {
              x: intersectionPoint.x,
              y: intersectionPoint.y,
              z: intersectionPoint.z,
            }
            this.pegman.position.copy(pegmanLocation)
        }
    }

    tweenCamera(finalPosition: THREE.Vector3) {
          
        const position = new THREE.Vector3()
        this.cameraComponent.controls.getPosition(position)
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
        this.cameraComponent.controls.getTarget(target)
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
            this.cameraComponent.controls.setPosition(obj.x, obj.y, obj.z);
          })
          .start();

          targetTween.to({ x: finalTarget.x, y: finalTarget.y, z: finalTarget.z }, 1000)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate((obj) => {
            this.cameraComponent.controls.setTarget(obj.x, obj.y, obj.z);
          })
          .start();        
          
    }


    addMeshes(meshes) {
        for (const mesh of meshes) {
            this.meshes.push(mesh);
        }
    }
    
    get(): void {
        
    }
    update() {
        
    }
}