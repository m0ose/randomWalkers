	/* * Developer : Cody Smith * Date : 7.NOV.2011 * All code © 2011 RedfishGroup LLC, all rights reserved */

function randomWalkers(nodes, bounds, options)
{


	this.agents = [];
	
	this.nodes = nodes;
	this.bounds = bounds;
	//check inputs
	if( !nodes ) logIt("ERROR: nodes not specified in randomWalkers",1);
	if( !bounds ) logIt("ERROR: bounds not specified in randomWalkers",1);
	if(!options) options = {};
	if(!options.population) options.population = 10;
	
	this.options = options;
	logIt( " random walkers called with " + this.options.population + " agents ");
	this.init = function()
	{
		this.agents = this.placePopulationRandomly();
	}
	
	this.placePopulationRandomly =  function()
	{
		var agents = [];
		var node, tmpnode = null;
		var trys, rnd = 0;
		var nodesCount = this.nodes.list.length;
		for( var n = this.options.population; n > 0 ; n--)
		{
			//choose node randomly
			node = null;
			trys = 0;
			while( !node ){
				rnd = Math.floor( Math.random() * nodesCount);
				tmpnode = this.nodes[ this.nodes.list[rnd]];
				if(!tmpnode){
					logIt("broken node??",1);
					break;
				}
				else if(tmpnode.edges.length > 0){
					node = tmpnode;
				}
				
				if(trys > 1000){
					logIt('problem finding connected nodes',1);
					break;
				}
				rnd = (rnd + 1)%
				trys++;	
			}
			agents.push( new agent(node));
		}
		return agents;
	}	
	
	this.moveAgents = function()
	{
		for( var i = this.agents.length - 1; i >= 0; i--){
			this.agents[i].move();
		}
	}
	
	this.drawAgents = function(canvas)
	{	
		//TODO: make this store the canvas 
		if (!canvas){
			canvas = document.getElementsByClassName('agentCanvas');
	}
	if(!canvas || canvas.length <= 0)
			canvas = document.getElementById('ovrLay_canvas');
	if( !canvas || canvas.length <= 0){
		logIt("ERROR: can't draw with out an agent canvas specified", 1);
		return;
	}
	if(canvas.length > 0)
		canvas = canvas[0];
		
		ctx = canvas.getContext('2d');
		ctx.fillStyle = "rgb(0,0,200)";
		var Wid = canvas.width;
		var Hei = canvas.height;
		ctx.clearRect(0,0,Wid,Hei);
		
		var agent = null;
		for( var i=this.agents.length - 1; i >= 0; i-- )
		{
			agent = this.agents[i];
			ctx.fillRect(agent.x * Wid - 3, agent.y * Hei - 3, 7, 7);
		}
		ctx.stroke();
	}


	this.init();
}