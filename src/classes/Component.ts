export interface IComponent {
    name: string;

  }

  export enum ComponentSubtype {
    Wall = "wall",
    Roof = "roof",
    Slab = "slab",
    Ceiling = "ceiling",
    Door = "door",
    Window = "window",
    Foundation = "foundation",
    Stair = "stair",
    Other = "other"
}

export class Component implements IComponent {
    name: string;
    id: string;
    layers: string;
    subtype: ComponentSubtype;

    constructor(name: string, id: string, layers: string, subtype: ComponentSubtype) {
        this.name = name;
        this.id = id;
        this.layers = layers;
        this.subtype = subtype;
    }

    toPlainObject(): { [key: string]: any } {
        return {
            name: this.name,
            id: this.id,
            layers: this.layers,
            subtype: this.subtype
        };
    }
}