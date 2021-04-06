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
            res.send(JSON.stringify({"message":"Movie deleted"}))
        } catch (err) {
            console.log(err.code)
            if (err.code === 'ConditionalCheckFailedException'){
                res.status(500).send(JSON.stringify({message:"Record not present"}))
            }else{
                res.status(500).send('Something broke!')
            }
        }
    })

}