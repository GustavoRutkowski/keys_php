import { describe, test, expect, jest } from '@jest/globals';
import PassEncrypter from '../pass-encrypter.js';

describe('PassEncrypter: ', () => {
    describe('hashPassword: ', () => {
        test('Testa se um erro é lançado caso a senha não seja uma string: ', () => {
            const password = 12345678;
            
            const hashPassword = () => PassEncrypter.hashPassword(password, 10);

            expect(hashPassword).toThrow(TypeError);
            expect(hashPassword).toThrow('password is not a string');
        });

        test('Testa se um erro é lançado caso o salts não seja um número: ', () => {
            const salts = 'ten';
            
            const hashPassword = () => PassEncrypter.hashPassword('12345678', salts);

            expect(hashPassword).toThrow(TypeError);
            expect(hashPassword).toThrow('salts is not a number');
        });

        test('Testa se a hash gerada é uma string com mais de 35 caracteres: ', () => {
            const password = 'my password';
            const hash = PassEncrypter.hashPassword(password, 10);

            expect(typeof hash).toBe('string');
            expect(hash.length).toBeGreaterThanOrEqual(35);
        });

        test('Testa se uma senha com menos de 10 salts gera um warning: ', () => {
            const spiedConsoleWarn = jest
                .spyOn(console, 'warn') // Espia o console.warn
                .mockImplementation(() => {}); // Esvazia o console.warn

            PassEncrypter.hashPassword('my password', 5);

            const message = 'the number of salts is below 10, which could compromise password security.'
            expect(spiedConsoleWarn).toBeCalledWith('⚠ WARN: ', message);

            spiedConsoleWarn.mockRestore();
        });
    });

    describe('comparePassHash: ', () => {
        test('Testa se a senha correta retorna true: ', () => {
            const password = 'my password';
            const hash = PassEncrypter.hashPassword(password, 10);

            const compareCorrect = PassEncrypter.comparePassHash(password, hash);
            expect(compareCorrect).toBe(true);
        });

        test('Testa se a senha incorreta retorna false: ', () => {
            const password = 'my password';
            const hash = PassEncrypter.hashPassword(password, 10);

            const compareWrong = PassEncrypter.comparePassHash('wrong password', hash);
            expect(compareWrong).toBe(false);
        });
    });
});
