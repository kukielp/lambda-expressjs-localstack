# lambda-expressjs-localstack
A demo of express js, that runs both locally and in lambda showing how to leverage DynamDB locally via localstack.

Run locally:

```
cd api
npm i
node run dev
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