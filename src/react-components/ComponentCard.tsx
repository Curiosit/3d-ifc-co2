import * as React from 'react'
import { Project } from '../classes/Project'
import * as Router from "react-router-dom"
import { EPD } from 'epdx'
import { interpolateColor, roundNumber, uppercaseInitials } from '../utils/utils'
//import { calculateTotalGWP } from '../utils/epdx'
import { Component } from '../classes/Component'
import { calculateTotalEPDGWP } from '../utils/epdx'

interface Props {
    component: Component,
    epdxData: EPD[]
}

export function ComponentCard (props: Props) {
    let desc = ''
    const layers = JSON.parse(props.component.layers)
    console.log (layers)

    const calculateTotalComponentGWP = () => {
        let totalGWP = 0;
    
        layers.forEach((layer) => {
            console.log(layer.value)
            console.log(layer.amount)
            const epdxEntry = props.epdxData.find(entry => entry.id === layer.value);
            if (epdxEntry && epdxEntry.gwp) {
                const entryGWP = calculateTotalEPDGWP(epdxEntry)
                
                totalGWP += entryGWP * layer.amount
            }
        });
    
        return totalGWP;
    };
    //const totalGWP = roundNumber(calculateTotalGWP(props.epd))
    return (
    /* <Router.Routes>
        <Router.Route path="/material" element={ */
            <div className="project-card" >
                <div className="card-header">
                    <p className="initials" style={{  }}>
                        { uppercaseInitials(props.component.name) }
                    </p>
                    <div>
                    <h4>
                        { props.component.name }
                    </h4>
                    <p style={{ color: "#969696" }}>
                    { props.component.subtype }
                    </p>
                    </div>
                </div>
                <div className="card-content">
                    <div className="card-property">
                    <p style={{ color: "#969696" }}>Total GWP</p>
                    <p>
                        {roundNumber(calculateTotalComponentGWP())} kgCO2e
                    </p>
                    </div>
                    
                    {layers.map((layer, index) => {
                    
                    const epdxEntry = props.epdxData.find(entry => entry.id === layer.value);
                    if (epdxEntry) {
                        return (
                            <div className="card-property" key={index}>
                                <p style={{ color: "#969696" }}>{epdxEntry.name}</p><p>{layer.amount} {epdxEntry.declared_unit}</p>
                                
                            </div>
                        );
                    } else {
                        return null; 
                    }
                })}
                    
                    
                </div>
            </div>
            /* }>

            </Router.Route>
    </Router.Routes> */

  )
}
