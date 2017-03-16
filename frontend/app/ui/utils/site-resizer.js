export default class SiteResizer {
    static resize(site, direction, offset) {

      function moveNodes(site, offset) {
        for (var i = 0; i < site.nodes.length; i++) {
          site.nodes[i].move(offset.inverse());
        }
      }

      switch (direction) {
        case 'left':
          if(site.width - offset.xOffset >= 200) {
            let lDelta = offset.yReset().half();
            site.move(lDelta);
            moveNodes(site, lDelta);
            site.width = site.width - offset.xOffset;
          }
          break;
        case 'right':
          if(site.width + offset.xOffset >= 200) {
            let rDelta = offset.yReset().half();
            site.move(rDelta);
            moveNodes(site, rDelta);
            site.width = site.width + offset.xOffset;
          }
          break;
        case 'top':
          if(site.height - offset.yOffset >= 200) {
            let tDelta = offset.xReset().half();
            site.move(tDelta);
            moveNodes(site, tDelta);
            site.height = site.height - offset.yOffset;
          }
          break;
        case 'bottom':
          if(site.height + offset.yOffset >= 200) {
            let bDelta = offset.xReset().half();
            site.move(bDelta);
            moveNodes(site, bDelta);
            site.height = site.height + offset.yOffset;
          }
          break;
      }
    }
};
