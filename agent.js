function agent( homeNode)
{
	/* * Developer : Cody Smith * Date : 7.NOV.2011 * All code © 2011 RedfishGroup LLC, all rights reserved */
	// input:
	//    actual home node
	this.homeNode = homeNode;
	this.x = homeNode.x;
	this.y = homeNode.y;
	this.lat = homeNode.lat;
	this.lon = homeNode.lon;
	this.destNode = null;
	this.speed = 0.003;
	this.dx = null;
	this.dy = null;
	this.distanceToNext = null;
	this.stepsToNextNode = 0;
	this.histLength = 5;//memory of past paths 
	this.history = new Array( this.histLength);
	this.sleeping = false;
	
	//private
	//TODO: this would be faster as a heap or something
	this.checkVisited = function( nodeId)
	{
		for( var i = this.history.length - 1; i >= 0; i--){
			if( nodeId == this.history[i] )
				return i;
		}
		return null;
	}
	this.eraseHistory = function(){
		for( var i = this.history.length - 1; i >= 0; i--){
			this.history[i] = null; 
		}
	}
	this.historyIndex = 0;
	this.visit = function( nodeId)
	{
		this.history[ this.historyIndex] = nodeId;
		this.historyIndex = (this.historyIndex+1) % this.histLength;

	}
	
	this.chooseDestination = function()
	{
		var rnd = Math.floor(Math.random() * this.homeNode.getEdges().length );
		for( var i = 0 ; i < this.homeNode.getEdges().length; i++){
			rnd = (rnd+1)%this.homeNode.getEdges().length;
			if( !this.checkVisited( this.homeNode.getEdgeName( rnd )  ))
				return this.homeNode.getEdge(rnd );
		}
		//console.log("im stuck dead end");
		// DEAD END remove some history so they can exit
		//this.history[ this.history.length ]=this.history[ this.history.length-1 ] =this.history[ this.history.length-2 ]  = '';
		this.eraseHistory();
		return this.homeNode;
	}
	this.destNode = this.chooseDestination() ;

	this.imAtDestination = function()
	{
		this.visit( this.homeNode.id);
		this.x = this.destNode.x;
		this.y = this.destNode.y;
	
		this.homeNode = this.destNode;
		this.destNode = this.chooseDestination();
		// find new destination and direction
		this.dx = this.destNode.x - this.homeNode.x;
		this.dy = this.destNode.y - this.homeNode.y;
		this.distanceToNext = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
		//normalise speed vector
		this.dx = this.speed * (this.dx/this.distanceToNext);
		this.dy = this.speed * (this.dy/this.distanceToNext);
		//find how many steps it will take between nodes
		this.stepsToNextNode = Math.floor(this.distanceToNext / this.speed);
	}

	this.move = function()
	{
		if(this.sleeping){
			if(this.homeNode.checkout()){
				this.sleeping = false;
				//console.log(this.homeNode.id +" != " +this.destNode.id);
				this.homeNode.occupants--;
			}
		}
		else{
			if(this.stepsToNextNode <= 0 ){
				this.imAtDestination();
				if(this.homeNode.checkin()){
					this.sleeping = true;
					this.homeNode.occupants++;
				}
			}
			else{
				this.stepsToNextNode = this.stepsToNextNode - 1;
				this.x += this.dx;
				this.y += this.dy;
				this.updateLatLng();
			}
		}
		
	}
	
	this.updateLatLng = function()
	{
		this.lon = this.x*(_bounds.maxlon - _bounds.minlon) + _bounds.minlon;
		this.lat = _bounds.maxlat - this.y*( (_bounds.maxlat - _bounds.minlat));
		//this is for stream lining, becuase garbage collection was going crazy
		//return convertFromModelToLatLng(this.x,this.y);
	}
	this.getLatLng = function()
	{
		return [this.lat,this.lon];
	}


}
