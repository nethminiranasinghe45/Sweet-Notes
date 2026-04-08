<?php
header('Content-Type: application/json');
include 'db.php';

$id = $_POST['id'];
$title = $_POST['title'];
$description = $_POST['content']; 
$category_id = $_POST['category_id']; 


$stmt = $conn->prepare("UPDATE notes SET title = ?, description = ?, category_id = ? WHERE id = ?");
$stmt->bind_param("ssii", $title, $description, $category_id, $id); 

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
$stmt->close();
$conn->close();
?>