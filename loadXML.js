
//	handle the ajax
//	load all the files
function loadXML( filename, callback)
{
	$.ajax({
		type: "GET",
		url: filename,
		dataType: "xml",
		success: callback
	});
}