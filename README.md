# lambda-expressjs-localstack
A demo of express js, that runs both locally and in lambda showing how to leverage DynamoDB locally via localstack.

This express app has 3 features:
- Serverside rendering via ejs
- The ability to serve static assests
- An API

You might ask why would I want to serve static assets from lambda rather then s3?  
- You have an exsiting app that you want to move to lambda and off long lived infra with minimal/no code change
- You need all connetivity over a private network ( private api-gateway )
- You want to deploy your applicaiton as a whole ( front end and backedn in the same repository/infrsastructure )

This respository consists of:
- Localstack docker-compose file with DynamoDB and S3 ready for use.
- A noodejs Express application that has a view template, some demonstration API's and the ability to serve static content
- A Sam Template to provision the AWS Cloudn infrastructure
- A sample dataset
- A script to load that sample dataset

Run locally ( express app ):

```
cd api
npm i
node run dev
```

Run locally ( localstack ):

```
docker-compose up
```

Load Dynamo:

http://localhost:3000/load

Test API:

http://localhost:3000/search/1991
http://localhost:3000/moviedata/1991/Beauty%20and%20the%20Beast

POSTS:
Increament, update, create

Browse static:

http://localhost:3000/static/bird.jpg