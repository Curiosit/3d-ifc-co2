import * as React from "react"
import * as Router from "react-router-dom"

import { formatDate, roundNumber, setupModal, showModal } from "../utils/utils"

import { deleteDocument, getCollection } from "../firebase"

import { v4 as uuidv4 } from 'uuid'
import { Component, IComponent } from "../classes/Component"
import * as Firestore from "firebase/firestore"
import { calculateTotalEPDGWP, convertToEpdx } from "../utils/epdx"

import { EPD } from "epdx"

import { SearchBox } from "./SearchBox";
import { getFirestoreComponents, getFirestoreMaterials } from "../utils/materialdata"
import { ComponentCard } from "./ComponentCard"

import { ComponentSubtype } from "../classes/Component"
import { AskAI } from "./AskAI"
const componentsCollection = getCollection<IComponent>("/components")
interface Props {

}

export function ComponentsPage(props: Props) {
    const [showSingle, setShowSingle] = React.useState(false);
    
    const [componentID, setComponentID] = React.useState('');
    const routeParams = Router.useParams<{id: string}>()
    /* if (routeParams.id) { setShowSingle(true); setComponentID(routeParams.id) } */
    const [selectedLayers, setSelectedLayers] = React.useState<string[]>([]);
    const [showQuestion, setShowQuestion] = React.useState(false);
    const [initialized, setInitialized] = React.useState(false);
    const [epdxData, setEpdxData] = React.useState<EPD[]>([]);

    const [componentData, setComponentData] = React.useState<Component[]>([]);

    const [showComponentData, setShowComponentData] = React.useState<Component[]>([]);
    const [newComponentLayers, setNewComponentLayers] = React.useState(1);

    const [pickedComponent, setPickedComponent] = React.useState<Component | null>(null);
    let num = 0

    const [searchQuery, setSearchQuery] = React.useState("");

    const onComponentSearch = (value: string) => {
        setSearchQuery(value);
    };

    const filteredComponents = showComponentData.filter(component =>
        component.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const componentCards = filteredComponents.map((component) => {

        num += 1
        console.log(component)
        return <Router.Link to={`/3d-ifc-co2/components/${component.id}`} key={component.id}>
            <ComponentCard component={component} epdxData={epdxData} />
        </Router.Link>

    })

    const fetchComponentDetailsById = (componentID: string): Component | undefined  => {

        const componentDetails = componentData.find(component => component.id === componentID);
      
        
        return componentDetails;
    };

    React.useEffect(() => {
        if (routeParams.id) {
            setShowSingle(true);
            const componentDetail = fetchComponentDetailsById(routeParams.id);
            console.log (componentDetail)
            setPickedComponent(componentDetail ?? null);
        }
    }, [routeParams.id, componentData]); 
    
    React.useEffect(() => {
        console.log(pickedComponent);
      }, [pickedComponent]);

    React.useEffect(() => {
        const getData = async () => {
            const data = await getFirestoreMaterials()
            const epdData = convertToEpdx(data)

            const compData = await getFirestoreComponents()

            console.log(compData)
            setEpdxData(epdData)

            setComponentData(compData)
            setShowComponentData(compData)
            if (data) {
                setInitialized(true)
            }
        }
        if (!initialized) {
            getData()
        }
        else {
            console.log("Show data")
        }
        return () => {
        }
    }, [initialized])




    const onNewComponentClick = () => {
        const modal = document.getElementById("new-component-modal");
        if (modal && modal instanceof HTMLDialogElement) {
            setNewComponentLayers(1)

            const simulatedEvent = {
                preventDefault: () => { },
            };


            onAddLayerClick(simulatedEvent);
            modal.showModal();

        }
        else {
            console.warn("The provided modal wasn't found. ");
        }
    }
    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const nameInput = form.querySelector('input[name="name"]') as HTMLInputElement;
        const name = nameInput.value.trim();

        if (!name) {
            alert('Please provide a name for the component.');
            return;
        }

        console.log("Name:", name);

        const subtypeInput = form.querySelector('select[name="subtype"]') as HTMLSelectElement;
        const subtype = subtypeInput.value;

        const layerInputs = form.querySelectorAll('input[name^="layer-"], select[name^="layer-"]');
        const layerValues = [];
        const amountValues = [];

        let isValid = true;

        layerInputs.forEach(layerInput => {
            let value;
            if (layerInput.tagName === 'INPUT') {
                value = layerInput.value;
            } else if (layerInput.tagName === 'SELECT') {
                const selectedIndex = layerInput.selectedIndex;
                value = layerInput.options[selectedIndex].value;
            }
            layerValues.push(value);

            const layerNumber = layerInput.getAttribute('name').split('-')[1];
            const amountInput = form.querySelector(`input[name="amount-${layerNumber}"]`) as HTMLInputElement;
            const amount = amountInput ? parseFloat(amountInput.value.trim()) : NaN;

            if (!value || isNaN(amount)) {
                isValid = false;
                return;
            }
            amountValues.push(amount);
        });

        if (!isValid) {
            alert('Please select a value and specify a valid amount for each layer.');
            return;
        }

        console.log("Layer values:", layerValues);
        console.log("Amount values:", amountValues);

        const layersData = layerValues.map((layerValue, index) => ({
            value: layerValue,
            amount: amountValues[index]
        }));

        const layersJSON = JSON.stringify(layersData);
        console.log(layersJSON);

        const component = new Component(
            name as string,
            uuidv4(),
            layersJSON,
            subtype as ComponentSubtype
        );

        const componentData = component.toPlainObject();
        try {
            if (true) {
                const result = await Firestore.addDoc(componentsCollection, componentData);
                if (result) {
                    const newData = await getFirestoreComponents();
                    setComponentData(newData);
                    setShowComponentData(newData);
                }
                form.reset();
                const modal = document.getElementById("new-component-modal");
                if (modal && modal instanceof HTMLDialogElement) {
                    modal.close();
                } else {
                    console.warn("The provided modal wasn't found.");
                }
            }
        }
        catch (err) {
            alert(err);
        }
    };


    function extractLayerValues(formData: any): { [key: string]: any } {
        const layerValues: { [key: string]: any } = {};
        for (const key in formData) {
            if (formData.hasOwnProperty(key) && /^layer\d{2}$/.test(key)) {

                layerValues[key] = formData[key];
            }
        }
        return layerValues;
    }
    function countLayers(formData: any): number {
        let layerCount = 0;
        for (const key in formData) {
            if (formData.hasOwnProperty(key) && /^layer\d{2}$/.test(key)) {

                layerCount++;
            }
        }
        return layerCount;
    }

    const onAddLayerClick = (e) => {
        e.preventDefault();
        const layerDiv = document.getElementById("component-layers");

        if (layerDiv && layerDiv instanceof HTMLDivElement) {
            const newLayerHTML = generateAnotherLayerDiv(newComponentLayers, epdxData);

            layerDiv.insertAdjacentHTML("beforeend", newLayerHTML);
            const newLayerSelect = layerDiv.querySelector(`select[name="layer-${newComponentLayers.toString().padStart(2, '0')}"]`) as HTMLSelectElement;
            if (newLayerSelect) {
                newLayerSelect.addEventListener('change', handleDropdownChange);
            }
            setNewComponentLayers(prevLayers => prevLayers + 1);
        } else {
            console.warn("The provided div wasn't found.");
        }
    }

    function generateAnotherLayerDiv(layerNumber: number, epdxData: EPD[]): string {
        let dropdownOptions = '';
        epdxData.forEach(entry => {
            dropdownOptions += `<option value="${entry.id}" data-unit="${entry.declared_unit}">${entry.name}: ${roundNumber(calculateTotalEPDGWP(entry))}kgCO2/${entry.declared_unit}</option>`;
        });

        return `
            <div class="form-field-container">
                <p>
                    <select name="layer-${layerNumber.toString().padStart(2, '0')}" style="margin-top: 5px;" >
                        <option value="" selected disabled>Select Layer ${layerNumber.toString().padStart(2, '0')}</option>
                        ${dropdownOptions}
                    </select>
                </p>
                <p>
                    <input type="number" step="0.01" name="amount-${layerNumber.toString().padStart(2, '0')}" placeholder="amount" style="margin-top: 5px;"> 
                    <span class="unit-placeholder"></span>
                </p>
            </div>
        `;
    }


    function handleDropdownChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        const selectedOption = select.options[select.selectedIndex];
        const unit = selectedOption.getAttribute('data-unit');
        const value = selectedOption.value;
        console.log('Selected unit:', unit);
        let newSelectedLayers = [...selectedLayers];
        newSelectedLayers[parseInt(select.name.split('-')[1]) - 1] = selectedOption.text;
        setSelectedLayers(newSelectedLayers);
        setShowQuestion(newSelectedLayers.length > 0);
        const unitPlaceholder = select.closest('.form-field-container').querySelector('.unit-placeholder') as HTMLElement;

        if (unitPlaceholder) {
            unitPlaceholder.textContent = unit || '';
        } else {
            console.warn("Unit placeholder not found.");
        }
    }

    function updateUnit(selectElement) {
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const unitPlaceholder = selectElement.parentNode.nextElementSibling.querySelector('.unit-placeholder');
        unitPlaceholder.textContent = selectedOption.getAttribute('data-unit');
    }

    function populateDropdown(dropdown) {

        dropdown.innerHTML = '<option value="" selected disabled>Select Layer 01</option>';

        epdxData.forEach(function (entry) {
            var option = document.createElement("option");
            option.text = entry.name;
            option.value = entry.id;
            dropdown.add(option);
        });
    }

    const onCancelClick = () => {
        const modal = document.getElementById("new-component-modal");
        const layerDiv = document.getElementById("component-layers");

        if (modal && modal instanceof HTMLDialogElement && layerDiv) {
            setNewComponentLayers(1)
            layerDiv.innerHTML = ''; // Clear layer HTML content
            modal.close();
        } else {
            console.warn("The provided modal or layer div wasn't found.");
        }
    };

    const constructQuestionFromLayers = () => {
        if (selectedLayers.length === 0) {
            return "Please add layers to see the question.";
        }
        return `What can be improved in this material combination to lower carbon footprint?: ${selectedLayers.join(', ')}. Write opinion on each layer, and suggest replacement. Be short`;
    };

    
    return (

        <div className="page">
            <dialog id="new-component-modal" >
                <form onSubmit={(e) => onFormSubmit(e)} id="new-component-form" style={{ width: '700px' }}>
                    <h2>New component</h2>
                    <div className="input-list">
                        <div className="form-field-container">
                            <label>
                                <span className="material-symbols-rounded">note</span>Name
                            </label>
                            <input
                                name="name"
                                type="text"
                                placeholder="Name of the component..."
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
                        <div className="form-field-container">
                            <label>
                                <span className="material-symbols-rounded">note</span>Subtype
                            </label>
                            <select name="subtype">
                                <option value="" selected disabled>Select Subtype</option>
                                {Object.values(ComponentSubtype).map(subtype => (
                                    <option key={subtype} value={subtype}>
                                        {subtype}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div id="component-layers">
                            {/* <div className="form-field-container" >
                        <label>
                            <span className="material-symbols-rounded">note</span>Layer 01
                        </label>
                        <select name="layer-01" id="layer-01-dropdown">
                            <option value="" selected disabled>Select Layer 01</option>
                            
                        </select>
                        
                        </div> */}
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
                                className="btn-secondary"
                                onClick={onCancelClick}
                            >

                                Cancel
                            </button>
                            <button type="submit" className="positive">
                                Accept
                            </button>
                            
                            
                        </div>
                        <div
                            
                        ><AskAI question={constructQuestionFromLayers()} show={showQuestion}></AskAI></div>
                    </div>
                </form>
            </dialog>
            <header>
                <h2>
                    <span className="material-symbols-rounded">folder_copy</span> Material Library
                </h2>
                <SearchBox onChange={(value) => onComponentSearch(value)} />
                <div style={{ display: "flex", alignItems: "center", columnGap: 15 }}>

                    <button onClick={onNewComponentClick} id="new-material-btn">
                        <span className="material-symbols-rounded">note_add</span> New component
                    </button>
                </div>
            </header>


            { 
            showSingle && componentID !== null ?
                <div id="component-details">

                     { <ComponentCard component={pickedComponent} epdxData={epdxData} detailed={true} /> }
                </div>
            :
                componentData.length > 0 ?
                    <div id="material-list">
                            {componentCards}
                    </div>
                        :
                    <div id="material-list">
                            No components found!
                    </div>
            }
            </div>

    )
}