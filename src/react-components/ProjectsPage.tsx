import * as React from "react"

export function ProjectsPage() {
    
    

    return (
        <div className="page" id="projects-page">
            <dialog id="new-project-modal">
                <form id="new-project-form">
                <h2>New Project</h2>
                <div className="input-list">
                    <div className="form-field-container">
                    <label>
                        <span className="material-symbols-rounded">apartment</span>Name
                    </label>
                    <input
                        name="name"
                        type="text"
                        placeholder="What's the name of your project?"
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
                        <span className="material-symbols-rounded">subject</span>Description
                    </label>
                    <textarea
                        cols={30}
                        rows={3}
                        name="description"
                        placeholder="Give your project a nice description! So people are jealous about it."
                        defaultValue={""}
                    />
                    </div>
                    <div className="form-field-container">
                    <label>
                        <span className="material-symbols-rounded">person</span>Role
                    </label>
                    <select name="userRole">
                        <option>Architect</option>
                        <option>Engineer</option>
                        <option>Developer</option>
                    </select>
                    </div>
                    <div className="form-field-container">
                    <label>
                        <span className="material-symbols-rounded">
                        not_listed_location
                        </span>
                        Status
                    </label>
                    <select name="status">
                        <option>pending</option>
                        <option>active</option>
                        <option>finished</option>
                    </select>
                    </div>
                    <div className="form-field-container">
                    <label htmlFor="createdDate">
                        <span className="material-symbols-rounded">calendar_month</span>
                        Created Date
                    </label>
                    <input id="createdDate" type="date" name="createdDate" />
                    </div>
                    <div className="form-field-container">
                    <label htmlFor="finishDate">
                        <span className="material-symbols-rounded">calendar_month</span>
                        Finish Date
                    </label>
                    <input id="finishDate" type="date" name="finishDate" />
                    </div>
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
                    >
                        Cancel
                    </button>
                    <button type="submit" className="positive">
                        Accept
                    </button>
                    </div>
                </div>
                </form>
            </dialog>
            <header>
                <h2>
                <span className="material-symbols-rounded">folder_copy</span> Projects
                </h2>
                <div style={{ display: "flex", alignItems: "center", columnGap: 15 }}>
                <span
                    id="import-projects-btn"
                    className="material-symbols-rounded action-icon"
                >
                    file_upload
                </span>
                <span
                    id="export-projects-btn"
                    className="material-symbols-rounded action-icon"
                >
                    file_download
                </span>
                <button id="new-project-btn">
                    <span className="material-symbols-rounded">note_add</span> New project
                </button>
                </div>
            </header>
            <div id="projects-list"></div>
        </div>

    ) 
}