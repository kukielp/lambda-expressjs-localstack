const express = require('express')
const app = express()
const router = express.Router()
const AWS = require('aws-sdk')
const bodyParser = require('body-parser')
const cors = require('cors')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const fs = require('fs')
const path = require('path')
const loremIpsum = require("lorem-ipsum").loremIpsum;

app.use('/static', express.static('public'))

AWS.config.update({
    region: 'ap-southeast-2',
    //endpoint:'http://localhost:4566',
});

const table = "Movies"
const ddbClient = new AWS.DynamoDB.DocumentClient();

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(awsServerlessExpressMiddleware.eventContext())

require('./routes/gets')(router, ddbClient, table)
require('./routes/posts')(router, ddbClient, table, loremIpsum)
require('./routes/delete')(router, ddbClient, table)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

router.get('/', function(req, res) {
    res.render('index', { title: 'Default Route' })
})

router.get('/birdy.jpg', (req, res) => {
    let fileName = "bird.jpeg"; 
    res.setHeader('Content-Disposition', 'inline; filename="' + fileName + '"')
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('isBase64Encoded', true)

    rBody = fs.readFileSync(`${__dirname}/public/bird.jpg`);
    let bufferObj = Buffer.from(rBody, "utf8")
    let responseBody = bufferObj.toString("base64")
    res.status(200).send(responseBody);
})

router.get('/testrender', function(req, res) {
    res.render('index', { title: 'Some random Text' })
})

router.get('/cleanup', async (req, res) => {
    var params = {
        TableName : "Movies"
    }
    const dynamodb = new AWS.DynamoDB();
    try{
        const result = await dynamodb.deleteTable(params).promise()
        return res.json(result)
    }catch(err){
        res.status(500).send(JSON.stringify(err))
    }
})

router.get('/load', async (req, res) => {
    const dynamodb = new AWS.DynamoDB();

    const params = {
        TableName : "Movies",
        KeySchema: [       
            { AttributeName: "year", KeyType: "HASH"},  //Partition key
            { AttributeName: "title", KeyType: "RANGE" }  //Sort key
        ],
        AttributeDefinitions: [       
            { AttributeName: "year", AttributeType: "N" },
            { AttributeName: "title", AttributeType: "S" }
        ],
        BillingMode: "PAY_PER_REQUEST"
    };
    try{
        await dynamodb.createTable(params).promise()
    }catch(err){
        console.log(err)
    }
    
    console.log("Importing movies into DynamoDB. Please wait.");

    const allMovies = JSON.parse(fs.readFileSync('moviedata.json', 'utf8'));
    for (const movie of allMovies) {
        console.log(movie)
        const params = {
            TableName: "Movies",
            Item: {
                "year":  movie.year,
                "title": movie.title,
                "info":  movie.info
            }
        };
        await ddbClient.put(params).promise()
    }

    res.send(JSON.stringify("Done"))
})

app.use('/', router)

module.exports = app;