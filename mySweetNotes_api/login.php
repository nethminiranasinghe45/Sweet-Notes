<?php
header('Content-Type: application/json');
include 'db.php';

$mobile = $_POST['mobile'];
$password = $_POST['password']; 


$stmt = $conn->prepare("SELECT * FROM user WHERE mobile = ?");
$stmt->bind_param("s", $mobile);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    
    
    if (password_verify($password, $user['password'])) {
        echo json_encode([
            "status" => "success", 
            "message" => "Welcome back!",
            "user_id" => $user['id'] 
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Incorrect password."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "User not found."]);
}

$stmt->close();
$conn->close();
?>