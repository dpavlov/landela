export default class MapRender {
    constructor(viewport, ctx, nodeRender) {
        this.ctx = ctx;
        this.viewport = viewport;
        this.nodeRender = nodeRender;
    }
    render(map) {
        for (var iNode = 0; iNode < map.nodes.length; iNode++) {
            var node = map.nodes[iNode];
            this.nodeRender.render(node);
        }
    }
};
