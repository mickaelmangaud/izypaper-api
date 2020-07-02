import authRouter from './authentication';

export const registerRoutes = app => {
  app.use('/auth', authRouter);
};