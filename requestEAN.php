<?php

//$url = $_GET["url"];
//$lat = "51.41313";
//$lon = "0.11277000000000001";


$lat = $_GET["latitude"];
$lon = $_GET["longitude"];
$arrdate = $_GET["arrivalDate"];
$dptdate = $_GET["departureDate"];
$budget = $_GET["maxRate"];
$people = $_GET["room1"];
$radious = $_GET["radious"];


//echo "lat: $lat lon $lon";
$url = "http://api.ean.com/ean-services/rs/hotel/v3/list?".
"latitude=$lat".
"&longitude=$lon".
"&arrivalDate=$arrdate". //MM/DD/YYYY format
"&departureDate=$dptdate".
"&minRate=10".
"&maxRate=$budget".
"&room1=$people".
// tuning parameters
"&searchRadius=$radious".
"&sort=OVERALL_VALUE".
"&includeDetails=true".
//"&options=ROOM_RATE_DETAILS". 
"&address=true".
"&propertyCategory=6". //all inclusive
"&numberOfResults=5".
"&apiKey=66rqbka7j8xrhqmb6mc2c95c";


//javi key: rjge84jyvpv8dgmw7pckam56
//mar key: 66rqbka7j8xrhqmb6mc2c95c


//latitude=$lat&longitude=$lon&searchRadius=$rad&apiKey=rjge84jyvpv8dgmw7pckam56";

$response = file_get_contents($url);
echo $response;
//$response_obj = json_decode($response);
//print_r ($response_obj);
?>