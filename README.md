# Tiuku

An end-to-end encrypted app to create date-based polls. Demo deployment at [https://tiuku.holmlund.dev](https://tiuku.holmlund.dev/).

## Developing

Development is done in a container environment. Podman is the recommended approach. In order to run the program, clone the repository to your machine, start the container and get a shell inside it:
- `$ git clone https://github.com/maholmlund/tiuku`
- `$ cd tiuku`
- `$ podman-compose up -d`
- `$ podman exec -it tiuku-node-dev-env-1 bash`

Next install dependencies and run the project inside the container:
- `$ cd /host`
- `$ npm i`
- `$ npm run dev`

The applications is listening on localhost:3000.

## Deploying

First deploy a MongoDB database and get the connection url. Tiuku can be deployed in a container which can be obtained from github: ghcr.io/maholmlund/tiuku:latest. Two environment variables are needed for the container:
- `MONGODB_URI`: the connection string to use to connect to the MongoDB database
- `TIUKU_BASE_URL`: the base url of the service, for example `https://tiuku.holmlund.dev`

In order to delete polls after 30 days, run this in the MongoDB database:
```
db.polls.createIndex(
   { "createdAt": 1 },
   { expireAfterSeconds: 2592000 }
)
```
