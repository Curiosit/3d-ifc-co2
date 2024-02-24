import * as React from 'react'
import { Project } from '../classes/Project'
import * as Router from "react-router-dom"
import { EPD } from 'epdx'
import { interpolateColor, roundNumber, uppercaseInitials } from '../utils/utils'
//import { calculateTotalGWP } from '../utils/epdx'
import { Component } from '../classes/Component'

interface Props {
    component: Component
}

export function ComponentCard (props: Props) {
    let desc = ''
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
                        0 kgCO2e
                    </p>
                    </div>
                    
                    
                </div>
            </div>
            /* }>

            </Router.Route>
    </Router.Routes> */

  )
}
