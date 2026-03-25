const serverless = require('serverless-http');
const app = require('../../backend/server');

// Pass requestId and callbackWaitsForEmptyEventLoop options
module.exports.handler = serverless(app, {
    request(req, event) {
        // Netlify passes the original path in event.path, ensure Express sees it
        req.url = event.path + (event.rawQuery ? `?${event.rawQuery}` : '');
    }
});
