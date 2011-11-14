	/* * Developer : Cody Smith * Date : 7.NOV.2011 * All code © 2011 RedfishGroup LLC, all rights reserved */

// Node
// edges : a list of nodes connected to this. basically edges
// x,y : normalised coordinates. 0 to 1. used mostly for drawing
function node(id, lat, lon, myBounds) {
	this.id = id;
	this.lat = Number(lat);
	this.lon = Number(lon);
	this.x = (this.lon - _bounds.minlon) / (_bounds.maxlon - _bounds.minlon);
	// compensate for latitude. longitude is smaller near the poles than it is
	// at the equator
	//this.x = this.x * Math.cos(_ang2rad * this.lat)
	//		+ (1.0 - Math.cos(_ang2rad * this.lat)) / 2;
	this.y = (_bounds.maxlat - this.lat) / (_bounds.maxlat - _bounds.minlat);
	this.edges = [];
	this.addEdge = function(nodeId) {
		this.edges.push(nodeId);
	}
	this.getEdge = function( n){
		if( n < this.edges.length )
			return _nodes[this.edges[n]];
		return null;
	}
	this.getEdgeName = function( n){
		if( n < this.edges.length )
			return this.edges[n];
		return null;
	}
	this.getLatLng = function()
	{
		return convertFromModelToLatLng(this.x,this.y);
	}

	return this;
}

function convertLatLngToModelCoords( lat,lon)
{
	var x = ( lon - _bounds.minlon) / (_bounds.maxlon - _bounds.minlon);
	// compensate for latitude. longitude is smaller near the poles than it is
	// at the equator
	//this.x = this.x * Math.cos(_ang2rad * this.lat)
	//		+ (1.0 - Math.cos(_ang2rad * this.lat)) / 2;
	var y = (_bounds.maxlat - lat) / (_bounds.maxlat - _bounds.minlat);
	return [x,y];
}
function convertFromModelToLatLng( x, y)
{
	var lon = x*(_bounds.maxlon - _bounds.minlon) + _bounds.minlon;
	var lat = _bounds.maxlat - y*( (_bounds.maxlat - _bounds.minlat));
	return [lat,lon];
}
