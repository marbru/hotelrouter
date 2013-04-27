
/**
	*PAR��METROS DE MAPA (deben tener un m��todo en la p��gina que contiene el mapa)
	*/


/*getPosiciones()
	*Devuelve una cadena con el las personas, su  nombre y sus posiciones
	*formato: nombre1;posicion1;posicion2;posicion3...|nombre2;posicion1;posicion2;posicion3...
	*las posiciones se ordenan decrecientemente (el ��ltimo primero)
	*/
var posiciones ;
/*
	*getImagenP()
	*Devuelve una cadena con la ruta relativa a la imagen del punto INICIAL
	*
	*/
var imagenPunto;
/*getReload()
	*Devuelve un booleano que define si se debe refrescar el mapa o no, tras obtener el booleano se pone a false
	*formato: 'true' o 'false'
	*/
var reload;

/**
	*getAction()
	*Acci��n del mapa al hacer click (por defecto:mover);
	*/
var action;


//VARIABLES INTERNAS
var registros = [];
var map;
//var gdir;
//var geocoder = null;
//var addressMarker;
//dibujo polil��neas
var isClosed = false;
var poly;

var debug = false;
var reloadTimer = null;
// var xmlHttp = new XMLHttpRequest ();
//var onWebCall = false;
var directionsService;
//setReloadTime(1);

function initialize(){
	if (debug) alert('initMap ');
	//map = new google.maps.Map(document.getElementById("mapa_ruta"), myOptions);
	 var mapOptions = {
    zoom: 18,
    center: new google.maps.LatLng(51.519452,-0.127029),
    mapTypeId: google.maps.MapTypeId.HYBRID
  }
  //var center = new google.maps.LatLng(36.7236,-4.3937);
   directionsService = new google.maps.DirectionsService();
   map = new google.maps.Map(document.getElementById("mapa_ruta"), mapOptions);
}
function loadScript() {
	
	if (debug) alert('initialize ');
	//initMap();
	
	 var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyCftxbEPwtzi8AMzTNQZYfxfZjHzJgtY5s&sensor=false&callback=initialize";
	document.body.appendChild(script);
}

function directionAPI(from,to){
	var directionService = new google.maps.DirectionsService();
	var request = {
		origin:from,
		destination:to,
		travelMode: google.maps.TravelMode.DRIVING
	};
	directionsService.route(request, function(response, status) {
		
		if (status == google.maps.DirectionsStatus.OK) {
			findHotels(response.routes[0].overview_path);
		}
	});
}

function setReloadTime(secs)
{

	if (debug)alert('setReloadTime secs '+secs);

	if (arguments.length == 1) {
		if (reloadTimer) clearTimeout(reloadTimer);
		reloadTimer = setTimeout("setReloadTime()", Math.ceil(parseFloat(secs) * 1000));
	}
	else {                    

		var posiciones_temp = window.parent.getPosiciones();

		try{
			imagenPunto = window.parent.getImagenP();
		}
		catch(e){
			imagenPunto = null;
		}

		if (debug) alert('antes del reload');
		reload = window.parent.getReload();
		
		try{
			action = window.parent.getAction();
		}
		catch(e){
			action='mover';
		}
		
		if (debug)alert('reload '+reload);

		//Si  registro est�� vac��o significa que todav��a no se ha cargado el mapa
		if (registros == ''){

			//si posiciones est�� vac��o significa que no se han pasado posiciones
			//en ese caso se carga la opci��n por defecto
			if ( posiciones_temp !=''){
				posiciones = posiciones_temp;
				registros = posiciones.split('|');
				initMap();
				updatePositions();
				//actualizamos el zoom
				zoomTotal();
			}
		}
		else if (posiciones==''){
			//si ya se hab��a cargado el mapa (registros no es nulo)
			//y posiciones s�� es nulo
			posiciones = posiciones_temp;
			registros = posiciones.split('|');
			initMap();
		}
		else if (posiciones_temp!= posiciones){

			if (debug) alert('posiciones_temp != posiciones ');
			//ya se ha cambiado el mapa, pero se han actualizado los registros
			posiciones = posiciones_temp;
			registros = posiciones.split('|');
			initMap();
			updatePositions();
			//cuando se actualiza no se actualiza el zoom
			zoomTotal();
		}

		// si la variable reload en el parent es true, recargamos el mapa cada 1 segundo
		if (reload=='true'){
		
			//alert('mapa '+posiciones);
			if (debug)alert('recargar tras 10 segundos');
			setReloadTime(10);
		}

		//realizar la acci��n asociada
		
		try{realizarAccion();  }
		catch(e){}

		//   alert ('click');*/
	}
}

var rendererOptions = {
	draggable: false,
	suppressMarkers:true
};

