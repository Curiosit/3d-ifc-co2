import * as React from "react"

export function ProjectDetailsPage() {
    return(
            <div className="page" id="project-details" >
                <dialog id="edit-project-modal">
                    <form id="edit-project-form">
                    <h2>Edit Project</h2>
                    <div className="input-list">
                        <div className="form-field-container">
                        <label>
                            <span className="material-symbols-rounded">apartment</span>Name
                        </label>
                        <input
                            data-edit-project-info="name"
                            name="name"
                            type="text"
                            placeholder="What's the name of your project?"
                        />
                        </div>
                        <div className="form-field-container">
                        <label>
                            <span className="material-symbols-rounded">subject</span>Description
                        </label>
                        <textarea
                            data-edit-project-info="description"
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
                        <select data-edit-project-info="userRole" name="userRole">
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
                        <select data-edit-project-info="status" name="status">
                            <option>pending</option>
                            <option>active</option>
                            <option>finished</option>
                        </select>
                        </div>
                        <div className="form-field-container">
                        <label>
                            <span className="material-symbols-rounded">monetization_on</span>
                            Cost
                        </label>
                        <input
                            data-edit-project-info="cost"
                            name="cost"
                            type="text"
                            placeholder="Cost of your project..."
                        />
                        </div>
                        <div className="form-field-container">
                        <label>
                            <span className="material-symbols-rounded">clock_loader_40</span>
                            Progress
                        </label>
                        <input
                            data-edit-project-info="progress"
                            name="progress"
                            type="text"
                            placeholder="Progress in %"
                        />
                        </div>
                        <div className="form-field-container">
                        <label htmlFor="finishDate">
                            <span className="material-symbols-rounded">calendar_month</span>
                            Created Date
                        </label>
                        <input
                            data-edit-project-info="createdDate"
                            id="edit-created-date"
                            type="date"
                            name="createdDate"
                        />
                        </div>
                        <div className="form-field-container">
                        <label htmlFor="finishDate">
                            <span className="material-symbols-rounded">calendar_month</span>
                            Finish Date
                        </label>
                        <input
                            data-edit-project-info="finishDate"
                            id="edit-finish-date"
                            type="date"
                            name="finishDate"
                        />
                        </div>
                        <div
                        style={{
                            display: "flex",
                            margin: "10px 0px 10px auto",
                            columnGap: 10
                        }}
                        >
                        <button
                            id="close-edit-project-modal-btn"
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
                <dialog id="add-to-do-modal">
                    <form id="add-to-do-form">
                    <h2>Add a new task</h2>
                    <div className="input-list">
                        <div className="form-field-container">
                        <label>
                            <span className="material-symbols-rounded">tag</span>Name
                        </label>
                        <input
                            add-to-do-info="name"
                            name="name"
                            type="text"
                            placeholder="What's the name of this task?"
                        />
                        </div>
                        <div className="form-field-container">
                        <label>
                            <span className="material-symbols-rounded">subject</span>Description
                        </label>
                        <textarea
                            add-to-do-info="description"
                            cols={30}
                            rows={3}
                            name="description"
                            placeholder="Describe the task in details."
                            defaultValue={""}
                        />
                        </div>
                        <div className="form-field-container">
                        <label>
                            <span className="material-symbols-rounded">
                            not_listed_location
                            </span>
                            Status
                        </label>
                        <select add-to-do-info="status" name="status">
                            <option>pending</option>
                            <option>active</option>
                            <option>finished</option>
                        </select>
                        </div>
                        <div className="form-field-container">
                        <label>
                            <span className="material-symbols-rounded">
                            not_listed_location
                            </span>
                            Task Type
                        </label>
                        <select add-to-do-info="taskType" name="taskType">
                            <option>construction</option>
                            <option>design</option>
                        </select>
                        </div>
                        <div className="form-field-container">
                        <label htmlFor="dueDate">
                            <span className="material-symbols-rounded">calendar_month</span>
                            Due Date
                        </label>
                        <input
                            add-to-do-info="dueDate"
                            id="due-date"
                            type="date"
                            name="dueDate"
                        />
                        </div>
                        <div
                        style={{
                            display: "flex",
                            margin: "10px 0px 10px auto",
                            columnGap: 10
                        }}
                        >
                        <button
                            id="close-add-to-do-modal-btn"
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
                <dialog id="edit-to-do-modal">
                    <form id="edit-to-do-form">
                    <h2>Task</h2>
                    <div className="input-list">
                        <div className="form-field-container">
                        <label>
                            <span className="material-symbols-rounded">tag</span>Name
                        </label>
                        <input
                            edit-to-do-info="name"
                            name="name"
                            type="text"
                            placeholder="What's the name of this task?"
                        />
                        </div>
                        <div className="form-field-container">
                        <input
                            edit-to-do-info="id"
                            type="hidden"
                            name="id"
                            placeholder="ID"
                        />
                        </div>
                        <div className="form-field-container">
                        <label>
                            <span className="material-symbols-rounded">subject</span>Description
                        </label>
                        <textarea
                            edit-to-do-info="description"
                            cols={30}
                            rows={3}
                            name="description"
                            placeholder="Describe the task in details."
                            defaultValue={""}
                        />
                        </div>
                        <div className="form-field-container">
                        <label>
                            <span className="material-symbols-rounded">
                            not_listed_location
                            </span>
                            Status
                        </label>
                        <select edit-to-do-info="status" name="status">
                            <option>pending</option>
                            <option>active</option>
                            <option>finished</option>
                        </select>
                        </div>
                        <div className="form-field-container">
                        <label>
                            <span className="material-symbols-rounded">
                            not_listed_location
                            </span>
                            Task Type
                        </label>
                        <select edit-to-do-info="taskType" name="taskType">
                            <option>construction</option>
                            <option>design</option>
                        </select>
                        </div>
                        <div className="form-field-container">
                        <label htmlFor="dueDate">
                            <span className="material-symbols-rounded">calendar_month</span>
                            Due Date
                        </label>
                        <input
                            edit-to-do-info="dueDate"
                            id="due-date"
                            type="date"
                            name="dueDate"
                        />
                        </div>
                        <div
                        style={{
                            display: "flex",
                            margin: "10px 0px 10px auto",
                            columnGap: 10
                        }}
                        >
                        <button
                            id="close-edit-to-do-modal-btn"
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
                    <div></div>
                </header>
                <div className="main-page-content">
                    <div style={{ display: "flex", flexDirection: "column", rowGap: 30 }}>
                    <div className="dashboard-card" style={{ padding: "30px 0" }}>
                        <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "0px 30px",
                            marginBottom: 30
                        }}
                        >
                        <p data-project-info="initials" className="initials">
                            HC
                        </p>
                        <button id="edit-project-details-btn" className="btn-secondary">
                            <p style={{ width: "100%" }}>Edit</p>
                        </button>
                        </div>
                        <div style={{ padding: "0 30px" }}>
                        <div>
                            <h4 data-project-info="name">Hospital Center</h4>
                            <p data-project-info="description">
                            Community hospital located at downtown
                            </p>
                        </div>
                        <div
                            style={{
                            display: "flex",
                            columnGap: 30,
                            padding: "30px 0px",
                            justifyContent: "space-between"
                            }}
                        >
                            <div>
                            <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                                Status
                            </p>
                            <p data-project-info="status">active</p>
                            </div>
                            <div>
                            <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                                Cost
                            </p>
                            <p data-project-info="cost">$ 2'542.000</p>
                            </div>
                            <div>
                            <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                                Role
                            </p>
                            <p data-project-info="userRole">Engineer</p>
                            </div>
                            <div>
                            <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                                Created
                            </p>
                            <p data-project-info="createdDate">2023-05-01</p>
                            </div>
                            <div>
                            <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                                Finish Date
                            </p>
                            <p data-project-info="finishDate">2023-05-01</p>
                            </div>
                        </div>
                        <div
                            style={{
                            backgroundColor: "#404040",
                            borderRadius: 9999,
                            overflow: "auto"
                            }}
                        >
                            <div data-project-info="progress" className="progress-bar">
                            80%
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="dashboard-card" style={{ flexGrow: 1 }}>
                        <div
                        style={{
                            padding: "20px 30px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                        >
                        <h4>To-Do</h4>
                        <div
                            style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "end",
                            columnGap: 20
                            }}
                        >
                            <div
                            style={{ display: "flex", alignItems: "center", columnGap: 10 }}
                            >
                            <input
                                id="search-todo"
                                type="text"
                                placeholder="Search To-Do's by name"
                                style={{ width: "100%" }}
                            />
                            </div>
                            <button id="add-to-do-btn" className="btn-secondary">
                            <p style={{ width: "100%" }}>Add</p>
                            </button>
                        </div>
                        </div>
                        <div
                        id="to-do-list"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: "10px 30px",
                            rowGap: 20
                        }}
                        ></div>
                    </div>
                    </div>
                    <div
                    id="viewer-container"
                    className="dashboard-card"
                    style={{ minWidth: 0, position: "relative" }}
                    />
                </div>
            </div>
        

    )
}