const validationMiddleware = (DtoClass) => {
    return (req, res, next) => {
        try {
            req.body = new DtoClass(req.body).validate();
            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = validationMiddleware;