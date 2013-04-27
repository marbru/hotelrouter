<?php

$lat = $_GET["lat"];
$lon =  $_GET["lon"];
$rad = $_GET["rad"];
//$lat = "51.41313";
//$lon = "0.11277000000000001";

//echo "lat: $lat lon $lon";
$url = "http://api.ean.com/ean-services/rs/hotel/v3/list?latitude=$lat&longitude=$lon&searchRadius=$rad&apiKey=rjge84jyvpv8dgmw7pckam56";

$response = file_get_contents($url);
echo $response;
//$response_obj = json_decode($response);
//print_r ($response_obj);
?>