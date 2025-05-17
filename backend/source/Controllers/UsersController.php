<?php

// PUT /users/user

use Source\Models\User;

class UsersController extends Controller {
    // POST
    public function createUser(array $data) {
        $body = $this->getRequestData($data)['body'];

        $createdUser = User::create(
            $body['name'],
            $body['email'],
            $body['main_pass']
        );

        $this::send(201, $createdUser);
    }

    // GET
    public function getUserByID(array $data) {
        $id = $this->getRequestData($data)['params']['id'];

        $user = User::getById($id);

        if ($user['message']) return $this::send(404, $user);
        $this::send(200, $user);
    }
    public function getUser(array $data) {
        $token = $this->getRequestData($data)['headers']['token'];

        $user = User::getByToken($token);

        if ($user['message']) return $this::send(404, $user);
        $this::send(200, $user);
    }

    // PUT
    public function updateUser(array $data) {
        $token = $this->getRequestData($data)['headers']['token'];
        $body = $this->getRequestData($data)['body'];

        $userUpdated = User::update(
            $token,
            $body['name'],
            $body['main_pass'],
            $body['picture']
        );

        if ($userUpdated['sucess']) $this::send(204, []);
        $this::send(400, $userUpdated);
    }

    // POST LOGIN
    public function login(array $data = []) {
        $body = $this->getRequestData($data)['body'];

        $loginResult = User::login($body['email'], $body['main_pass']);

        return $loginResult['sucess']
            ? $this::send(200, $loginResult)
            : $this::send(401, $loginResult);
    }
}