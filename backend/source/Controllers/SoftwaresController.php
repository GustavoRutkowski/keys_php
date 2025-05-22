<?php

namespace Source\Controllers;

use Source\Models\Software;

class SoftwaresController extends Controller {

    // POST /softwares
    public function createSoftware(array $data) {
        $body = $this->getRequestData($data)['body'];

        $name = $body['name'] ?? null;
        $icon = $body['icon'] ?? null;

        $created = Software::create($name, $icon);

        if ($created['success'] === false) {
            return $this::send(400, $created);
        }

        return $this::send(201, $created);
    }

    // GET /softwares
    public function getAllSoftwares(array $data) {
        $results = Software::getAll();

        var_dump($results);
        return $this::send(200, ['success' => true, 'data' => $results]);
    }

    // GET /softwares/{id}
    public function getSoftwareById(array $data) {
        $params = $this->getRequestData($data)['params'];
        $id = $params['id'] ?? null;

        if (!$id) {
            return $this::send(400, ['success' => false, 'message' => 'missing software id']);
        }

        $software = Software::getById((int)$id);

        if (isset($software['message'])) {
            return $this::send(404, $software);
        }

        return $this::send(200, ['success' => true, 'data' => $software]);
    }

    // GET /softwares/pass-id/{passID}
    public function getSoftwareByPasswordId(array $data) {
        $params = $this->getRequestData($data)['params'];
        $passID = $params['passID'] ?? null;

        if (!$passID) {
            return $this::send(400, ['success' => false, 'message' => 'missing password id']);
        }

        $software = Software::getByPasswordId((int)$passID);

        if (isset($software['message'])) {
            return $this::send(404, $software);
        }

        return $this::send(200, ['success' => true, 'data' => $software]);
    }


    // PUT /softwares/{id}
    public function updateSoftware(array $data) {
        $params = $this->getRequestData($data)['params'];
        $body = $this->getRequestData($data)['body'];

        $id = $params['id'] ?? null;
        $name = $body['name'] ?? null;
        $icon = $body['icon'] ?? null;

        if (!$id) {
            return $this::send(400, ['success' => false, 'message' => 'missing software id']);
        }

        $updated = Software::update((int)$id, $name, $icon);

        if (!$updated['success']) {
            return $this::send(400, $updated);
        }

        return $this::send(204, []);
    }

    // DELETE /softwares/{id}
    public function deleteSoftware(array $data) {
        $params = $this->getRequestData($data)['params'];
        $id = $params['id'] ?? null;

        if (!$id) {
            return $this::send(400, ['success' => false, 'message' => 'missing software id']);
        }

        $deleted = Software::delete((int)$id);

        if (!$deleted['success']) {
            return $this::send(404, $deleted);
        }

        return $this::send(204, []);
    }
}
