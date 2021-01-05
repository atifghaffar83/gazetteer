<?php

$curl = curl_init();

curl_setopt_array($curl, [
	CURLOPT_URL => "https://andruxnet-world-cities-v1.p.rapidapi.com/?query=paris&searchby=city",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"x-rapidapi-host: andruxnet-world-cities-v1.p.rapidapi.com",
		"x-rapidapi-key: NGLh9X4rmymshnef3f80R8EnIyCZp1HW5sEjsnCZRNzUYggISu"
	],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
	echo "cURL Error #:" . $err;
} else {
	echo $response;
}