module.exports = {
    getMovie: async function getMovie(year, title) { 
        const params = {
            TableName: table,
            Key:{
                "year": year,
                "title": title
            }
        }
        
        return await docClient.get(params).promise()
    }
}