import * as React from "react"
import * as Router from "react-router-dom"
import { ProjectsManager } from "../classes/ProjectsManager"
import { formatDate, setupModal, showModal } from "../utils/utils"
import { renderProgress } from "../utils/utils"
import { IFCViewer } from "./IFCViewer"
import { deleteDocument, getCollection } from "../firebase"
import { Modal } from "./Modal"

import { IMaterial } from "../classes/Material"
import * as Firestore from "firebase/firestore"
import { convertToEpdx } from "../utils/epdx"

import { EPD } from "epdx"
import { MaterialCard } from "./MaterialCard"
import { SearchBox } from "./SearchBox";
import { MaterialDetailsCard } from "./MaterialDetailsCard"

const materialsCollection = getCollection<IMaterial>("/materials")
interface Props {
    
}



export function MaterialPage(props: Props) {
    
    const [initialized, setInitialized] = React.useState(false);
    const [epdxData, setEpdxData] = React.useState<EPD[]>([]);
    const [materialEpd, setMaterialEpd] = React.useState<EPD>();

    const routeParams = Router.useParams<{id: string}>()
    if (!routeParams.id) { return  }
    const getFirestoreMaterials = async () => {
        
        const firebaseMaterials = await Firestore.getDocs(materialsCollection)
        const materialList = [{}]
        for (const doc of firebaseMaterials.docs) {
            const data = doc.data() 
            const material: IMaterial = {
                ...data,
            }
            try {
                materialList.push(material)

            }
            catch (error) {
                console.log(error)
            }
            
        }

        
        return materialList
    }
    
    
    React.useEffect(() => {
        const getData = async () => {
            const data = await getFirestoreMaterials()
            const epdData = convertToEpdx(data)
            setEpdxData(epdData)
            if(epdData) {
                setInitialized(true)
            }
        }
        if(!initialized) {
            getData()
        }
        else {

        }
        return () => {
        }
      }, [initialized])

      React.useEffect(() => {
        //console.log("epdxData changed: ", epdxData)
        //console.log("initialized: ", initialized)
        if(initialized) {
            
            console.log("params: ", routeParams)
            
            const material= epdxData.find(epd => epd.id === routeParams.id);
            //console.log(material)
            setMaterialEpd(material);
            //console.log(materialEpd)
            
        }
        else {
            
        }
        return () => {
        }
      }, [epdxData])


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
                materialEpd != null ? 
                <div id="material-details">
                    <MaterialDetailsCard epd={materialEpd} />
                </div>
                :
                <div id="material-details">
                No material found...
                </div>
            }
            </div>

    )
}