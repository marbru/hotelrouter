function routeAction(){
	var from = document.getElementById("from").value;
	var to = document.getElementById("to").value;
	
	findRoute(from, to);
	
}

function ajax(url) {
	if (window.XMLHttpRequest) {
		AJAX=new XMLHttpRequest();
	} else {
		AJAX=new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (AJAX) {

		AJAX.open("GET", url, false);
		//AJAX.setRequestHeader("Origin", "*");
		//AJAX.setRequestHeader("Access-Control-Request-Origin", "*");
		AJAX.send(null);
		return AJAX.responseText;
	} else {
		return false;
	} 
}

function restrequest(url){
    $.get(url,
       function(data){
		   alert(data.reponse)
        }, "json"
       );
}

function findRoute(from,to){
	//get all points	
	//var responseAjax = ajax("http://maps.googleapis.com/maps/api/directions/json?origin="+from+"&destination="+to+"&sensor=false");
	
		//var responseAPI = google.maps.directionsRequest("origin:"+from,"destination:"+to);	

	 directionAPI(from,to);

	 
	  setDirection(from,to,null);

	//alert("response "+responseAPI);

	//getjson
	//http://maps.googleapis.com/maps/api/directions/json?origin=51.563412,-0.065918&destination=36.738884,-4.438477&sensor=false
	
	//for points
		
	
}
function findHotels(points){
	console.log ("points "+points);
	console.log ("l "+points.length);
	for (var i =0; i< 20;i++){
		console.log ("point "+points[i]);

		var point = points[i];
		var lat = point.jb;
		var lon = point.kb;
		
		//var myLatlng = new google.maps.LatLng(lat,lon);
	//	console.log("Painting "+lon+" "+lat);
		//setPoint(myLatlng, 'home.png',  " ", null);
					
		findHotel(lon,lat);
	}
	
}

function newAjax(url) {
    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open("GET",url,false);
    xmlhttp.send();

    hostipInfo = xmlhttp.responseText.split("\n");

    return hostipInfo;
}
function findHotel(long,lat){
		
	//var requestStr = "http://api.ean.com/ean-services/rs/hotel/v3/list?latitude="+lat+"&longitude="+long+"&searchRadius=1&apiKey=rjge84jyvpv8dgmw7pckam56";
	requestStr = "./requestEAN.php?lat="+lat+"&lon="+long+"&rad=1";
	//console.log("requests "+requestStr);
	//var response = newAjax(requestStr);
	//restrequest(requestStr);
	var response = ajax(requestStr);
	//console.log ("php response "+response);
	resp_object = JSON.parse(response);
	//console.log(resp_object);
//	alert(responseAjax);
	
	try{
		for (var i=0; i<5;i++) {
			hotel = resp_object.HotelListResponse.HotelList.HotelSummary[i];
			var hotel_name = hotel.name;
			var hotel_lat = hotel.latitude;
			var hotel_lon = hotel.longitude;
			
			console.log("hotel name "+hotel_name);

			var hotel;
			printHotel(hotel_name,hotel_lat,hotel_lon);
		
		}
	
		
	} catch ( e) {
			console.log ("No hotels near "+long+" "+lat);
	}
	
	
}

function printHotel(name,lat,lon){
	
	var icon = 'http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-8c4eb8/shapecolor-white/shadow-1/border-color/symbolstyle-color/symbolshadowstyle-no/gradient-no/hotel_0star.png';
	var myLatlng = new google.maps.LatLng(lat,lon);
    setPoint(myLatlng, icon,  name, null);

}

