function validatePasswordsMatch(req, res, next) {
    const { body } = req;

    if (!body.repeat_main_pass) next();
    if (body.repeat_main_pass === body.main_pass) next();

    const error = { message: 'passwords not match' };
    return res.status(400).json(error);
}

export default validatePasswordsMatch;
