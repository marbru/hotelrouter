
function findHotels(points){
	
	var date = document.getElementById("date").value;
	var budget = document.getElementById("budget").value;
	var people = document.getElementById("people").value;
	var radious = document.getElementById("radious").value;

	console.log ("points "+points);
	
	document.getElementById("searchResults").innerHTML = points.length + " points returned by Google</br>";
	//alert("l "+points.length);
	var hotelsFound = parseInt(0);
	var processedPoints = 0;
	var previousLat = 0;
	var previousLon = 0;
	
	for (var i =0; i<points.length;i++){
		try{
			var point = points[i];
			var lat = point.jb;
			var lon = point.kb;
			
			var dist =calcDist(previousLon,previousLat,lon,lat);
			console.log("new point "+points[i]+" :dist from previous "+dist);
			
			pointsMod = Math.round(points.length / 100);
			if (dist>radious*2){
				processedPoints++;
				previousLon = lon;
				previousLat = lat;
				
				var dateobj = new Date();
				var dateparts = date.split("/"); //MM/DD/YYYY format
				dateobj.setFullYear(dateparts[2], dateparts[0], dateparts[1]);
				var nextdate =new Date(dateobj.getTime()+(24 * 60 * 60 *1000));
				
				//alert("date: "+dateobj+"---next: "+nextdate);
				
				arrdate = date
				dptdate = ("0" + (nextdate.getMonth() )).slice(-2)+"/"+
						("0" + nextdate.getDate()).slice(-2)+"/"+
						nextdate.getFullYear();
				//alert("date: "+date+"---next: "+dptdate);
				
				hotelsFound += parseInt(findHotel(lon,lat,arrdate,dptdate,budget,people,radious));
				
			}
			
		} catch (e){
			console.log("error processing point: "+e);
		}
		
		//var myLatlng = new google.maps.LatLng(lat,lon);
	//	console.log("Painting "+lon+" "+lat);
		//setPoint(myLatlng, 'home.png',  " ", null);
	}
	
	document.getElementById("searchResults").innerHTML += processedPoints + " requests made to expedia </br>";
	document.getElementById("searchResults").innerHTML += hotelsFound+ " hotel(s) found </br>";

	//alert("processed points: "+processedPoints);
}

function newAjax(url) {
    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open("GET",url,false);
    xmlhttp.send();

    hostipInfo = xmlhttp.responseText.split("\n");

    return hostipInfo;
}

function findHotel(lon,lat,arrdate,dptdate,budget,people,radious){
		
	//var requestStr = "http://api.ean.com/ean-services/rs/hotel/v3/list?latitude="+lat+"&longitude="+long+"&searchRadius=1&apiKey=rjge84jyvpv8dgmw7pckam56";
	
	//requestStr = "http://api.ean.com/ean-services/rs/hotel/v3/list?latitude=$lat&longitude=$lon&searchRadius=$rad&apiKey=rjge84jyvpv8dgmw7pckam56";
	
	
	var query = 
	    // user parameters
		"latitude="+lat+
		"&longitude="+lon+
		"&arrivalDate="+arrdate+ //MM/DD/YYYY format
		"&departureDate="+dptdate+
		"&maxRate="+budget+
		"&room1="+people+
		"&radious="+radious;

	requestStr = "./requestEAN.php?"+query;
	console.log("requests "+requestStr);
	//var response = newAjax(requestStr);
	//restrequest(requestStr);
	var response = ajax(requestStr);
	console.log ("php response "+response);
	var resp_object = JSON.parse(response);
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
		
		var hotels = parseInt(resp_object.HotelListResponse.HotelList["@size"] );
		console.log("number of hotels found: "+hotels);
	} catch (e){
		console.log ("invalid hotels number "+e);
		var hotels = 0;
	}	

	if (hotels==1){
		var hotel = resp_object.HotelListResponse.HotelList.HotelSummary;
		console.log("hotel name "+hotel.name);

		printHotel(hotel);
	} else if (hotels>1) {
		for (var i=0; i<hotels;i++) {
			var hotel = resp_object.HotelListResponse.HotelList.HotelSummary[i];
			console.log("hotel name "+hotel.name);
			printHotel(hotel);
		}
	} else {
		console.log ("No hotels near "+lon+" "+lat);
	}
	
	return hotels;
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
	//var icon = 'http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-8c4eb8/shapecolor-white/shadow-1/border-color/symbolstyle-color/symbolshadowstyle-no/gradient-no/hotel_0star.png';
	var icon = "images/hotel.png";
	var myLatlng = new google.maps.LatLng(hotel.latitude,hotel.longitude);
	
	var content = formatedHotel(hotel) + 
		"<input type='button' value='Choose this' onclick='chooseHotel("+JSON.stringify(hotel)+")'/>";
					
    setPoint(myLatlng, icon, content, null);
}

