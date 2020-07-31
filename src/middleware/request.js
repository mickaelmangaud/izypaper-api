export const requestLogin = (req, res, next) => {
    logger.debug(`[REQUEST]: ${req.method} | ${req.path} | ${JSON.stringify(req.body)}`);
    console.log('USER', req.user)
    next();
}