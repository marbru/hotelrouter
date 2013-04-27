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
function findHotels(points,arrdate,dptdate,budget,people){
	console.log ("points "+points);
	console.log ("l "+points.length);
	for (var i =0; i< 1;i++){
		console.log ("point "+points[i]);

		var point = points[i];
		var lat = point.jb;
		var lon = point.kb;
		
		//var myLatlng = new google.maps.LatLng(lat,lon);
	//	console.log("Painting "+lon+" "+lat);
		//setPoint(myLatlng, 'home.png',  " ", null);
					
		findHotel(lon,lat,arrdate,dptdate,budget,people);
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

function findHotel(long,lat,arrdate,dptdate,budget,people){
		
	//var requestStr = "http://api.ean.com/ean-services/rs/hotel/v3/list?latitude="+lat+"&longitude="+long+"&searchRadius=1&apiKey=rjge84jyvpv8dgmw7pckam56";
	
	requestStr = "http://api.ean.com/ean-services/rs/hotel/v3/list?latitude=$lat&longitude=$lon&searchRadius=$rad&apiKey=rjge84jyvpv8dgmw7pckam56";
	
	
	requestStr = "http://api.ean.com/ean-services/rs/hotel/v3/list?"+
	    // user parameters
		"latitude="+lat+
		"&longitude="+lon+
		"&arrivalDate="+arrdate+ //MM/DD/YYYY format
		"&departureDate="+dptdate+
		"&minRate=10"+
		"&maxRate="+budget+
		"&room1="+people+
		// tuning parameters
		"&searchRadius=1"+
		"&sort=OVERALL_VALUE"+
		"&includeDetails=true"+
		"&options=ROOM_RATE_DETAILS"+
		"&address=true"+
		"&propertyCategory=6"+ //all inclusive
		"&numberOfResults=3"+
		"&apkiKey=rjge84jyvpv8dgmw7pckam56";
	
	//requestStr = "./requestEAN.php?lat="+lat+"&lon="+long+"&rad=1";
	//console.log("requests "+requestStr);
	//var response = newAjax(requestStr);
	//restrequest(requestStr);
	var response = ajax(requestStr);
	//console.log ("php response "+response);
	resp_object = JSON.parse(response);
	//console.log(resp_object);
	/*
		address1: "Avenue Charles De Gaulle"
		airportCode: "LIL"
		amenityMask: 16777346
		city: "Coquelles"
		confidenceRating: 45
		countryCode: "FR"
		deepLink: "http://travel.ian.com/index.jsp?pageName=hotAvail&amp;cid=55505&amp;hotelID=110670&amp;mode=2&amp;numberOfRooms=1&amp;room-0-adult-total=2&amp;showInfo=true&amp;locale=en_US"
		highRate: 227.0363
		hotelId: 110670
		hotelInDestination: true
		hotelRating: 3
		latitude: 50.92667
		locationDescription: "In Coquelles"
		longitude: 1.79683
		lowRate: 142.7085
		name: "Holiday Inn Calais-Coquelles"
		postalCode: 62231
		propertyCategory: 1
		proximityDistance: 0.80060464
		proximityUnit: "MI"
		rateCurrencyCode: "USD"
		shortDescription: "&lt;p&gt;&lt;b&gt;Location. &lt;/b&gt; &lt;br /&gt;Holiday Inn Calais-Coquelles is located in Coquelles, close to Calais Beach and Calais Hotel de Ville. Additional area points of interest include Musee des Beaux-Arts et de"
		thumbNailUrl: "/hotels/1000000/890000/888900/888866/888866_117_t.jpg"
		tripAdvisorRating: 3.5
		*/
//	alert(responseAjax);
	
	try{
		for (var i=0; i<1;i++) {
			var hotel = resp_object.HotelListResponse.HotelList.HotelSummary[i];
			
			console.log("hotel name "+hotel.name);

			printHotel(hotel );
		
		}
	} catch ( e) {
			console.log ("No hotels near "+long+" "+lat);
	}
	
	
}



/*function printHotel(name,lat,lon,stars,photo_url,desc,link,price_low,price_high,currency){
	
	var icon = 'http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-8c4eb8/shapecolor-white/shadow-1/border-color/symbolstyle-color/symbolshadowstyle-no/gradient-no/hotel_0star.png';
	var myLatlng = new google.maps.LatLng(lat,lon);
	var content = name+" "+stars+"*<br/>"+
					"<img src='"+photo_url+"'/>"+desc+"<br/>"+
					"<a href='"+link+"' target='_blank'>Link</a><br/>"+
					"Price range: "+price_low+"-"+price_high+" "+currency+"<br/>"+
					"<input type='button' value='Choose this' onclick='chooseHotel(\""+name+"\")'/>";
					
    setPoint(myLatlng, icon, content, null);

}*/

function printHotel(hotel){
	var icon = 'http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-8c4eb8/shapecolor-white/shadow-1/border-color/symbolstyle-color/symbolshadowstyle-no/gradient-no/hotel_0star.png';
	var myLatlng = new google.maps.LatLng(hotel.latitude,hotel.longitude);
	
	var content = formatedHotel(hotel) + 
		"<input type='button' value='Choose this' onclick='chooseHotel("+JSON.stringify(hotel)+")'/>";
					
    setPoint(myLatlng, icon, content, null);
}

