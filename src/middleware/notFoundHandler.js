import { NotFoundError } from '../error';

const notFoundHandler = (req, res, next) => {
  next(new NotFoundError('Route not found'));
};

export default notFoundHandler;