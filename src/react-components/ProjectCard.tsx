import * as React from 'react'
import { Project } from '../classes/Project'
import * as Router from "react-router-dom"

interface Props {
    project: Project
}

export function ProjectCard (props: Props) {
    let desc = ''
    if (props.project.description.length > 25) {
        desc = props.project.description.substring(0,20) + '...'
    } else {
        desc = props.project.description
    }
    let name = ''
    if (props.project.name.length > 20) {
        name = props.project.name.substring(0,17) + '...'
    } else {
        name = props.project.name
    }
    return (
    /* <Router.Routes>
        <Router.Route path="/project" element={ */
            <div className="project-card" >
                <div className="card-header">
                    <p className="initials" style={{ background: props.project.inColor }}>
                        { props.project.initials }
                    </p>
                    <div>
                    <h4>
                        { name }
                    </h4>
                    <p style={{ color: "#969696" }}>
                    { desc }
                    </p>
                    </div>
                </div>
                <div className="card-content">
                    <div className="card-property">
                    <p style={{ color: "#969696" }}>Status</p>
                    <p>
                        { props.project.status }
                    </p>
                    </div>
                    <div className="card-property">
                    <p style={{ color: "#969696" }}>Role</p>
                    <p>
                        { props.project.userRole }
                    </p>
                    </div>
                    <div className="card-property">
                    <p style={{ color: "#969696" }}>Cost</p>
                    <p>
                        $ { props.project.cost }
                    </p>
                    </div>
                    <div className="card-property">
                    <p style={{ color: "#969696" }}>Estimated Progress</p>
                    <p>
                        { props.project.progress * 100 }%
                    </p>
                    </div>
                </div>
            </div>
            /* }>

            </Router.Route>
    </Router.Routes> */

  )
}
