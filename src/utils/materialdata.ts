import * as Firestore from "firebase/firestore"
import { getCollection } from "../firebase"
import { IMaterial } from "../classes/Material"
import { Component, IComponent } from "../classes/Component"


export async function getFirestoreMaterials() {
    const materialsCollection = getCollection<IMaterial>("/materials")
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


export async function getFirestoreComponents() {
    const componentsCollection = getCollection<Component>("/components")
    const firebaseComponents = await Firestore.getDocs(componentsCollection)
    const componentList: Component[] = [];
    for (const doc of firebaseComponents.docs) {
        const data = doc.data() 
        const component: Component = {
            ...data,
        }
        try {
            componentList.push(component)

        }
        catch (error) {
            console.log(error)
        }
        
    }

    
    return componentList
}