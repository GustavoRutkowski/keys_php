<?php

// PUT /users/user

namespace Source\Controllers;

use Source\Models\User;
use Exception;

class UsersController extends Controller {
    // POST
    public function createUser(array $data) {
        $body = $this->getRequestData($data)['body'];
    
        if (!array_key_exists('name', $body)) {
            $response = [
                'status' => 400,
                'success' => false,
                'message'=> 'name is required'
            ];

            return $this::send($response['status'], $response);
        }

        if (!array_key_exists('email', $body)) {
            $response = [
                'status' => 400,
                'success' => false,
                'message'=> 'email is required'
            ];

            return $this::send($response['status'], $response);
        }

        if (!array_key_exists('main_pass', $body)) {
            $response = [
                'status' => 400,
                'success' => false,
                'message'=> 'main_pass is required'
            ];

            return $this::send($response['status'], $response);
        }

        //var_dump($this->getRequestData($data));

        try {
            $createdUser = User::create(
                $body['name'],
                $body['email'],
                $body['main_pass']
            );

            $response = [
                'status' => 201,
                'success' => true,
                'message' => 'user created successfully',
                'data'=> $createdUser
            ];
    
            return $this::send($response['status'], $response);
        } catch (Exception $e) {
            $response = [
                'status' => 400,
                'success' => false,
                'message' => $e->getMessage()
            ];

            return $this::send($response['status'], $response);
        }
    }

    // GET
    public function getUserByID(array $data) {
        //var_dump($data);

        $id = $this->getRequestData($data)['params']['id'];

        if (filter_var($id, FILTER_VALIDATE_INT) === false) {
            $response = [
                'status'=> 400,
                'success'=> false,
                'message'=> 'id must be an integer'
            ];

            return $this::send($response['status'], $response);
        }

        try {
            $user = User::getById($id);

            $response = [
                'status' => 200,
                'success' => true,
                'message' => 'user found successfully',
                'data' => $user
            ];

            return $this::send($response['status'], $response);
        } catch (Exception $e) {
            $response = [
                'status' => 404,
                'success' => false,
                'message' => $e->getMessage()
            ];

            return $this::send($response['status'], $response);
        }
    }
    public function getUser(array $data) {
        $headers = $this->getRequestData($data)['headers'];

        // var_dump($headers);

        if (!array_key_exists('token', $headers) || $headers['token'] === "") {
            $response = [
                'status'=> 400,
                'success'=> false,
                'message'=> 'token not provided'
            ];

            return $this::send($response['status'], $response);
        }

        $token = $headers['token'];

        try {
            $user = User::getByToken($token);

            $response = [
                'status' => 200,
                'success' => true,
                'message' => 'user found successfully',
                'data'=> $user
            ];

            return $this::send($response['status'], $response);
        } catch (Exception $e) {
            $response = [
                'status' => 404,
                'success' => false,
                'message' => $e->getMessage()
            ];

            return $this::send($response['status'], $response);
        }
    }

    // PUT
    public function updateUser(array $data) {
        $headers = $this->getRequestData($data)['headers'];

         if (!array_key_exists('token', $headers) || $headers['token'] === "") {
            $response = [
                'status'=> 400,
                'success'=> false,
                'message'=> 'token not provided'
            ];

            return $this::send($response['status'], $response);
        }

        $token = $headers['token'];
        $body = $this->getRequestData($data)['body'];

        try {
            User::update(
                $token,
                $body['name'] ?? null,
                $body['main_pass'] ?? null,
                $body['picture'] ?? null
            );

            $response = [
                'status' => 204,
                'success'=> true,
                'message'=> 'user updated successfully'
            ];

            return $this::send($response['status'], $response);
        } catch (Exception $e) {
            $response = [
                'status' => 400,
                'success'=> false,
                'message'=> $e->getMessage()
            ];

            return $this::send($response['status'], $response);
        }
    }

    // POST LOGIN
    public function login(array $data = []) {
        $body = $this->getRequestData($data)['body'];
        
        if (!array_key_exists('email', $body)) {
            $response = [
                'status' => 400,
                'success' => false,
                'message'=> 'email is required'
            ];

            return $this::send($response['status'], $response);
        }

        if (!array_key_exists('email', $body)) {
            $response = [
                'status' => 400,
                'success' => false,
                'message'=> 'main_pass is required'
            ];

            return $this::send($response['status'], $response);
        }

        try {
            $loginResult = User::login($body['email'], $body['main_pass']);

            $response = [
                'status' => 200,
                'success' => true,
                'message'=> 'login successfully',
                'data' => $loginResult
            ];
            
            return $this::send($response['status'], $response);
        } catch (Exception $e) {
            $response = [
                'status' => 401,
                'success'=> false,
                'message'=> $e->getMessage()
            ];

            return $this::send($response['status'], $response);
        }
    }
}