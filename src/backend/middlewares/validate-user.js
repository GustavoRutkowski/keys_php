function validateUser(req, res, next) {
    const { body } = req;

    if (!body.email) {
        const error = { message: "the field 'email' is required" };
        return res.status(400).json(error);
    }

    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailIsValid = emailRegexp.test(body.email);

    if (!emailIsValid) {
        const error = { message: 'the email format is invalid' };
        return res.status(400).json(error);
    }

    if (!body.main_pass) {
        const error = { message: "the field 'main_pass' is required" };
        return res.status(400).json(error);
    }

    if (body.main_pass.length < 8) {
        const error = { message: 'password must be 8 characters or more' };
        return res.status(400).json(error);
    }

    const letterRegexp = /[a-zA-Z]/;
    const passContainsLetters = letterRegexp.test(body.main_pass);

    if (!passContainsLetters) {
        const error = { message: 'the password must contain letters' };
        return res.status(400).json(error);
    }

    const numericRegexp = /[0-9]/;
    const passContainsNumbers = numericRegexp.test(body.main_pass);

    if (!passContainsNumbers) {
        const error = { message: 'the password must contain numbers' };
        return res.status(400).json(error);
    }

    const specialCharRegexp = /[!@#$%^&*(),.?":{}|<>]/;
    const passContainsSpecialChars = specialCharRegexp.test(body.main_pass);

    if (!passContainsSpecialChars) {
        const error = { message: 'the password must contain special characters' };
        return res.status(400).json(error);
    }

    next();
}

export default validateUser;
