<?php
header('Content-Type: application/json');
include 'db.php';


$rawData = file_get_contents("php://input");
$jsonData = json_decode($rawData, true);


$id = $_POST['id'] ?? $jsonData['id'] ?? null;

if (empty($id)) {
    echo json_encode(["status" => "error", "message" => "No ID provided. Received: " . $rawData]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM notes WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>