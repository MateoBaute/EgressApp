<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

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

// Obtener parámetros del JSON
$salario = $input['salario'] ?? '';
$horario = $input['horario'] ?? '';
$tipo = $input['tipo'] ?? '';
$descripcion = $input['descripcion'] ?? '';
$nombre_oferta = $input['nombre_oferta'] ?? '';
$empresaNombre = $input['empresaNombre'] ?? '';
$id_empresa = $input['id_empresa'] ?? '';

// Validar campos obligatorios
if (empty($salario) || empty($horario) || empty($tipo) || empty($descripcion) || empty($nombre_oferta) || empty($empresaNombre) || empty($id_empresa)) {
    echo json_encode(["success" => false, "error" => "Todos los campos son obligatorios"]);
    exit();
}

// Preparar consulta
$sql = "INSERT INTO llamado (Salario, Horario, Tipo, Descripción, Nombre_Oferta, Empresa, id_empresa) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Error al preparar la consulta: " . $mysqli->error]);
    exit();
}

// Vincular parámetros
$stmt->bind_param("ssssssi", $salario, $horario, $tipo, $descripcion, $nombre_oferta, $empresaNombre, $id_empresa);

// Ejecutar consulta
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Oferta publicada correctamente"]);
} else {
    echo json_encode(["success" => false, "error" => "Error al ejecutar la consulta: " . $stmt->error]);
}

$stmt->close();
$mysqli->close();
?>