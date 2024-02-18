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

const materialsCollection = getCollection<IMaterial>("/materials")
interface Props {
    
}



export function MaterialsPage(props: Props) {
    

    const [materialData, setMaterialData] = React.useState([{}]);
    const [initialized, setInitialized] = React.useState(false);
    const [epdxData, setEpdxData] = React.useState<EPD[]>([]);
    
    const [showEpdxData, setShowEpdxData] = React.useState<EPD[]>([]);

    let num = 0
    const onMaterialSearch = (value: string) => {
        
        setShowEpdxData(filterMaterials(value))
    }
    const filterMaterials = (value: string) => { // Change from function declaration to arrow function
        const filteredMaterials = epdxData.filter((mat) => {
            return (mat.name.toLowerCase().includes(value.toLowerCase()));
        })
        //console.log(filteredMaterials)
        return filteredMaterials
      }
    

    const materialCards = epdxData.map((epdx) => {
        
        
        num += 1

        console.log(epdx)
        
      
        return  <Router.Link to={`/3d-ifc-co2/materials/${epdx.id}`} key={epdx.id}>
                    <MaterialCard epd={epdx} />
                </Router.Link>
        
        
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
            //console.log(epdData)
            setEpdxData(epdData)
            setShowEpdxData(epdData)
            //console.log(epdxData)
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

    React.useEffect(() => {
        
    }, [showEpdxData])
    return(
        
           <div className="page">
            <header>
                <h2>
                <span className="material-symbols-rounded">folder_copy</span> Material Library
                </h2>
                <SearchBox  onChange={(value) => onMaterialSearch(value)}/>
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