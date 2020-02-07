import { Request, Response, NextFunction } from 'express';

import { ValidationError } from '../handlers/epicHandlers';

// Error handling middleware in Express needs to take 4 arguments in the handler
// for it to run when `next()` function is called in the route handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction): void => {
    switch (error.constructor) {
        case ValidationError:
            res.status(400).send({ error: error.message });
            break;
        default:
            console.log('Something went wrong: ', error.message);
            res.status(500).send({ error: error.message });
    }
};

export { errorMiddleware };
