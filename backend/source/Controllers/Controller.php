<?php

namespace Source\Controllers;

abstract class Controller {
    // $this->getRequestData($data)["body"]["email"]
    // $this->getRequestData($data)["param"]
    // $this->getRequestData($data)["headers"]

    protected static function getRequestData(array $data = []): array {
        $params = $data ?? [];

        $headers = function_exists('getallheaders')
            ? getallheaders()
            : Controller::getClientHeadersFallback();

        $body = json_decode(
            file_get_contents('php://input'),
            true
        );

        if (!is_array($body)) {
            $body = [];
        }

        return [
            'params'  => $params,
            'headers' => $headers,
            'body'    => $body,
        ];
    }

    // $this::send(404, [
        // "message" => "dados invalidos"
    // ])

    protected static function send(?int $status = null, ?array $data = []) {
        if ($status !== null) {
            http_response_code($status);
        }

        header('Content-Type: application/json; charset=UTF-8');

        echo json_encode(
            $data ?? [],
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );

        exit();
    }

    private static function getClientHeadersFallback(): array {
        $headers = [];

        foreach ($_SERVER as $key => $value) {
            if (str_starts_with($key, 'HTTP_')) {
                $name = str_replace('_', '-', strtolower(substr($key, 5)));
                $headers[ucwords($name, '-')] = $value;
            }
        }

        if (isset($_SERVER['CONTENT_TYPE'])) {
            $headers['Content-Type'] = $_SERVER['CONTENT_TYPE'];
        }

        if (isset($_SERVER['CONTENT_LENGTH'])) {
            $headers['Content-Length'] = $_SERVER['CONTENT_LENGTH'];
        }

        return $headers;
    }
}