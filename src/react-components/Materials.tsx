import * as React from "react"
import * as Router from "react-router-dom"
import { ProjectsManager } from "../classes/ProjectsManager"
import { formatDate, setupModal, showModal } from "../utils/utils"
import { renderProgress } from "../utils/utils"
import { IFCViewer } from "./IFCViewer"
import { deleteDocument, getCollection } from "../firebase"
import { Modal } from "./Modal"
import { downloadData } from "../utils/materialdata"
import { IMaterial } from "../classes/Material"
import * as Firestore from "firebase/firestore"




const materialsCollection = getCollection<IMaterial>("/materials")
interface Props {
    
}



export function MaterialsPage(props: Props) {
    
    
    const [materialData, setMaterialData] = React.useState([{}]);
    const [initialized, setInitialized] = React.useState(false);
    
    
    let num = 0
    const materialCards = materialData.map((material) => {
        
        
        num += 1

        console.log(material)
        
        let valueOfA1A2A3 = material.gwp?.A1A2A3;
        if (valueOfA1A2A3 !== undefined) {
            console.log("Value of A1A2A3:", valueOfA1A2A3);
        } else {
            console.error("Property 'A1A2A3' not found in the material data or 'gwp' is undefined.", material.name);
        }
        return  <p>{material.name} {valueOfA1A2A3} kgCO2e / {material.unit}</p>
        
    })
    
    const getFirestoreMaterials = async () => {
        
        const firebaseMaterials = await Firestore.getDocs(materialsCollection)
        const materialList = [{}]
        for (const doc of firebaseMaterials.docs) {
            const data = doc.data() 
            const material: IMaterial = {
                ...data,
                
            }
            try {
                
                console.log(material)
                console.log(material.name)
                materialList.push(material)
                //materialList.push(material)
            }
            catch (error) {
                console.log(error)
            }
            
        }
        setMaterialData(materialList)
        return firebaseMaterials.docs
    }
    
    
    React.useEffect(() => {
        const getData = async () => {
            const data = await getFirestoreMaterials()
            //setMaterialData(data)
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