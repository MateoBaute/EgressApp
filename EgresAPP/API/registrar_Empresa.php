<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Manejar preflight requests (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conexión a la base de datos
$mysqli = new mysqli("localhost", "u484104073_Mateo_Baute", "q:!TuP&lrP2", "u484104073_EgresApp_BBDD");

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error de conexión a la base de datos: " . $mysqli->connect_error]);
    exit();
}

// Verifica que se use POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Método no permitido. Se esperaba POST."]);
    exit();
}

// Obtener datos del cuerpo de la solicitud
$json = file_get_contents('php://input');
$input = json_decode($json, true);

// Validar que se recibieron datos JSON
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Datos JSON inválidos: " . json_last_error_msg()]);
    exit();
}

// Obtener parámetros del JSON decodificado, no de $_POST
$nombre = $input['nombre'] ?? '';
$email = $input['email'] ?? '';
$telefono = $input['telefono'] ?? '';
$contraseña = $input['contraseña'] ?? '';
$enfoque = $input['enfoque'] ?? '';
$direccion = $input['direccion'] ?? ''; // Si no viene en el JSON, queda vacío

// Validar campos obligatorios
if (empty($nombre) || empty($email) || empty($telefono) || empty($contraseña) || empty($enfoque)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Faltan campos obligatorios"]);
    exit();
}

// Validar formato de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "El formato del email no es válido"]);
    exit();
}

// Verificar si el email ya existe en la base de datos
$check_sql = "SELECT Id_empresa FROM empresa WHERE Mail = ?";
$check_stmt = $mysqli->prepare($check_sql);
$check_stmt->bind_param("s", $email);
$check_stmt->execute();
$check_stmt->store_result();

if ($check_stmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["success" => false, "error" => "El email ya está registrado"]);
    $check_stmt->close();
    exit();
}
$check_stmt->close();

// Codificar la contraseña en base64 (similar a btoa)
// $contraseñaCodificada = base64_encode($contraseña);

// Preparar consulta
$sql = "INSERT INTO empresa (Nombre_empresa, Teléfono, Mail, Dirección, Enfoque, Contraseña) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error al preparar la consulta: " . $mysqli->error]);
    exit();
}

// Vincular parámetros
$stmt->bind_param("sissss", $nombre, $telefono, $email, $direccion, $enfoque, $contraseña);

// Ejecutar la consulta
if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Empresa registrada correctamente"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error al ejecutar la consulta: " . $stmt->error]);
}

$stmt->close();
$mysqli->close();
?>