export default class NodeIcons {
  constructor(nodeTypes, isScaleInRangeFn) {
    this.nodeTypes = nodeTypes;
    this.isScaleInRangeFn = isScaleInRangeFn;
  }
  getIconFor(node) {
    return this._selectIconForCurrentScale(this.nodeTypes.lookup(node.type).icons);
  }
  sizeFor(node) {
    let icon = this.getIconFor(node);
    return [icon.image.width, icon.image.height];
  }
  _selectIconForCurrentScale(icons) {
    let src = Object.keys(icons);
    for (var i = 0; i < src.length; i++) {
      let iconProps = icons[src[i]];
      if (this.isScaleInRangeFn(iconProps.range)) {
        return iconProps;
      }
    }
    return icons[src[0]];
  }
};
