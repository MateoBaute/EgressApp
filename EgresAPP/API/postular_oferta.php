<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);


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
    echo json_encode(["success" => false, "error" => "Error de conexión a la base de datos"]);
    exit();
}

// Verifica que se use POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Método no permitido"]);
    exit();
}

// Obtener datos del cuerpo de la solicitud
$input = json_decode(file_get_contents('php://input'), true);

// Validar que se recibieron datos JSON
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["success" => false, "error" => "Datos JSON inválidos"]);
    exit();
}

// Obtener parámetros del JSON (CORREGIDO: usa $input en lugar de $_GET)
$id_llamado = $input['id_llamado'] ?? '';
$id_empresa = $input['id_empresa'] ?? '';
$curriculum_link = $input['curriculum_link'] ?? '';

// Validar campos obligatorios
if (empty($id_llamado) || empty($id_empresa) || empty($curriculum_link)) {
    echo json_encode(["success" => false, "error" => "Todos los campos son obligatorios"]);
    exit();
}

// Validar que el enlace sea una URL válida
if (!filter_var($curriculum_link, FILTER_VALIDATE_URL)) {
    echo json_encode(["success" => false, "error" => "El enlace al currículum no es válido"]);
    exit();
}

// Verificar que el llamado exista
$check_sql = "SELECT id_llamado FROM llamado WHERE id_llamado = ?";
$check_stmt = $mysqli->prepare($check_sql);
$check_stmt->bind_param("i", $id_llamado);
$check_stmt->execute();
$check_stmt->store_result();

if ($check_stmt->num_rows === 0) {
    echo json_encode(["success" => false, "error" => "La oferta no existe"]);
    $check_stmt->close();
    exit();
}
$check_stmt->close();

// Preparar consulta para insertar la postulación
$sql = "INSERT INTO postulaciones (id_llamado, curriculum_link) VALUES (?, ?)";
$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Error al preparar la consulta: " . $mysqli->error]);
    exit();
}

// Vincular parámetros
$stmt->bind_param("is", $id_llamado, $curriculum_link);

// Ejecutar consulta
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Postulación enviada correctamente"]);
} else {
    echo json_encode(["success" => false, "error" => "Error al enviar la postulación: " . $stmt->error]);
}

$stmt->close();
$mysqli->close();
?>