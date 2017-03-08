import Node from '../../map/node';
import Site from '../../map/site';
import Port from '../../map/port';
import Link from '../../map/link';
import LinkControl from '../../map/link';

import NodeSet from '../../map/node-set';

export default class Selection {
	constructor(render) {
    this.render = render;
		this.selectedSet = new NodeSet();
	}
	select(target, updateCallback, doneCallback) {
    if (target instanceof Port) {
      if (target.isSelected()) {
        target.deselect();
      } else {
        target.select();
      }
      doneCallback(this.selectedSet);
    } else if (target instanceof Node) {
      if (target.isSelected()) {
        target.deselect();
        this.render.deselectNode(target, updateCallback, () => {
          this.selectedSet.remove(target);
          doneCallback(this.selectedSet);
        });
      } else {
        this.render.selectNode(target, updateCallback, () => {
          target.select();
          this.selectedSet.add(target);
          doneCallback(this.selectedSet);
        });
      }
    } else if (target instanceof Link) {
      if (target.isSelected()) {
        target.deselect();
      } else {
        target.select();
      }
      doneCallback(this.selectedSet);
    }	else if (target instanceof Site) {
      if (target.isSelected()) {
        target.deselect();
      } else {
        target.select();
      }
      doneCallback(this.selectedSet);
    }
	}
}
