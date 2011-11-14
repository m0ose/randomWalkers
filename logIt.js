	/* * Developer : Cody Smith * Date : 7.NOV.2011 * All code © 2011 RedfishGroup LLC, all rights reserved */

var _verbose = true;
function logIt(s, error)
{
	if(_verbose || error)
	{
		console.log(s);
		var logBox = document.getElementsByClassName('logBox');
		if( logBox.length > 0 )
			{
				logBox = logBox[0];//take first logBox
				if(error)
					logBox.innerHTML += "<br><b><font color='red' > " +s+ "</b>" ;
				else
					logBox.innerHTML += "<br> " +s;
			}
	}
	
}