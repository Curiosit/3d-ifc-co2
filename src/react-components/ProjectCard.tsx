import * as React from 'react'
import { Project } from '../classes/Project'
import * as Router from "react-router-dom"

interface Props {
    project: Project
}

export function ProjectCard (props: Props) {
  
    const onProjectCardClick = () => {
        
    }
    return (
    /* <Router.Routes>
        <Router.Route path="/project" element={ */
            <div className="project-card" onClick={onProjectCardClick}>
                <div className="card-header">
                    <p className="initials" style={{ background: props.project.inColor }}>
                        { props.project.initials }
                    </p>
                    <div>
                    <h4>
                        { props.project.name }
                    </h4>
                    <p style={{ color: "#969696" }}>
                    { props.project.description }
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
                        { props.project.cost }
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
