import { describe, test, expect } from '@jest/globals';
import UTCDate from '../utc-date.js';

describe('UTCDate: ', () => {
    describe('constructor: ', () => {
        test('Testa se a data passada por construtor é a mesma que getDate retorna: ', () => {
            const date = new Date();
            const utcDate = new UTCDate(date);
    
            expect(date).toEqual(utcDate.getDate());
        });

        test('Testa se um construtor inválido retorna erro: ', () => {
            const invalidDate = 'my date';

            const initUTCDate = () => new UTCDate(invalidDate);
            
            expect(initUTCDate).toThrow(TypeError);
            expect(initUTCDate).toThrow('date is not instance of Date');
        });
    });

    describe('UTCDate.toDatetime: ', () => {
        test('Testa se ao passar um objeto Date ele retorna uma string YYYY-MM-DD HH:mm: ', () => {
            // 2008-05-10T00:00:00.000Z
            const date = new Date(Date.UTC(2008, 4, 10, 0, 0));
            const datetime = new UTCDate(date).toDatetime();

            expect(datetime).toBe('2008-05-10 00:00');
        });

        test('Testa se ao não informar nenhum Date ele retorna um datetime com a data atual: ', () => {
            const getNowDatetime = () => new Date()
                .toISOString()
                .slice(0, 16)
                .replace('T', ' ');
            
            const beforeNow = getNowDatetime();
            const datetime = new UTCDate().toDatetime();
            const afterNow = getNowDatetime();

            const inInterval = (beforeNow <= datetime) && (datetime <= afterNow);
            expect(inInterval).toBe(true);
        });
    });

    describe('UTCDate.fromDatetime: ', () => {
        test('Testa se ao passar uma string YYYY-MM-DD HH:mm ele retorna um objeto UTCDate com a data correta: ', () => {
            const datetime = '2008-05-10 00:00';
            const utcDate = UTCDate.fromDatetime(datetime);

            expect(utcDate).toBeInstanceOf(UTCDate);
            expect(datetime).toBe(utcDate.toDatetime());
        });
    });
});
