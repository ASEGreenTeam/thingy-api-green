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

## Telegram
In order to using Telegram with our api you need to go on Telegram and search for @thingyAlarm_bot.
Then the first thing that you will need to do is write:

```
$ /register your@mail.com
```
The mail needs to be the same mail that you use to enter in your thingy alarm account.
After that your chat will be linked to your thingy account and you could interact with it using the displayed commands.

## Remarks


In addition you can setup some constants (like api address or imagePath) in the file constants.json


so you'll can test the client too.



