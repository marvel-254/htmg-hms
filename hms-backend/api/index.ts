import serverless from 'serverless-http';
// Dist folder is copied into api/ during build
import app from './dist/server.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default serverless(app);
