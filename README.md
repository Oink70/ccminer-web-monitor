# ws-ccminer
For monitoring mining devices

Each mining device has an API, create a config.json on each device to allow the api
In the api-allow, place the network range for your network
Example of config.json below 

{
        "pools":[
        {
                "name": "paddypool.net",
        "url": "stratum+tcp://stratum-eu.paddypool.net:9998",
                "timeout": 150
        },
        {
                "name": "paddypool.net",
        "url": "stratum+tcp://paddypool.net:9998",
                "timeout": 60,
                "time-limit": 600
        }],

        "user": "placeminingaddresshere.name##",
        "algo": "verus",
        "threads": 4,
        "cpu-priority": 1,
        "retry-pause": 5,
        "api-allow": "192.168.0.0/24",
        "api-bind": "0.0.0.0:4068"
}
