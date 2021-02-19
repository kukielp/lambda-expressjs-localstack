module.exports = function(router, ddbClient, table){

    router.delete('/delete', async (req, res) => {
        const year = 2099;
        const title = "The Deletable Movie"
        const params = {
            TableName:table,
            Key:{
                "year": year,
                "title": title
            },
            ConditionExpression:"info.rating >= :val",   //Delete if rating greeater then 5
            ExpressionAttributeValues: {
                ":val": 5
            }
        };
        
        try {
            const data = await ddbClient.delete(params).promise()
            res.send(JSON.stringify(data))
        } catch (err) {
            console.log(err)
            res.status(500).send('Something broke!')
        }
    })

}