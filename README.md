# lambda-expressjs-localstack
A demo of express js, that runs both locally and in lambda showing how to leverage DynamoDB locally via localstack.

This express app has 3 features:
- Serverside rendering via [EJS](https://ejs.co/)
- The ability to serve static assests
- An API

You might ask why would I want to serve static assets from Lambda rather then S3?  
- You have an exsiting Express app that you want to move to Lambda and off long lived serveres with minimal/no code change.
- You need private connectivity over a private network ( private api-gateway ) and S3 is not an option.
- You want to deploy your application as a whole ( front end and backend in the same repository/infrastructure )

This respository consists of:
- [Localstack](https://github.com/localstack/localstack) docker-compose file with DynamoDB and S3 ready for use.
- A Nodejs Express application that has a View template, some demonstration API's and the ability to serve static content.
- A [SAM](https://aws.amazon.com/serverless/sam/) Template to provision the AWS Clound infrastructure.
- A sample dataset
- A script to load that sample dataset

Run locally ( Express App ):

```
cd api
npm i
node run dev
```
Then browse to http://127.0.0.1:3000

Run locally ( Localstack ):

```
docker-compose up
```
For local use you will need to alter ( uncomment ) the end point for the AWS SDK in app.js line 14 
``` 
//endpoint:'http://localhost:4566',
```

Load sample data Dynamo: ( not this will work in both AWS Lambda and locally )

http://localhost:3000/load

Test API mini app:

http://localhost:3000/index

You can deploy this to AWS the requirements are:
 - A valid AWS cli profile
 - The SAM cli installed [Click here for how to](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

 If you do not have a custom domain then removed the domain sesion of the api in template.yaml
 ```
 Domain:
        DomainName: {your-domain-name}
        CertificateArn: {the-arm-to-the-certificate-in-acm}
        Route53:
          HostedZoneId: {the-zone-id}
```

Once the domain section is removed or populated you cn deploy with:
```
sam deploy --guided
```

This will created and deploy the DynamoDB table, the Lambda function, API gateway in your enviroment.