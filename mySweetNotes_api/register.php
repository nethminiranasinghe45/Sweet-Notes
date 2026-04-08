<?php
include 'db.php';


$name = $_POST['name'] ?? '';
$mobile = $_POST['mobile'] ?? '';
$password = $_POST['password'] ?? '';


if (!preg_match("/^[0-9]{10}$/", $mobile)) {
    echo json_encode(["status" => "error", "message" => "Please enter a valid 10-digit mobile number."]);
    exit;
}


$checkQuery = "SELECT * FROM user WHERE mobile = '$mobile'";
$result = $conn->query($checkQuery);

if ($result->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "This mobile number is already registered."]);
    exit;
}


$hashed_password = password_hash($password, PASSWORD_DEFAULT);


$sql = "INSERT INTO user (name, mobile, password) VALUES ('$name', '$mobile', '$hashed_password')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Registration successful! ✨"]);
} else {
    echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
}
?>