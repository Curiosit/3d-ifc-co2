import * as React from "react"
import * as Router from "react-router-dom"
import { ProjectsManager } from "../classes/ProjectsManager"
import { formatDate, setupModal, showModal } from "../utils/utils"
import { renderProgress } from "../utils/utils"
import { IFCViewer } from "./IFCViewer"
import { deleteDocument, getCollection } from "../firebase"
import { Modal } from "./Modal"

import { Component, IComponent } from "../classes/Component"
import * as Firestore from "firebase/firestore"
import { convertToEpdx } from "../utils/epdx"

import { EPD } from "epdx"
import { MaterialCard } from "./MaterialCard"
import { SearchBox } from "./SearchBox";
import { getFirestoreComponents, getFirestoreMaterials } from "../utils/materialdata"
import { ComponentCard } from "./ComponentCard"

const componentsCollection = getCollection<IComponent>("/components")
interface Props {
    
}



export function ComponentsPage(props: Props) {
    
    const [initialized, setInitialized] = React.useState(false);
    const [epdxData, setEpdxData] = React.useState<EPD[]>([]);
    const [componentData, setComponentData] = React.useState<Component[]>([]);
    
    const [showComponentData, setShowComponentData] = React.useState<Component[]>([]);



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


    return(
        
           <div className="page">
            <header>
                <h2>
                <span className="material-symbols-rounded">folder_copy</span> Material Library
                </h2>
                <SearchBox  onChange={(value) => onComponentSearch(value)}/>
                <div style={{ display: "flex", alignItems: "center", columnGap: 15 }}>
                
                <button id="new-material-btn">
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