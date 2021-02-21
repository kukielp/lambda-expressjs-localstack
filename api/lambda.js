const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const binaryMimeTypes = [
    'application/octet-stream',
    'application/xml',
    'font/eot',
    'font/opentype',
    'font/otf',
    //'image/jpeg',
    //'image/png',
    'image/svg+xml',


]

const server = awsServerlessExpress.createServer(app, null)

exports.handler = (event, context, callback) => { return awsServerlessExpress.proxy(server, event, context) };