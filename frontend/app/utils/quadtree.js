export default class Quadtree {
	constructor(bounds, boundsLookupFn, checkIntersectionFn, max_objects, max_levels, level) {
		this.max_objects					= max_objects || 10;
		this.max_levels						= max_levels || 4;

		this.level 		    				= level || 0;
		this.bounds 		  				= bounds;

		this.objects 		  				= [];
		this.nodes 		    				= [];
		this.boundsLookupFn 			= boundsLookupFn;
		this.checkIntersectionFn 	= checkIntersectionFn ? checkIntersectionFn : this.innerCheckIntersection
	}

	split() {
		var nextLevel	= this.level + 1,
			subWidth	= Math.round( this.bounds.width / 2 ),
			subHeight = Math.round( this.bounds.height / 2 ),
			x 		    = Math.round( this.bounds.x ),
			y 		    = Math.round( this.bounds.y );

		this.nodes[0] = new Quadtree({
			x	: x + subWidth,
			y	: y,
			width	: subWidth,
			height	: subHeight
		}, this.boundsLookupFn, this.checkIntersectionFn, this.max_objects, this.max_levels, nextLevel);

		this.nodes[1] = new Quadtree({
			x	: x,
			y	: y,
			width	: subWidth,
			height	: subHeight
		}, this.boundsLookupFn, this.checkIntersectionFn, this.max_objects, this.max_levels, nextLevel);

		this.nodes[2] = new Quadtree({
			x	: x,
			y	: y + subHeight,
			width	: subWidth,
			height	: subHeight
		}, this.boundsLookupFn, this.checkIntersectionFn, this.max_objects, this.max_levels, nextLevel);

		this.nodes[3] = new Quadtree({
			x	: x + subWidth,
			y	: y + subHeight,
			width	: subWidth,
			height	: subHeight
		}, this.boundsLookupFn, this.checkIntersectionFn, this.max_objects, this.max_levels, nextLevel);
	}

	getObjects() {
		let returnObjects = [];
		for( var i = 0; i < this.nodes.length; i=i+1 ) {
			returnObjects = returnObjects.concat( this.nodes[i].getObjects() );
		}
		return returnObjects;
	}

	getIndex(pRect) {
		var index 			    = -1,
			verticalMidpoint 	= this.bounds.x + (this.bounds.width / 2),
			horizontalMidpoint 	= this.bounds.y + (this.bounds.height / 2),
			//pRect can completely fit within the top quadrants
			topQuadrant = (pRect.y < horizontalMidpoint && pRect.y + pRect.height < horizontalMidpoint),

			//pRect can completely fit within the bottom quadrants
			bottomQuadrant = (pRect.y > horizontalMidpoint);

		//pRect can completely fit within the left quadrants
		if( pRect.x < verticalMidpoint && pRect.x + pRect.width < verticalMidpoint ) {
			if( topQuadrant ) {
				index = 1;
			} else if( bottomQuadrant ) {
				index = 2;
			}

		//pRect can completely fit within the right quadrants
		} else if( pRect.x > verticalMidpoint ) {
			if( topQuadrant ) {
				index = 0;
			} else if( bottomQuadrant ) {
				index = 3;
			}
		}

		return index;
	}

	_toRect(node) {
		return this.boundsLookupFn(node);
	}

	insert(node) {
		var i = 0,
	 		index;
		let pRect = this._toRect(node);
		if( typeof this.nodes[0] !== 'undefined' ) {
			index = this.getIndex( pRect );

		  	if( index !== -1 ) {
				this.nodes[index].insert( node );
			 	return;
			}
		}

	 	this.objects.push( node );

		if( this.objects.length > this.max_objects && this.level < this.max_levels ) {

			if( typeof this.nodes[0] === 'undefined' ) {
				this.split();
			}

			while( i < this.objects.length ) {

				index = this.getIndex( this._toRect(this.objects[ i ]) );

				if( index !== -1 ) {
					this.nodes[index].insert( this.objects.splice(i, 1)[0] );
				} else {
					i = i + 1;
			 	}
		 	}
		}
	}

	remove(obj) {
    let oIndex = this.objects.indexOf(obj);
		if (oIndex === -1) {
			if( typeof this.nodes[0] !== 'undefined' ) {
					let pRect = this._toRect( obj );
					let index = this.getIndex( pRect );

			  	if( index !== -1 ) {
					return this.nodes[index].remove( obj );
				}
			}
			return false;
		} else {
			this.objects.splice(oIndex, 1);
			if (this.getObjects().length === 0) {
				this.nodes = [];
			}
			return true;
		}
	}

	retrieve( pRect ){

		var index 		  = this.getIndex( pRect ),
			returnObjects = this.objects;

		if( typeof this.nodes[0] !== 'undefined' ) {

			if( index !== -1 ) {
				returnObjects = returnObjects.concat( this.nodes[index].retrieve( pRect ) );
			} else {
				for( var i = 0; i < this.nodes.length; i = i + 1 ) {
					returnObjects = returnObjects.concat( this.nodes[i].retrieve( pRect ) );
				}
			}
		}

		return returnObjects;
	};

	find( point ){
    var index = this.getIndex( {x: point.x, y: point.y, width: 0, height: 0} );
		for( var i = 0; i < this.objects.length; i = i + 1 ) {
			if (this.checkIntersectionFn(point, this.objects[i])) {
				return this.objects[i];
			}
		}

		if( typeof this.nodes[0] !== 'undefined' ) {
			return this.nodes[index].find(point);
		}

		return null;
	};

	innerCheckIntersection(point, obj) {
		return this.intersection(point, this._toRect(obj))
	}

	intersection(point, rect) {
    	return point.x >= rect.x && point.x <= rect.x + rect.width && point.y <= rect.y && point.y >= rect.y - rect.height;
	}

	visit(visitor) {
		for( var i = 0; i < this.objects.length; i = i + 1 ) {
			visitor(this.objects[i], this._toRect(this.objects[i]));
		}

		for( var i=0; i < this.nodes.length; i=i+1 ) {
			if( typeof this.nodes[i] !== 'undefined' ) {
				this.nodes[i].visit(visitor);
		  }
		}
	}

	clear() {

		this.objects = [];

		for( var i=0; i < this.nodes.length; i=i+1 ) {
			if( typeof this.nodes[i] !== 'undefined' ) {
				this.nodes[i].clear();
		  }
		}

		this.nodes = [];
	};
}
