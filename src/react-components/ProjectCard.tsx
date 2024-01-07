import * as React from 'react'

export function ProjectCard () {
  
    
    return (
    <div className="project-card">
        <div className="card-header">
            <p className="initials" style={{ background: "#ff00ff" }}>
            PC
            </p>
            <div>
            <h4>
                Project Name
            </h4>
            <p>
                Description
            </p>
            </div>
        </div>
        <div className="card-content">
            <div className="card-property">
            <p style={{ color: "#969696" }}>Status</p>
            <p>
                Active
            </p>
            </div>
            <div className="card-property">
            <p style={{ color: "#969696" }}>Role</p>
            <p>
                Architect
            </p>
            </div>
            <div className="card-property">
            <p style={{ color: "#969696" }}>Cost</p>
            <p>
                $110000
            </p>
            </div>
            <div className="card-property">
            <p style={{ color: "#969696" }}>Estimated Progress</p>
            <p>
                75%
            </p>
            </div>
        </div>
    </div>

  )
}
