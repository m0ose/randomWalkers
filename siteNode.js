/* * Developer : Cody Smith * Date : 7.NOV.2011 * All code © 2011 RedfishGroup LLC, all rights reserved */
/*
 * 
 *  This is an hotel bar resturant node. Agents come in here and stay.
 *  There is a schedule that is calculated by ocEQ() . 
 * 
 */

function siteNode(id, lat, lon, myBounds, averageOccupancy, type){
	 
		var baseNode = new node(id, lat, lon, myBounds);
		if(! averageOccupancy )
			averageOccupancy = 30;
		baseNode.averageOccupancy = averageOccupancy;
		baseNode.occupants = 0;// they all start with zero occupants
		baseNode.type = type;
		//t is in terms of a 24 hourday
	
		baseNode.ocEQ = function(t){
			var res = 0;
			if( this.type == 'hotel'){
				//res = -Math.pow((t%24),2)/80;
				//res = this.averageOccupancy * Math.pow(Math.E,res);
				res =  (Math.cos(Math.PI*t/12)+1)/1;
				if(res > 1)
					res=1;
				res = this.averageOccupancy * res;
			}
			else if( this.type == 'bar'){
				res = -Math.pow(((t%24) - 14),2)/2;
				res = this.averageOccupancy * Math.pow(Math.E,res);
			}
			else{
				log.error(" un-matched type of siteNode");
				logIt(" unknown type of siteNode",1);
			}
			return Math.floor(res);
		}
		
		baseNode.checkin = function( )
		{
			//if there is room stay here(true) else leave(false)
			if( this.ocEQ(_timeOfDay) > this.occupants ){
			//	console.log(this.id + "checkin" + this.occupancy + " // " + this.averageOccupancy);
				return true; 
			}
			//else 
			return false;
		}
		baseNode.checkout = function()
		{
			if(this.checkin())
				return false;
			//console.log(this.id + " checkout" + this.occupancy + " / " + this.averageOccupancy);
			//else	
			//this.occupancy--;
			return true;
		}

		return baseNode;
	}