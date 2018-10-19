# Thingy Security (back-end)

Back-end for Thingy Security Service, a system to watch over your doors.

## Getting Started

### Prerequisites

To run the API you need node.js and mongoDB.

### Installing

First you need to start the database. Just type

```
$ sudo service mongod start
```

To run the API use the command

```
$ MQTT_PASSWORD=1ea713ca2e npm start
```

from the repository. The API's url is [http://localhost:3000](http://localhost:3000).

## Authors

* **Matteo Badaracco**
* **Zeno Bardelli**
* **Mathias Birrer**
* **Manuel Drazyk**

## Remarks


You can create a new account with this command. Then you will get back a token that you need to save.

```
$ curl -X POST \
  http://localhost:3000/register \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{"username": "user", "password": "pwd", "email": "email@gmail.com"}'

```

With the previusly saved toen you can add new foos in order to test the api with this command (jus replace the eyJhbG... string with the real token that you saved ):
```
curl -X POST \
  http://localhost:3000/foos \
  -H 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidXNlciIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTUwMjI2OTg4MX0.Ugbh4UwN9tRwhIQEQUHoo-affUf5CAsCztzAXncBYt4' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{"foo":"hello"}'

```



so you'll can test the client too.
