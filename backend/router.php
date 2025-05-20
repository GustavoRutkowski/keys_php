<?php

ob_start();

require  __DIR__ . "/../vendor/autoload.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header('Access-Control-Allow-Credentials: true'); // Permitir credenciais

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

use CoffeeCode\Router\Router;

const API_HOST = 'https://localhost:2469';

$route = new Router(API_HOST . '/', ':');

// Define o namespace do diretório dos controllers
$route->namespace("Source\Controllers");

/* USERS */

$route->group("/users");

$route->post('/', 'UsersController:createUser');

$route->get('/{id}', 'UsersController:getUserByID');
$route->get('/user', 'UsersController:getUser');

$route->put('/user', 'UsersController:updateUser');

$route->post('/login', 'UsersController:login');

// //http://localhost:8080/inf-3at-2025/api/users/id/2
// $route->get("/id/{id}", "Users:listUserById");

$route->group("null");

$route->dispatch();

// Qualquer erro levará para esse caminho:
if ($route->error()) {
    header('Content-Type: application/json; charset=UTF-8');
    http_response_code(404);

    echo json_encode([
        "code" => 404,
        "status" => "not_found",
        "message" => "URL não encontrada"
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

ob_end_flush();