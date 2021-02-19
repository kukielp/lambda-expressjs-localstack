module.exports = function(router, ddbClient, table){

    router.get('/search/:year', async (req, res) => {
        let year
        if (!('year' in req.params)){
            year = 1984
        }else{
            year = parseInt(req.params.year)
        }
        const params = {
            TableName : table,
            KeyConditionExpression: "#yr = :yyyy",
            ExpressionAttributeNames:{
                "#yr": "year"
            },
            ExpressionAttributeValues: {
                ":yyyy": year
            }
        }
    
        try {
            const data = await ddbClient.query(params).promise()
            res.send(JSON.stringify(data))
        } catch (err) {
            console.log(err)
            res.status(500).send('Something broke!')
        }
    })

    router.get("/movieData/:year/:title", async (req, res) => {
        const year = parseInt(req.params.year)
        const title = req.params.title;
        const params = {
            TableName: table,
            Key:{
                "year": year,
                "title": title
            }
        };
        
        try {
            const data = await ddbClient.get(params).promise()
            res.send(JSON.stringify(data))
        } catch (err) {
            console.log(err)
            res.status(500).send('Something broke!')
        }
    });
}