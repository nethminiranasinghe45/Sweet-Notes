<?php
$host = "localhost";
$user = "root";
$pass = ""; 
$db_name = "mySweetNotes";

$conn = new mysqli($host, $user, $pass, $db_name);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed"]));
}


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
?>