export interface IPRoject {
  name: string
  description: string
  status: "pending" | "active" | "finished"
  userRole: "architect" | "engineer" | "developer"
  finishDate: Date
}
export class Project implements IPRoject {
  name: string
  description: string
  status: "pending" | "active" | "finished"
  userRole: "architect" | "engineer" | "developer"
  finishDate: Date
  
  constructor(data: IPRoject) {
    this.name = data.name
    this.description = data.description
    this.status = data.status
    this.userRole = data.userRole
    this.finishDate = data.finishDate
  }
}