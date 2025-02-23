# ws-ccminer
For monitoring mining devices

CCminer needs to have the api allowed on each device in a config.json
tested on Ubuntu, Windows & Debian. Node versions 17.9 & 18.12

# Install

cd ws-ccminer

change config.json.example to config.json & add your ip's, port ( ccminer MINING_PORT is 4068 )
you can change the interval, currently set to 10 seconds

npm install

# start app

node server.js

Open your browser at yourIP:5000

