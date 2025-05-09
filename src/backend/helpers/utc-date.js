class UTCDate {
    constructor(date) {
        if (date && !(date instanceof Date))
            throw new TypeError('date is not instance of Date');

        this._date = date || new Date();
    }

    getDate() {
        return this._date;
    }

    toDatetime() {
        const currentUTCDate = this._date.toISOString();
        return currentUTCDate.slice(0, 16).replace('T', ' ');
    }

    static fromDatetime(datetime) {
        const date = new Date(`${datetime}:00Z`);
        return new UTCDate(date);
    }
}

export default UTCDate;