function realizarAccion(){
	if (debug) alert ('info realizarAccion '+action);
	if (action=='poligonos'){

		poly = new google.maps.Polygon({
			strokeColor: '#ff0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#ff0000',
			fillOpacity: 0.35
		});
		poly.setMap(map);
		google.maps.event.addListener(map, "click", function(event) {
			// alert('click');
			// alert('latLng '+event.latLng);
			//placeMarker(event.latLng);
			dibujarPoligono(event);
		});
		google.maps.event.addListener(map, "dblclick", function() {
			// alert('click');
			// alert('latLng '+event.latLng);
			//placeMarker(event.latLng);
			listarPoligonos();
		});
	}
}

function listarPoligonos()
{
	var listar = '';
	//   alert ('listarPoligonos');
	//// alert('poly '+poly);
	var vertices = poly.getPath();
	//  alert('vertices '+vertices );

	for (var i =0; i < vertices.length; i++) {
		var xy = vertices.getAt(i);
		// alert('var xy '+xy);
		if (listar!=''){
			listar+=';';
		}
		listar+=xy.lat() +"," + xy.lng();
	}
	return listar;
	
}

function dibujarPoligono(clickEvent){

	// alert('inicio dibuarPoligono ');
	//alert('dibuarPoligono '+poly);
	
	/*
	var markerIndex = poly.getPath().length;
	var isFirstMarker = markerIndex === 0;
	var marker = new google.maps.Marker({ map: map, position: clickEvent.latLng, draggable: true });
	
	google.maps.event.addListener(marker, 'click', function () {

		if (isFirstMarker) {
			var path = poly.getPath();
			poly.setMap(null);
			poly = new google.maps.Polygon({ map: map, path: path, strokeColor: "#FF0000", strokeOpacity: 0.8, strokeWeight: 2, fillColor: "#FF0000", fillOpacity: 0.35 });

			//esta l��nea nos permite crear un nuevo pol��gono tras cerrar el antrior
			//comentando esta l��nea se a��adir��n nuevos puntos al anterior pol��gono
			//poly = new google.maps.Polyline({ map: map, path: [], strokeColor: "#FF0000", strokeOpacity: 1.0, strokeWeight: 2 });
		}
		else{
			return;
		}
		
		//poly = new google.maps.Polyline({ map: map, path: [], strokeColor: "#FF0000", strokeOpacity: 1.0, strokeWeight: 2 });

	});
	
	
	google.maps.event.addListener(marker, 'drag', function (dragEvent) {
		poly.getPath().setAt(markerIndex, dragEvent.latLng);

		try{  window.parent.setPoligonos(listarPoligonos()) ; }
		catch(e){}
	});
	poly.getPath().push(clickEvent.latLng);*/

	var vertices = poly.getPath();
	vertices.push(clickEvent.latLng);

	try{  window.parent.setPoligonos(listarPoligonos()) ; }
	catch(e){}
}
function placeMarker(location) {
	if (debug) alert('poner marker '+location);
	var marker = new google.maps.Marker({
		position: location,
		map: map
	});
	//alert('fin de poner marker');
}
function updatePositions(){
	if (debug) alert('updatePositions ');

	// alert('size '+ registros.length);
	for ( i=0;i<registros.length;i=i+1){

		var array = registros[i].split(';');
		var nombre= getNombre(array);

		if (debug) alert('array '+array);
		//si hay m��s de un punto, es un recorrido (gesti��n de flotas)
		if (array.length >2){
			
			drawIntensityLines(nombre, array);
		}
		else{
			//si solo hay un punto, puede ser de gessanPlus (atento al par��metro imagenPunto)
			var lat_lon_fecha = getLat_lon_fecha(array, 1);
			setPuntoInicial(nombre,lat_lon_fecha);
		}
	}
	if (debug) alert ('fin de updatePositions');
}

