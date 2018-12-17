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

##Automatic alarm disabling via smartphone with IFTTT


IFTTT is a smartphone app, that lets the user create simple applications, like automatic deactivation of the WiFi if you leave your house without writing a complete App. Normally it would be possible to make the applet to control the automatic deactivation of the alarm, when you get with you smartphone in the defined range downloadable via IFTTT, but you can only upload predefined Applets with an company account, that I don’t have access to for an university project. Because of that I describe how to create the Applet yourself:
First of all, create an account on https://ifttt.com and then open the following URL:
https://ifttt.com/create
and choose the service “Location”: 
![Location](pictures_readme/Location.png)
Next, select the option “You enter an area” and define the area where you live.
The next step is to select the service “Webhooks”:
 ![Webhooks](pictures_readme/Webhooks.png)





In the next step, the parameters for the webrequest are required. The needed values are:
URL:	http://ip_of_client:3000/disableAlarm 
where ip_of_client is the IP-adress the device has where the clients runs on.
Method: 	Post
Content Type: 	application/json
Body:	{"email" : "your_registered_email_adress" } 
where your_registered_email_adress is the email you used registering in the client.
 ![Webrequest](pictures_readme/webrequest.png)


 

## Remarks


In addition you can setup some constants (like api address or imagePath) in the file constants.json


so you'll can test the client too.



