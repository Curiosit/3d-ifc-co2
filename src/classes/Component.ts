export interface IComponent {
    name: string;

  }

  export class Component implements IComponent {

    //From interface
    name: string;



    //
    id: string;
    layers: string;
    subtype: string;


      constructor(name: string, id: string, layers: string, subtype: string) {
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
