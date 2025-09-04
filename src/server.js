// server.js
import express from "express";
import { WebSocketServer } from "ws";
import path from "path";

const app = express();
const port = 3000;

// Serve static files from public/
app.use(express.static("public"));

// Start Express server
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

let scoreData = {
    homeName: "ทีมเจ้าบ้าน",
    awayName: "ทีมเยือน",
    homeScore: 0,
    awayScore: 0
};

wss.on("connection", (ws) => {
    // ส่งข้อมูลปัจจุบันไป client ใหม่
    ws.send(JSON.stringify(scoreData));

    // รับข้อมูลจาก config.html
    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);
            scoreData = { ...scoreData, ...data };

            // ส่งให้ทุก client
            wss.clients.forEach(client => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify(scoreData));
                }
            });
        } catch (e) {
            console.error("Invalid message", e);
        }
    });
});
