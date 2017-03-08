export default class NodeIcons {
  constructor(icons, isScaleInRangeFn) {
    this.icons = icons;
    this.isScaleInRangeFn = isScaleInRangeFn;
  }
  getIconFor(node) {
    if (node.isSelected() && this.icons[node.type + ".selected"]) {
      return this._selectIconForCurrentScale(this.icons[node.type + ".selected"]);
    } else {
      return this._selectIconForCurrentScale(this.icons[node.type + ".normal"]);
    }
  }
  sizeFor(node) {
    let icon = this.getIconFor(node);
    return [icon.image.width, icon.image.height];
  }
  _selectIconForCurrentScale(icons) {
    let src = Object.keys(icons);
    for (var i = 0; i < src.length; i++) {
      let iconProps = icons[src[i]];
      if (this.isScaleInRangeFn(iconProps.scaleRange)) {
        return iconProps;
      }
    }
    return icons[src[0]];
  }
};
