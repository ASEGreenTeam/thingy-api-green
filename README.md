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

The back-end come with a dummy CRUD RESTful API with a resource called "foo". Its purpose is to be an example about how using the framework. You can generate some resource with

```
$ curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{"foo":"hello"}' 'http://localhost:3000/foos/'
```

so you'll can test the client too.
