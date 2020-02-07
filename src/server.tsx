import express from 'express';
import awsServerlessExpress from 'aws-serverless-express';
import { Context } from 'aws-lambda';
import cors from 'cors';

import { fetchDefaultEpicContent } from './api/contributionsApi';
import { epicPostHandler, epicGetHandler } from './handlers/epicHandlers';
import { errorMiddleware } from './middlewares/errorMiddleware';

// Pre-cache API response
fetchDefaultEpicContent();

// Use middleware
const app = express();
app.use(express.json({ limit: '50mb' }));

// Note allows *all* cors. We may want to tighten this later.
app.use(cors());
app.options('*', cors());

app.get('/healthcheck', (req: express.Request, res: express.Response) => {
    res.header('Content-Type', 'text/plain');
    res.send('OK');
});

app.get('/epic', epicGetHandler);
app.post('/epic', epicPostHandler);

app.use(errorMiddleware);

// If local then don't wrap in serverless
const PORT = process.env.PORT || 3030;
if (process.env.NODE_ENV === 'development') {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
} else {
    const server = awsServerlessExpress.createServer(app);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exports.handler = (event: any, context: Context): void => {
        awsServerlessExpress.proxy(server, event, context);
    };
}

export { app };
