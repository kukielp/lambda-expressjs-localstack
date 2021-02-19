module.exports = function(router, docClient, table, loremIpsum){
    
    router.post('/increamentRating', async (req, res) => {

        const year = req.body.year;
        const title = req.body.title;
        const params = {
            TableName:table,
            Key:{
                "year": year,
                "title": title
            },
            UpdateExpression: "set info.rating = info.rating + :val",
            ExpressionAttributeValues:{
                ":val": 1
            },
            ReturnValues:"UPDATED_NEW"
        }

        try {
            const data = await docClient.update(params).promise()
            res.send(JSON.stringify(data))
        } catch (err) {
            res.status(500).send('Something broke!')
        }
    })

    router.post('/create', async (req, res) => {
        
        const year = req.body.year;
        const title = req.body.title;
        const params = {
            TableName: table,
            Item:{
                "year": year,
                "title": title,
                "info":{
                    "plot": loremIpsum(), //Some random text
                    "rating": 0
                }
            }
        };

        try {
            const data = await docClient.put(params).promise()
            res.send(JSON.stringify(params.Item))
        } catch (err) {
            res.status(500).send('Something broke!')
        }
    })

    router.post('/createDeleteSample', async (req, res) => {
        
        const year = 2099
        const title = "The Deletable Movie"
        const params = {
            TableName: table,
            Item:{
                "year": year,
                "title": title,
                "info":{
                    "plot": loremIpsum(), //Some random text
                    "rating": 0
                }
            }
        };

        try {
            const data = await docClient.put(params).promise()
            res.send(JSON.stringify(data))
        } catch (err) {
            res.status(500).send('Something broke!')
        }
    })

    router.post('/update', async (req, res) => {
        
        const year = req.body.year;
        const title = req.body.title;
        const params = {
            TableName:table,
            Item:{
                "year": year,
                "title": title,
                "info":{
                    "plot": "Nothing happens at all.",
                    "rating": 0
                }
            }
        }

        try {
            const data = await docClient.put(params).promise()
            res.send(JSON.stringify(data))
        } catch (err) {
            res.status(500).send('Something broke!')
        }
    })
}