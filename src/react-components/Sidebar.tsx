import * as React from "react"
import * as Router from "react-router-dom"

export function Sidebar() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const assetPath = isDevelopment ? './assets/' : '/3d-ifc-co2/assets/';

    return (
        <aside id="sidebar">
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <div className="container-fluid logo-container">
                    <img className="logo-image" src={`${assetPath}logo-dark.png`} alt=""></img>
                    <a className="navbar-brand fw-bold" href="../">
                        <div>
                            slad.ai
                            <span className="badge rounded-pill bg-danger">
                                beta
                            </span>
                        </div>
                    </a>
            </div></nav>
            <ul id="nav-buttons">
                <Router.Link to="/3d-ifc-co2/">
                    <li id="menu-project-btn"><span  className="material-symbols-rounded">apartment</span>
                        Projects
                    </li>
                </Router.Link>
                <Router.Link to="/3d-ifc-co2/materials">
                    <li><span className="material-symbols-rounded">folder</span>
                        Material Library
                    </li>
                </Router.Link>
                <Router.Link to="/3d-ifc-co2/components">
                    <li><span className="material-symbols-rounded">notebook</span>
                        Components Library
                    </li>
                </Router.Link>
            </ul>
        </aside>
    ) 
}