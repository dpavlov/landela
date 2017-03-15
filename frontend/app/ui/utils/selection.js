import Node from '../../map/node';
import Site from '../../map/site';
import Port from '../../map/port';
import Link from '../../map/link';
import LinkControl from '../../map/link';

import MapSet from '../../map/map-set';

export default class Selection {
	constructor(render) {
    this.render = render;
		this.selectedSet = new MapSet();
	}
	select(target, updateCallback) {
		return new Promise(function(resolve, reject) {
	    if (target instanceof Port) {
	      if (target.isSelected()) {
	        target.deselect();
					this.selectedSet.removePort(target);
	      } else {
	        target.select();
					this.selectedSet.port(target);
	      }
	      resolve(this.selectedSet);
	    } else if (target instanceof Node) {
	      if (target.isSelected()) {
	        target.deselect();
	        this.render.deselect(target, updateCallback, () => {
	          this.selectedSet.removeNode(target);
	          resolve(this.selectedSet);
	        });
	      } else {
	        this.render.select(target, updateCallback, () => {
	          target.select();
	          this.selectedSet.node(target);
	          resolve(this.selectedSet);
	        });
	      }
	    } else if (target instanceof Link) {
	      if (target.isSelected()) {
	        target.deselect();
					this.selectedSet.removeLink(target);
	      } else {
	        target.select();
					this.selectedSet.link(target);
	      }
	      resolve(this.selectedSet);
	    }	else if (target instanceof Site) {
	      if (target.isSelected()) {
	        target.deselect();
	        this.render.deselect(target, updateCallback, () => {
						this.selectedSet.removeSite(target);
	          resolve(this.selectedSet);
	        });
	      } else {
	        this.render.select(target, updateCallback, () => {
	          target.select();
						this.selectedSet.site(target);
	          resolve(this.selectedSet);
	        });
	      }
	    }
		}.bind(this));
	}
}
