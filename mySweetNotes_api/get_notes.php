<?php
header('Content-Type: application/json');
include 'db.php';


$sql = "SELECT n.*, c.name AS category_name 
        FROM notes n 
        LEFT JOIN category c ON n.category_id = c.id 
        ORDER BY n.id DESC"; 

$result = $conn->query($sql);
$notes = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $notes[] = $row;
    }
}
echo json_encode($notes);
$conn->close();
?>