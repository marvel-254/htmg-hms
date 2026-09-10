import serverless from 'serverless-http';
import app from '../hms-backend/dist/server.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default serverless(app);
