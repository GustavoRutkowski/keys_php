function validatePassword(req, res, next) {
    const { body } = req;

    if (!body.value) {
        const error = { message: "the field 'value' is required" };
        return res.status(400).json(error);
    };

    if (!body.referring_to) {
        const error = { message: "the field 'referring_to' is required" };
        return res.status(400).json(error);
    };

    next();
};

export default validatePassword;
