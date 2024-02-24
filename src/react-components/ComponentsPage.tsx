import * as React from "react"
import * as Router from "react-router-dom"
import { ProjectsManager } from "../classes/ProjectsManager"
import { formatDate, setupModal, showModal } from "../utils/utils"
import { renderProgress } from "../utils/utils"
import { IFCViewer } from "./IFCViewer"
import { deleteDocument, getCollection } from "../firebase"
import { Modal } from "./Modal"
import { v4 as uuidv4 } from 'uuid'
import { Component, IComponent } from "../classes/Component"
import * as Firestore from "firebase/firestore"
import { convertToEpdx } from "../utils/epdx"

import { EPD } from "epdx"
import { MaterialCard } from "./MaterialCard"
import { SearchBox } from "./SearchBox";
import { getFirestoreComponents, getFirestoreMaterials } from "../utils/materialdata"
import { ComponentCard } from "./ComponentCard"
import { generateUUID } from "three/src/math/MathUtils"

const componentsCollection = getCollection<IComponent>("/components")
interface Props {
    
}



export function ComponentsPage(props: Props) {
    
    const [initialized, setInitialized] = React.useState(false);
    const [epdxData, setEpdxData] = React.useState<EPD[]>([]);
    const [componentData, setComponentData] = React.useState<Component[]>([]);
    
    const [showComponentData, setShowComponentData] = React.useState<Component[]>([]);

    let newComponentLayers = 1;
    let num = 0
    const componentCards = showComponentData.map((component) => {
        
        
        num += 1

        console.log(component)
        
      
        return  <Router.Link to={`/3d-ifc-co2/component/${component.id}`} key={component.id}>
                    <ComponentCard component={component} />
                </Router.Link>
        
        
    })
    const onComponentSearch = (value: string) => {
        //const comps = filterComponents(value)
        
        //setShowComponentData(comps)
        
    }

    
    
    React.useEffect(() => {
        const getData = async () => {
            const data = await getFirestoreMaterials()
            const epdData = convertToEpdx(data)

            const compData = await getFirestoreComponents()

            console.log(compData)
            setEpdxData(epdData)
            setComponentData(compData)
            setShowComponentData(compData)
            if(data) {
                setInitialized(true)
            }
        }
        if(!initialized) {
            getData()
        }
        else {
            //console.log(materialData)
        }
        return () => {
        }
      }, [initialized])

      const onNewComponentClick = () => {
        const modal = document.getElementById("new-component-modal");
        if (modal && modal instanceof HTMLDialogElement) {
            newComponentLayers = 1
            modal.showModal();
        } 
        else {
          console.warn("The provided modal wasn't found. ");
        }
    }
    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Submit!")
        const componentForm = document.getElementById("new-component-form")
        if (!(componentForm && componentForm instanceof HTMLFormElement)) {return}
        e.preventDefault()
        const formData = new FormData(componentForm)
        console.log(formData)
        const numberOfLayers = countLayers(formData);
        const layerValues = extractLayerValues(formData);
        const layersJSON = JSON.stringify(layerValues);
        console.log(layersJSON)
        const component = new Component(
            formData.get("name") as string,
            uuidv4(),
            layersJSON,
            'wall'
        )
        console.log(e)
        const componentData = component.toPlainObject();
        try {
            if(true) {
                //const result = await Firestore.addDoc(componentsCollection, componentData)
                
                
                    
                    
                    
                    
                componentForm.reset()
                const modal = document.getElementById("new-component-modal");
                if (modal && modal instanceof HTMLDialogElement) {
                    modal.close();
                } 
                else {
                    console.warn("The provided modal wasn't found. ");
                }
                
            }
            
        }
        catch (err) {
            alert(err)
        }
    }
    function extractLayerValues(formData: any): { [key: string]: any } {
        const layerValues: { [key: string]: any } = {};
        for (const key in formData) {
            if (formData.hasOwnProperty(key) && /^layer\d{2}$/.test(key)) {
                // If the key matches the pattern layerXX, add it to layerValues
                layerValues[key] = formData[key];
            }
        }
        return layerValues;
    }
    function countLayers(formData: any): number {
        let layerCount = 0;
        for (const key in formData) {
            if (formData.hasOwnProperty(key) && /^layer\d{2}$/.test(key)) {
                // If the key matches the pattern layerXX, increment layerCount
                layerCount++;
            }
        }
        return layerCount;
    }

    const onAddLayerClick = () => {
        const layerDiv = document.getElementById("component-layers");

        if (layerDiv && layerDiv instanceof HTMLDivElement) {
            newComponentLayers = newComponentLayers + 1
            const newLayerHTML = generateAnotherLayerDiv(newComponentLayers);

    
            layerDiv.insertAdjacentHTML("beforeend", newLayerHTML);

        } 
        else {
          console.warn("The provided div wasn't found. ");
        }
    }
    

    function generateAnotherLayerDiv(layerNumber: number): string {
        return `
            
                <div class="form-field-container">
                    <label>
                        <span class="material-symbols-rounded">note</span>Layer ${layerNumber.toString().padStart(2, '0')}
                    </label>
                    <input
                        name="name"
                        type="text"
                        placeholder="Layer ${layerNumber.toString().padStart(2, '0')}"
                    />
                </div>
            
        `;
    }
    return(
        
           <div className="page">
            <dialog id="new-component-modal">
                <form onSubmit={(e) => onFormSubmit(e)} id="new-component-form">
                <h2>New component</h2>
                <div className="input-list">
                    <div className="form-field-container">
                    <label>
                        <span className="material-symbols-rounded">note</span>Name
                    </label>
                    <input
                        name="name"
                        type="text"
                        placeholder="What's the name of your project?"
                    />
                    <p
                        style={{
                        color: "gray",
                        fontSize: "var(--font-sm)",
                        marginTop: 5,
                        fontStyle: "italic"
                        }}
                    >
                        TIP: Give it a short name
                    </p>
                    </div>
                    <div id="component-layers">
                        <div className="form-field-container" >
                        <label>
                            <span className="material-symbols-rounded">note</span>Layer 01
                        </label>
                        <input
                            name="name"
                            type="text"
                            placeholder="Layer 01"
                        />
                        
                        </div>
                    </div>
                    <button onClick={onAddLayerClick} className="positive">
                        ...add another layer
                    </button>
                    <div
                    style={{
                        display: "flex",
                        margin: "10px 0px 10px auto",
                        columnGap: 10
                    }}
                    >
                    <button
                            id="close-new-project-modal-btn"
                            type="button"
                            style={{ backgroundColor: "transparent" }}
                            className="btn-secondary" >
                            Cancel
                        </button>
                    <button type="submit" className="positive">
                        Accept
                    </button>
                    </div>
                </div>
                </form>
            </dialog>
            <header>
                <h2>
                <span className="material-symbols-rounded">folder_copy</span> Material Library
                </h2>
                <SearchBox  onChange={(value) => onComponentSearch(value)}/>
                <div style={{ display: "flex", alignItems: "center", columnGap: 15 }}>
                
                <button onClick={onNewComponentClick} id="new-material-btn">
                    <span className="material-symbols-rounded">note_add</span> New component
                </button>
                </div>
            </header>
           

            {
                componentData.length > 0 ? 
                <div id="material-list">
                    { componentCards }
                </div>
                :
                <div id="material-list">
                    No components found!
                </div>

            }
            </div>

    )
}