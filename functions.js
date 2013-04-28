var selectedHotels =  new Array(0);

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
	
	return "Total price range: "+lowPrice+"-"+highPrice;
}

function formatedHotel(hotel){
	var desc = hotel.shortDescription;
	//desc = desc.substring(desc.lastIndexOf("/&gt;")+5,desc.length);
	var str =  hotel.name+" "+hotel.hotelRating+"*<br/>"+
		"<img src='http://images.travelnow.com"+hotel.thumbNailUrl+"'/>"+desc+"<br/>"+
		"<a href='"+hotel.deepLink+"' target='_blank'>Link</a><br/>"+
		"Price range: "+hotel.lowRate+"-"+hotel.highRate+hotel.rateCurrencyCode+"<br/>";/*+
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

function printSelectedHotels(){
	
	var content = "";
	for (var i=0; i<selectedHotels.length; i++){
		var hotel = selectedHotels[i];
		content +=	"<input type='button' value='Remove' onclick='removeHotels("+i+")'/> "+ 
			formatedHotel(hotel);
	}
	
	content += calculateSelectedHotelsPrice();
	var listHotels = document.getElementById("selected_hotels");
	listHotels.innerHTML = content;
	console.log("content "+content);
	console.log("selected_hotels "+document.getElementById("selected_hotels").innerHTML);
}