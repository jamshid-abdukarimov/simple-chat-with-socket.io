const cors = require("cors");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const rooms = new Map();
app.get("/rooms/:id", (req, res) => {
  const roomId = req.params.id;
  const currentRoom = rooms.get(roomId);
  console.log(currentRoom.get("users").values());
  const obj = rooms.has(roomId)
    ? {
        users: [...currentRoom.get("users").values()],
        messages: [...currentRoom.get("messages").values()],
      }
    : { users: [], messages: [] };
  res.json(obj);
});
app.post("/rooms", (req, res) => {
  const { roomId, userName } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ["users", new Map()],
        ["messages", []],
      ])
    );
  }
  res.json([...rooms.keys()]);
});

io.on("connection", (socket) => {
  socket.on("ROOM:JOIN", ({ roomId, userName }) => {
    socket.join(roomId);
    rooms.get(roomId).get("users").set(socket.id, userName);
    const users = [...rooms.get(roomId).get("users").values()];
    socket.broadcast.to(roomId).emit("ROOM:SET_USERS", users);
  });

  socket.on("ROOM:NEW_MESSAGE", ({ roomId, userName, text }) => {
    rooms.get(roomId).get("messages").push({ userName, text });
    socket.broadcast.to(roomId).emit("ROOM:NEW_MESSAGE", { userName, text });
  });

  socket.on("disconnect", () => {
    rooms.forEach((value, roomId) => {
      if (value.get("users").delete(socket.id)) {
        const users = [...value.get("users").values()];
        socket.broadcast.to(roomId).emit("ROOM:SET_USERS", users);
      }
    });
  });

  console.log("a user connected", socket.id);
});

server.listen(5000, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log("SERVER WORKS ON PORT 5000");
});
