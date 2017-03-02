export default class MapRender {
    constructor(viewport, ctx, siteRender, nodeRender, linkRender) {
        this.ctx = ctx;
        this.viewport = viewport;
        this.siteRender = siteRender;
        this.nodeRender = nodeRender;
        this.linkRender = linkRender;
    }
    render(map) {
        for (var iSite = 0; iSite < map.sites.length; iSite++) {
            var site = map.sites[iSite];
            this.siteRender.render(site);
        }
        for (var iLink = 0; iLink < map.links.length; iLink++) {
            var link = map.links[iLink];
            this.linkRender.render(link);
        }
        for (var iNode = 0; iNode < map.nodes.length; iNode++) {
            var node = map.nodes[iNode];
            this.nodeRender.render(node);
        }
    }
};
