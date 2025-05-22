<?php

namespace Source\Utils;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use \DateTimeImmutable;
use \Exception;

class JWTToken
{
    private const SECRET_KEY = 'secret-key_#03#19';
    private const ALGORITHM = 'HS512';
    private const URL = 'http://localhost:8080';
    private string $value;
    private array $payload;
    private string $expires;

    public function __construct(array $payload, string $expires = '+1 hour')
    {
        $this->payload = $payload;
        $this->expires = $expires;

        $tokenId    = base64_encode(random_bytes(16));
        $issuedAt   = new DateTimeImmutable();
        $expire     = $issuedAt->modify($expires)->getTimestamp();

        $data = [
            'iat'  => $issuedAt->getTimestamp(),
            'jti'  => $tokenId,
            'iss'  => JWTToken::URL,
            'nbf'  => $issuedAt->getTimestamp(),
            'exp'  => $expire,
            'data' => $payload
        ];

        $this->value = JWT::encode($data, JWTToken::SECRET_KEY, JWTToken::ALGORITHM);
    }

    // JWTToken::from($token) -> O from gera um objeto do tipo token a partir da string, ja que o verify usa o objeto, n a string
    public static function from(string $token): ?JWTToken
    {
        try {
            $decoded = JWT::decode($token, new Key(self::SECRET_KEY, self::ALGORITHM));

            $instance = new self([]);

            $instance->value = $token;
            $instance->payload = (array)($decoded->data ?? []);

            $expireTimestamp = $decoded->exp ?? null;

            if ($expireTimestamp) {
                $expireDate = (new DateTimeImmutable())->setTimestamp($expireTimestamp);
                $instance->expires = $expireDate->format('Y-m-d H:i:s');
                
                return $instance;
            }

            $instance->expires = '';
            return $instance;
        } catch (Exception) {
            return null;
        }
    }


    public static function verify(JWTToken $token): array
    {
        try {
            $decoded = JWT::decode($token->getToken(), new Key(JWTToken::SECRET_KEY, JWTToken::ALGORITHM));
            $now = new DateTimeImmutable();

            if (
                $decoded->iss !== JWTToken::URL ||
                $decoded->nbf > $now->getTimestamp() ||
                $decoded->exp < $now->getTimestamp()
            ) {
                return [
                    'valid' => false,
                    'message' => 'token expired or invalid',
                    'decoded_token' => null
                ];
            }

            return [
                'valid' => true,
                'decoded_token' => $decoded->data,
                'message' => null
            ];
        } catch (Exception $e) {
            return [
                'valid' => false,
                'decoded_token' => null,
                'message' => $e->getMessage()
            ];
        }
    }

    public function getToken(): string
    {
        return $this->value;
    }

    public function getPayload(): array
    {
        return $this->payload;
    }

    public function getExpires(): string
    {
        return $this->expires;
    }
}
