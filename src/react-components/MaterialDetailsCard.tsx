import * as React from 'react'
import { Project } from '../classes/Project'
import * as Router from "react-router-dom"
import { EPD } from 'epdx'
import { roundNumber, uppercaseInitials } from '../utils/utils'
import { calculateTotalGWP } from '../utils/epdx'

interface Props {
    epd: EPD
}

export function MaterialDetailsCard (props: Props) {
    let desc = ''
    
    return (

            <div className="project-card" >
                <div className="card-header">
                    <p className="initials" style={{ background: "#57ca8d" }}>
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
                        { roundNumber(calculateTotalGWP(props.epd)) } kgCO2e
                    </p>
                    </div>
                    <div className="card-property">
                    <p style={{ color: "#969696" }}>Declared Unit</p>
                    <p>
                        { props.epd.declared_unit }
                    </p>
                    </div>
                    <div className="card-property">
                    <p style={{ color: "#969696" }}>uuid</p>
                    <p>
                        { props.epd.id }
                    </p>
                    </div>
                    <div className="card-property">
                    <p style={{ color: "#969696" }}>GWP A1-A3</p>
                    <p>
                        { props.epd.gwp.a1a3 } kgCO2e
                    </p>
                    </div>
                    <div className="card-property">
                    <p style={{ color: "#969696" }}>GWP C3</p>
                    <p>
                        { props.epd.gwp.c3 } kgCO2e
                    </p>
                    </div>
                    <div className="card-property">
                    <p style={{ color: "#969696" }}>GWP C4</p>
                    <p>
                        { props.epd.gwp.c4 } kgCO2e
                    </p>
                    </div>
                    <div className="card-property">
                    <p style={{ color: "#969696" }}>Source</p>
                    <p>
                        <a href={props.epd.source?.url}>{props.epd.source?.name}</a>
                    </p>
                    </div>
                    
                </div>
            </div>

  )
}
