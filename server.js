const net = require("net");
const WebSocket = require("ws");
const http = require("http");
const chalk = require('chalk');
const fs = require('fs');
const express = require('express');

const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));
const { MINING_IPS, MINING_PORT, CHECK_INTERVAL } = config;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/public/index.html");
})

let clients = new Set();

wss.on("connection", (ws) => {
    clients.add(ws);
    console.log(chalk.green("New WebSocket client connected."));
    ws.on("close", () => {
        clients.delete(ws);
        console.log(chalk.yellow("WebSocket client disconnected."));
    });
});

function queryMiner(ip) {
    const client = new net.Socket();
    let response = "";

    client.connect(MINING_PORT, ip, () => {
        //console.log(chalk.blue(`Connected to miner at ${ip}:${MINING_PORT}`));
        client.write("summary|\n");
    });

    client.on("data", (data) => {
        response += data.toString();
    });

    client.on("end", () => {
        const match = response.match(/KHS=([\d.]+)/);
        let result = {};

        if (match) {
            const khs = parseFloat(match[1]);
            console.log(chalk.green(`${ip} - Hashrate (KHS): ${khs}`));
            result[ip] = khs;
        } else {
            console.log(chalk.red(`${ip} - No KHS data found.`));
            result[ip] = 0;
        }
        
        broadcast(result);
        client.destroy();
    });

    client.on("error", (err) => {
        console.error(chalk.red(`${ip} - Error:`), err.message);
    });
}

function queryAllMiners() {
    console.log(chalk.cyan("Querying all miners..."));
    MINING_IPS.forEach((ip) => {
        queryMiner(ip);
    });
}

function broadcast(data) {
    const jsonData = JSON.stringify(data);
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(jsonData);
        }
    });
    //console.log(chalk.magenta("Broadcasting data to clients..."));
}

setInterval(queryAllMiners, CHECK_INTERVAL);

server.listen(5000, () => {
    console.log(chalk.green("WebSocket server running on http://127.0.0.1:5000"));
});
