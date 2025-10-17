<?php
header("Content-Type: application/json");

// Conexión a la base de datos
$mysqli = new mysqli("localhost", "u484104073_Mateo_Baute", "q:!TuP&lrP2", "u484104073_EgresApp_BBDD");

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión a la base de datos"]);
    exit();
}

// Verifica que se use GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit();
}

// Consulta a la tabla publicacion
$tipo = $_GET['tipo'] ?? '';
$salario = $_GET['salario'] ?? '';

if($tipo !== "todas" && $salario !== "") {
    $sql = "SELECT * FROM llamado WHERE Tipo = '$tipo' AND Salario LIKE '$salario%';";
}
else if ($tipo == "todas") {
    $sql = "SELECT * FROM llamado WHERE Salario LIKE '$salario%';";

}
else if($tipo === "todas" && $salario === "") {
     $sql = "SELECT * FROM llamado;";
    }
    else if($salario === "") {
        $sql = "SELECT * FROM llamado WHERE Tipo = '$tipo';";
    }

$resultado = $mysqli->query($sql);

if (!$resultado) {
    http_response_code(500);
    echo json_encode(["error" => "Error al realizar la consulta"]);
    exit();
}

$datos = [];

while ($fila = $resultado->fetch_assoc()) {
    $datos[] = $fila;
}

// Devolver datos en JSON
echo json_encode($datos);
