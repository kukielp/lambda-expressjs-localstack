const express = require('express')
const app = express()
const router = express.Router()
const AWS = require('aws-sdk')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const loremIpsum = require("lorem-ipsum").loremIpsum;

AWS.config.update({
    region: 'ap-southeast-2',
    //Fix this so we check what enviroment we are runnign in
    //endpoint:'http://localhost:4566',
})

//Static content ie images
app.use('/static', express.static('public'))

//Fix to be an env varibale
const table = "Movies"
const ddbClient = new AWS.DynamoDB.DocumentClient();

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

require('./routes/gets')(router, ddbClient, table)
require('./routes/posts')(router, ddbClient, table, loremIpsum)
require('./routes/delete')(router, ddbClient, table)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

router.get('/', function(req, res) {
    res.render('index', { title: 'Default Route' })
})

router.get('/index', function(req, res) {
    res.render('index', { title: 'Default Route' })
})

router.get('/testrender', function(req, res) {
    res.render('testrender', { title: 'Some random Text' })
})

//Send Single File
router.get('/birdy.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/bird.jpg'))
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

//Normally don;t want to provide lambda with access to create table in Dynamo
//and we woudl just use Cloudformation to create the table.
//This is usefull for this example to create the table locally and load it with sample data
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