function drawIntensityLines(nombre, array){
	if (debug) alert('drawIntensityLines nombre '+nombre+' array '+array);
	//inicializamos los colores aleatorios
	var r = randomColor();
	var g = randomColor();
	var b = randomColor();
	var intervalo = 0;

	for (var i=1;i<array.length-1;i=i+1){

		if (debug) alert('array '+i);

		var w = 0;
		var lat_lon_fecha1 = getLat_lon_fecha(array, i);
		var lat_lon_fecha2 = getLat_lon_fecha(array, i+1);

		var lat1 = getLat(lat_lon_fecha1);
		var lon1 = getLon(lat_lon_fecha1);

		var lat2 = getLat(lat_lon_fecha2);
		var lon2 = getLon(lat_lon_fecha2);

		var fecha1= getFecha(lat_lon_fecha1);
		var fecha2= getFecha(lat_lon_fecha2);

		//si las fechas son distintas, creamos un nuevo intervalo
		if (fecha1!=fecha2){
			setPuntoInicial(nombre,lat_lon_fecha1);
			setPuntoFinal(nombre,lat_lon_fecha2);

			intervalo=0;
			//reiniciamos los colores aleatorios
			var r = randomColor();
			var g = randomColor();
			var b = randomColor();

		}
		else if (fecha1==fecha2){
			// si las fechas son iguales, cambiamos el color en funci��n de la hora
			// ( m��s oscuro cuanta m��s diferencia horaria)

			//comprobamos si es el primero punto (pintamos el punto final)
			if (i==1) setPuntoFinal(nombre,lat_lon_fecha1);
			else      setPuntoIntermedio(nombre,lat_lon_fecha1,intervalo);

			//comprobamos si i+1 es el ��ltimio punto (pintamos el punto inicial)
			if ((array[i+2]!= null)) setPuntoIntermedio(nombre,lat_lon_fecha2,intervalo);
			else setPuntoInicial(nombre,lat_lon_fecha2);
			w=5;

			var horaMin1 =getHoraMin(lat_lon_fecha1);
			var horaMin2 =  getHoraMin(lat_lon_fecha2);

			var dif = horaMin1-horaMin2;
			dif = dif*2;
			var color = rgb2Color(r-dif,g-dif,b-dif);
			if (debug) alert('hora1 '+horaMin1+' hora2 '+horaMin2+' dif '+dif+ ' color '+color);

			intervalo++;
		}
			
		var inicio = new google.maps.LatLng(lat1,lon1);
		var fin = new google.maps.LatLng(lat2,lon2);
		//   alert(myLatlng);

		//pintamos una l��nea entre los dos puntos
		drawLine(inicio,fin,color,w);
	}
	if (debug)  alert('fin drawIntensityLines nombre '+nombre+' array '+array);
}

function zoomTotal(){

	if (debug) alert('inicio zoomTotal');
	var latlngbounds = new google.maps.LatLngBounds( );
	for ( i=0;i<registros.length;i=i+1){
		//   alert(registros[i]);
		var array = registros[i].split(';');
		for (var j=1;j<array.length;j=j+1){
			//  alert(array[j]);
			var latlng = array[j].split(',');
			var myLatlng = new google.maps.LatLng(latlng[0],latlng[1]);
			
			latlngbounds.extend( myLatlng );
		
		}
	}
	map.fitBounds( latlngbounds );
}

//FUNCIONES DE PINTADO

function drawLine(from, to,color,w){
	if (debug) alert('drawLine from '+from+' to '+to+ ' color '+color+' w '+w);
	var flightPlanCoordinates = [
		from,
		to
	];
	var flightPath = new google.maps.Polyline({
		path: flightPlanCoordinates,
		strokeColor: ""+color,
		strokeOpacity: 0.5,
		strokeWeight:w
	});

	flightPath.setMap(map);
}
function setPuntoFinal(nombre, lat_lon_fecha){
	if (debug) alert('setPuntoFinal nombre '+nombre+' lat_lon_fecha '+lat_lon_fecha);

	var myLatlng = new google.maps.LatLng(getLat(lat_lon_fecha),getLon(lat_lon_fecha));
	var fecha = getFecha(lat_lon_fecha);
	var hora = getHora(lat_lon_fecha);


	var imagen = new google.maps.MarkerImage( 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=B|2ad22a',
	new google.maps.Size(20, 34),
	new google.maps.Point(0, 0),
	new google.maps.Point(10, 34));

	setPoint(myLatlng, imagen, buildTitle(nombre,fecha,hora), null);

}
function buildTitle (nombre, fecha, hora){
	var a= "<strong>Nombre: </strong> "+nombre+"</br>";
	var f= "<strong>Fecha: </strong> "+fecha+"</br>";
	var h= "<strong>Hora: </strong> "+hora;
	return  a+f+h;
}
function setPuntoInicial(nombre,lat_lon_fecha){
	if (debug) alert('setPuntoInicial nombre '+nombre+' lat_lon_fecha '+lat_lon_fecha);
	// lat_lon_fecha = getLat_lon_fecha(lat_lon_fecha, 1);
	var lat = getLat(lat_lon_fecha);
	var lon = getLon(lat_lon_fecha);
	var myLatlng = new google.maps.LatLng(lat,lon);
	var fecha = getFecha(lat_lon_fecha);
	var hora = getHora(lat_lon_fecha);

	if (debug) alert('puntoinicial hora '+hora);
	if (debug) alert('puntoinicial nombre '+nombre);

	if (debug)alert('imagenPunto '+imagenPunto);

	if (imagenPunto==null){
		imagenPunto = new google.maps.MarkerImage( 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=A|2ad22a',
		new google.maps.Size(20, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34));
	}
	setPoint(myLatlng, imagenPunto,  buildTitle(nombre,fecha,hora), null);

}

