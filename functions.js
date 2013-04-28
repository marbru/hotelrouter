var selectedHotels =  new Array(0);



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
		 //  alert(data.reponse)
        }, "json"
       );
}



function findRoute(from,to){
	//get all points	
	//var responseAjax = ajax("http://maps.googleapis.com/maps/api/directions/json?origin="+from+"&destination="+to+"&sensor=false");
	
		//var responseAPI = google.maps.directionsRequest("origin:"+from,"destination:"+to);	
	//var fromIcon = "http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-f70303/shapecolor-light/shadow-1/border-white/symbolstyle-dark/symbolshadowstyle-no/gradient-no/letter_a.png";
	//var toIcon = "http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-f70303/shapecolor-light/shadow-1/border-white/symbolstyle-dark/symbolshadowstyle-no/gradient-no/letter_b.png";
	
	
	/*var myLatlng = new google.maps.LatLng(hotel.latitude,hotel.longitude);

	var content ="";
    setPoint(from, fromIcon, content, null);
	setPoint(to, toIcon, content, null);
*/
	 directionAPI(from,to);

}
function routeInit(){
	
	showLoading();
	window.setTimeout(routeAction, 100);
}
function routeAction(){
	var from = document.getElementById("from").value;
	var to = document.getElementById("to").value;
	findRoute(from, to);
}
function chooseHotel(hotel){
	//alert ("you choosed "+name);
	
	if (!alreadySelected(hotel) ) {	
		selectedHotels.push(hotel);
		printSelectedHotels();
	}
	//alert(selectedHotels);
	
}

function alreadySelected(newHotel){
	for (var i=0; i<selectedHotels.length; i++){
		hotel = selectedHotels[i];
		if (hotel.hotelId ==newHotel.hotelId){
			return true;
		}
	}
	
	return false;
}
function removeHotels(i){
	//alert("removing "+i);
	selectedHotels.splice(i,i+1);
	
	printSelectedHotels();

}

function calculateSelectedHotelsPrice(){
	var lowPrice = 0;
	var highPrice = 0;
	for (var i=0; i<selectedHotels.length; i++){
		lowPrice += selectedHotels[i].lowRate;
		highPrice += selectedHotels[i].highRate;
	}
	
	return "Total price range: "+truncate(lowPrice)+"-"+truncate(highPrice)+" USD";
}

function formatedHotel(hotel){
	var desc = hotel.shortDescription;
		console.log("formatedHotel desc "+desc);

	//desc = desc.substring(desc.lastIndexOf("/&gt;")+5,desc.length);
	desc = desc.replace("&lt;p&gt;&lt;b&gt;Location. &lt;\/b&gt; &lt;br \/&gt;","");
	desc = desc.replace("<p><b>Location. </b> <br />",""); 
	
	
	var stars = "";
	for (var i = 0; i<hotel.hotelRating;i++){
		stars+= "<img class='icon' src='images/star.png'/>";
	}
	//desc = desc.replace("<br>",""); 
	var str =  "<div class='hotelHeader'>"+
					"<a href='"+hotel.deepLink+"' target='_blank'>"+hotel.name+" </a>"+
					stars+
				"</div><br/>"+
				"<table><tr><td>"+
					"<img src='http://images.travelnow.com"+hotel.thumbNailUrl+"'/></td>"+
					"<td>"+desc+" [...]</td>"+
				"</tr></table>"+
				"<div class='hotelFooter'>"+
					"Price range: "+hotel.lowRate+"-"+hotel.highRate+" "+hotel.rateCurrencyCode+
				"</div>";/*+
		"Rooms: <br/>";
		
	var rooms = hotel.RoomRateDetailsList;
	var roomsformated = "";
	if(rooms.length >1){
		for (var i=0; i<rooms.length; i++){
			roomsformated = roomsformated+ "\t"+ formatedRoom(rooms[i].RoomRateDetails)+"<br/>";
		}
	} else { //is 1
		roomsformated  = roomsformated+ "\t"+ formatedRoom(rooms.RoomRateDetails)+"<br/>";
	}*/
					
	return str;
}




function formatedRoom(room, hotelid){
	var result = room.roomDescription+" ("+room.currentAllotment+" left) - "+
				room.RateInfo.ChargeableRateInfo["@total"]+room.RateInfo.ChargeableRateInfo["currencyCode"];
	//result += "<input type='button' value='Book this room' onclick='bookRoom("+hotelid+","+room.roomTypeCode+")'/>"
	return result;
}

function bookRoom(hotelid, roomid){
	
}
function hideLoading(){
	document.getElementById("loadingDiv").style.visibility = "hidden";
	//window.location.reload();
}
function showLoading(){
	document.getElementById("loadingDiv").style.visibility = "visible";
	//window.location.reload();
}
function calcDist(lon1,lat1,lon2,lat2){
    var R = 3958; // Radius of earth in Miles 
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}
function truncate(n) {
  return Math[n > 0 ? "floor" : "ceil"](n);
}
function toRad(Value) {
    /** Converts numeric degrees to radians */
    return Value * Math.PI / 180;
}

function printSelectedHotels(){
	
	var content = "";
	for (var i=0; i<selectedHotels.length; i++){
		var hotel = selectedHotels[i];
		content +=	"<div class='selectedHotels'>"+
			formatedHotel(hotel)+
			"<input type='button' value='Remove' onclick='removeHotels("+i+")'/> "+ 
			"</div>";
	}
	
	content += "<div class='totalPrice alignBottom'>"+calculateSelectedHotelsPrice()+"</div>";
	var listHotels = document.getElementById("selected_hotels");
	listHotels.innerHTML = content;
	console.log("content "+content);
	console.log("selected_hotels "+document.getElementById("selected_hotels").innerHTML);
}