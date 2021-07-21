## To run

```
nvm use
npm install
npm start
```

## To test

```
npm test
```

## Endpoints

Create train

```
curl -X POST -d '{ "data": { "name": "TRN1", "times": ["03:33", "23:59"] } }' -H "Content-Type: application/json" http://localhost:3000/api/trains
```

Get first time multiple trains run after specified time

```
curl http://localhost:3000/api/trains/overlaps/03:33
```
