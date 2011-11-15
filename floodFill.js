function floodFill(srcNodeName)
{
	var nodes = _nodes;
	var srcN = nodes.getNode(srcNodeName);
	var N1id, N1, N2id,N2, dist2src,numIters=0;
	/// the queues
	Q1 = [srcN];
	Q2 = [];
	//prepare first node
	if(!srcN.distances)
		srcN.distances={};
	srcN.distances[srcNodeName]= 0;
	
	while(Q1.length>0){
		numIters ++;
		//console.log("Q1 length" + Q1.length);

		if(numIters > 200){
			console.log( " flood fill break . iterations > MAX");
			return;
		}
		for( var n = Q1.length-1; n >= 0 ; n--){
			N1 = Q1[n];
			dist2src = N1.distances[srcNodeName];
			//check all neighbors of Q1
			for( var i = N1.edges.length-1; i >= 0; i--  ){
				N2 = N1.getEdge(i);
				if( !N2.distances){
					N2.distances = {};
				}
				if( !N2.distances[srcNodeName]){//un-visited. go here
					var newDist =  dist2src + Math.sqrt( Math.pow(N1.x - N2.x, 2) + Math.pow(N1.x - N2.x, 2)); 
					N2.distances[srcNodeName] = newDist;
					Q2.push(N2);//check this next loop around
				}//...if
			}//...for Q1.edges
		}//...for Q1
		//swap queues
		Q1 = Q2;
		Q2 = [];
	}//...while Q1
	
}
function testFloodFill()
{
	floodFill("27178183");
	drawMap();
}