import CoordinateNodesIndex from './indexes/coordinate-nodes-index'

export default class Map { 
    constructor(id, name, nodes) {
        this.id = id;
        this.name = name;
        this.nodes = nodes;
    }
};