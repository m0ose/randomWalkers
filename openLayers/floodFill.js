function floodFill(srcNodeName)
{
	var nodes = this.nodes;
	var srcN = nodes.srcNodeName;
	var N1id, N1, N2id,N2, dist2src;
	/// the queues
	Q1 = [srcN];
	Q2 = [];
	//prepare first node
	if(!srcN.distances)
		srcN.distance={};
	srcN.distances.srcNodeName= 0;
	
	while(Q1.length){
		for( var n = Q1.length-1; n >= 0 ; n--){
			N1id = Q1[n];
			N1 = nodes.N1id;
			dist2src = N1.distance.srcNodeName;
			//check all neighbors of Q1
			for( var i = N1.edges.length-1; i >= 0; i--  ){
				N2id = N1.edges[i];
				N2 = nodes( N2id)
				if( !N2.distances.srcNodeName){//un-visited. go here
					//compute distances
					N2.distances.srcNodeName = Math.sqrt( Math.pow(N1.x - N2.x, 2) + Math.pow(N1.x - N2.x, 2)); 
					Q2.push(N2);//check this next loop around
				}//...if
			}//...for Q1.edges
		}//...for Q1
		//swap queues
		Q1 = Q2;
		Q2 = [];
	}//...while Q1
	
}