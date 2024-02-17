import * as React from "react"
import * as Router from "react-router-dom"
import { ProjectsManager } from "../classes/ProjectsManager"
import { formatDate, setupModal, showModal } from "../utils/utils"
import { renderProgress } from "../utils/utils"
import { IFCViewer } from "./IFCViewer"
import { deleteDocument } from "../firebase"
import { Modal } from "./Modal"
import { downloadData } from "../utils/materialdata"




  
interface Props {
    
}



export function MaterialsPage(props: Props) {
    
    
    const [materialData, setMaterialData] = React.useState([]);
    const [initialized, setInitialized] = React.useState(false);
    
    
    let num = 0
    const materialCards = materialData.map((material) => {
        
        
        num += 1

        console.log(material.name)
        return  <p>Material {num}: {material.name}</p>
        
    })
    
    
    
    React.useEffect(() => {
        const getData = async () => {
            const data = await downloadData()
            setMaterialData(data.materials)
            if(data) {
                setInitialized(true)
            }
            
        }
        if(!initialized) {
            getData()
        }
        else {
            console.log(materialData)
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
               
                <div style={{ display: "flex", alignItems: "center", columnGap: 15 }}>
                
                <button id="new-material-btn">
                    <span className="material-symbols-rounded">note_add</span> New material
                </button>
                </div>
            </header>
           

            {
                materialData.length > 0 ? 
                <div id="material-list">
                    { materialCards }
                </div>
                :
                <div id="material-list">
                    
                </div>

            }
            </div>

    )
}