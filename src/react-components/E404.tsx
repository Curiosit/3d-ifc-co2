import * as React from "react"
import { Project } from "../classes/Project"

interface Props {
  message: string
}

export function E404(props: Props) {

    return <div style={{ alignItems: "center", padding: "50px" }}>
        <span
            
            className="material-icons-round error"
            
          ></span>
          <h1>Error 404</h1>
        <div>The requested site cannot be found!</div>
    </div>
}