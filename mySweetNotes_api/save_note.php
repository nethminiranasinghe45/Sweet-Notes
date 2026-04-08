<?php
header('Content-Type: application/json');
include 'db.php';

$title = $_POST['title'];
$description = $_POST['description'];
$category_id = $_POST['category_id']; 

$sql = "INSERT INTO notes (title, description, category_id, date_created) 
        VALUES ('$title', '$description', '$category_id', NOW())";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}
?>