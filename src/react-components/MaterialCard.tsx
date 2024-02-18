import * as React from 'react'
import { Project } from '../classes/Project'
import * as Router from "react-router-dom"
import { EPD } from 'epdx'
import { interpolateColor, roundNumber, uppercaseInitials } from '../utils/utils'
import { calculateTotalGWP } from '../utils/epdx'

interface Props {
    epd: EPD
}

export function MaterialCard (props: Props) {
    let desc = ''
    const totalGWP = roundNumber(calculateTotalGWP(props.epd))
    return (
    /* <Router.Routes>
        <Router.Route path="/material" element={ */
            <div className="project-card" >
                <div className="card-header">
                    <p className="initials" style={{ background: interpolateColor(totalGWP) }}>
                        { uppercaseInitials(props.epd.name) }
                    </p>
                    <div>
                    <h4>
                        { props.epd.name }
                    </h4>
                    <p style={{ color: "#969696" }}>
                    { props.epd.subtype }
                    </p>
                    </div>
                </div>
                <div className="card-content">
                    <div className="card-property">
                    <p style={{ color: "#969696" }}>Total GWP</p>
                    <p>
                        { totalGWP } kgCO2e
                    </p>
                    </div>
                    <div className="card-property">
                    <p style={{ color: "#969696" }}>Declared Unit</p>
                    <p>
                        { props.epd.declared_unit }
                    </p>
                    </div>
                    
                </div>
            </div>
            /* }>

            </Router.Route>
    </Router.Routes> */

  )
}
