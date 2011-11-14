ovrLay = {}
console.log("overLayTest.js loaded");

ovrLay.Layer = OpenLayers.Class(OpenLayers.Layer, 
	{
	
	agentCanvas: null,
	isBaseLayer: false,
	
	initialize: function(name, options) 
	{
	OpenLayers.Layer.prototype.initialize.apply(this, arguments);
	//OpenLayers.Layer.prototype.moveTo.apply(this.moveTo, arguments);

	this.agentCanvas = document.createElement('canvas');
	this.agentCanvas.id = "ovrLay_canvas";
	this.agentCanvas.class = "agentCanvas";
	this.agentCanvas.style.position = 'absolute';

	// For some reason OpenLayers.Layer.setOpacity assumes there is
	// an additional div between the layer's div and its contents.
	var sub = document.createElement('div');
	sub.appendChild(this.agentCanvas);
	this.div.appendChild(sub);
	console.log("overlay added");
	return this;
	},
	moveTo: function(bounds, zoomChanged, dragging) {
		console.log("moveTo called");
	    OpenLayers.Layer.prototype.moveTo.apply(this, arguments);
	    //if (dragging)
	      //  return;
	    
	    this.agentCanvas.width = this.map.getSize().w;
	    this.agentCanvas.height = this.map.getSize().h;
	    var ctx = this.agentCanvas.getContext('2d');

	    ctx.fillStyle = 'black';
	    ctx.fillRect(0, 0, 300, 60);
	    ctx.fillStyle = "white";  
	    ctx.font="24pt Helvetica";
	    ctx.fillText("loading....", 60, 30);  
	    
	    this.drawAgentsOnOpenLayers();

	},


	 

	 drawAgentsOnOpenLayers: function()
	 {
		if(!this.agentCanvas) 
			{
				logIt("agent canvas not found");
				return;
			}
		if( !walkers  ){
			logIt("walkers not found")
			return;
		}
		var ctx = this.agentCanvas.getContext('2d');
		ctx.fillStyle = "rgba(0,0,255,0.4)";
		var Wid = this.agentCanvas.width;
		var Hei = this.agentCanvas.height;
		ctx.clearRect(0,0,Wid,Hei);

		// this was taken verbatim from  http://sloweb.org.uk/ollie/heatmap/
		// thank you. 
		// Pick some point on the map and use it to determine the offset
	    // between the map's 0,0 coordinate and the layer's 0,0 position.
	    var someLoc = new OpenLayers.LonLat(0,0);
	    var offsetX = map.getViewPortPxFromLonLat(someLoc).x -
	                  map.getLayerPxFromLonLat(someLoc).x;
	    var offsetY = map.getViewPortPxFromLonLat(someLoc).y -
	                  map.getLayerPxFromLonLat(someLoc).y;

	    //cache some values for speed
	    var mapProjection = map.getProjectionObject() ;
		 var resolution=this.map.getResolution();
		 var extent=this.map.getExtent();
		 var oneOverResolution = 1/resolution;
		 
		var ag,ltln,ol_ltln,ol_vpX,ol_vpY;
		var ol_ltln = new OpenLayers.LonLat(0, 0);
		for( var i = 0; i < walkers.agents.length; i++){
			ag = walkers.agents[i];

			ol_ltln.lat = ag.lat;
			ol_ltln.lon = ag.lon;
			//this is also slow, but haven't find a way around it.
			ol_ltln.transform(   EPSG4326, mapProjection );
			
			//this is really slow, commented out for speed, and replaced
			//ol_vp = map.getViewPortPxFromLonLat( ol_ltln);//this is really slow. really really slow.
			//below is the replacement for  map.getViewPortPxFromLonLat. much faster
			ol_vpX = oneOverResolution*(ol_ltln.lon-extent.left);
			ol_vpY = oneOverResolution*(extent.top-ol_ltln.lat);
			
			ctx.fillRect(ol_vpX-1, ol_vpY-1, 3, 3);
		}
		ctx.stroke();

		// Also taken from http://sloweb.org.uk/ollie/heatmap/
		//  It puts the canvas back to the origin( the maps 0,0)
	    this.agentCanvas.style.left = (-offsetX) + 'px';
	    this.agentCanvas.style.top = (-offsetY) + 'px';

	 },
	 
	 myGetpxFromLatLon: function (lonlat)
	 {
		 var px=null;
		 if(lonlat!=null){
			 var resolution=this.map.getResolution();
			 var extent=this.map.getExtent();
			 px=new OpenLayers.Pixel((1/resolution*(lonlat.lon-extent.left)),(1/resolution*(extent.top-lonlat.lat)));
		 	}
		 return px;
	 },


	CLASS_NAME: 'ovrLay.Layer'

});	