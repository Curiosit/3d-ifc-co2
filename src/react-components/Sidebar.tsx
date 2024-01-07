import * as React from "react"

export function Sidebar() {
    
    return (
        <aside id="sidebar">
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <div className="container-fluid logo-container">
                    <img className="logo-image" src="./assets/logo-dark.png" alt=""></img>
                    <a className="navbar-brand fw-bold" href="./">
                        <div>
                            slad.ai
                            <span className="badge rounded-pill bg-danger">
                                beta
                            </span>
                        </div>
                    </a>
            </div></nav>
            <ul id="nav-buttons">
            <li id="menu-project-btn"><span  className="material-symbols-rounded">apartment</span>
                Projects
            </li>
            <li><span className="material-symbols-rounded">person</span>
                Users
            </li>
            </ul>
        </aside>
    ) 
}