function setPuntoIntermedio(nombre,lat_lon_fecha,indice){
	if (debug) alert('setPuntoIntermedio nombre '+nombre+' lat_lon_fecha '+lat_lon_fecha);
	//      var lat_lon_fecha = getLat_lon_fecha(array,i);
	var waypoints = [];
	var myLatlng = new google.maps.LatLng(getLat(lat_lon_fecha),getLon(lat_lon_fecha));
	var fecha = getFecha(lat_lon_fecha);
	var hora = getHora(lat_lon_fecha);
	//   alert(myLatlng);

	var imagen = new google.maps.MarkerImage( 'http://chart.apis.google.com/chart?cht=mm&chs=10x18&chco=00FF00,2ad22a',
	new google.maps.Size(10, 18),
	new google.maps.Point(0, 0),
	new google.maps.Point(5, 18));


	setPoint(myLatlng, imagen,  buildTitle(nombre,fecha,hora), null);

	waypoints.push({
		location:myLatlng,
		stopover:true
	});

}
function setPuntosIntermedios(array){
	if (debug) alert('setPuntosIntermedios array '+array);

	var nombre = getNombre(array);
	var waypoints = [];
	for (var i=2;i<array.length-1;i=i+1){

		var lat_lon_fecha = getLat_lon_fecha(array,i);

		var myLatlng = new google.maps.LatLng(getLat(lat_lon_fecha),getLon(lat_lon_fecha));
		var fecha = getFecha(lat_lon_fecha);
		var hora = getHora(lat_lon_fecha);
		//   alert(myLatlng);

		setPoint(myLatlng, '../images/mapa/intermedio2.png',  buildTitle(nombre,fecha,hora), null);

		waypoints.push({
			location:myLatlng,
			stopover:true
		});

	}

	return waypoints;
}

function setPoint (point,image,title,animation){
	if (debug) alert('point image '+image+' title '+title+' animation '+animation);
	var marker = new google.maps.Marker({
		icon: image,
		position: point,
		map: map,
		animation: animation
		
	});
	inicializarCajaTexto(marker,title );
	
}
function setDirection(from,to,waypoints) {

	var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
	directionsDisplay.setMap(map);

	var request = {
		origin:from,
		destination:to,
		travelMode: google.maps.TravelMode.DRIVING
	};
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
		}
	});
}
//FUNCIONES PARA EXTRAER INFORMACI��N DE LOS ARRAYS
function getNombre(array){
	return array[0];
}
function getLat_lon_fecha ( array,  pos){

	return array[pos];
}
function getLat ( lat_lon_fecha){

	return lat_lon_fecha.split(',')[0];
}
function getLon ( lat_lon_fecha){

	return lat_lon_fecha.split(',')[1];
}

function getFecha( lat_lon_fecha){
	var fecha_hora = lat_lon_fecha.split(',')[2];
	return fecha_hora.split('_')[0];
}

function getHoraMin(lat_lon_fecha){
	var hora2 =getHora(lat_lon_fecha).split(":")[0];
	var min2 = getHora(lat_lon_fecha).split(":")[1];
	return Number(hora2*60)+Number(min2);
}
function getHora( lat_lon_fecha){
	var fecha_hora = lat_lon_fecha.split(',')[2];
	
	return fecha_hora.split('_')[1];
}
//FUNCIONES DE COLORES

function randomColor(){
	var color = Math.round(Math.random()*100+1);
	return 200-color; //200 para que no sea desde 255 que ser��a blanco
}
function fixColor(color){

	color = Math.round(color);
	if (color < 0 ) color = 0;
	if (color > 255) color = 255;
	return color;
}
function rgb2Color(r,g,b){

	r = fixColor(r);
	g = fixColor(g);
	b = fixColor(b);
	return 'rgb('+r+','+g+','+b+')';
}
//caja de texto

function inicializarCajaTexto(marker,texto ){


	var boxText = document.createElement("div");
	boxText.style.cssText = "margin-top: 8px; background: #ffffff; padding: 5px";
	boxText.innerHTML = texto;

	var myOptions = {
		content: boxText
		,disableAutoPan: false
		,maxWidth: 0
		,zIndex: null
		,boxStyle: {
			//background: "url('tipbox.gif') no-repeat"
			opacity: 0.75
			,width: "280px"
		}
		,closeBoxMargin: "10px 2px 2px 2px"
		,closeBoxURL: "close.png"
		,infoBoxClearance: new google.maps.Size(1, 1)
		,isHidden: false
		,pane: "floatPane"
		,enableEventPropagation: false
	};

	google.maps.event.addListener(marker, "click", function (e) {
		ib.open(map, this);
	});

	var ib = new google.maps.InfoWindow(myOptions);
	console.log (ib);
	//  ib.open(map, marker);
	
}
