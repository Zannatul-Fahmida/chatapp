const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const { addUser, removeUser, getUserById, getRoomUsers, getRooms } = require("./users");

const app = express();
const port = 4000;

app.use(cors());

const httpServer = http.createServer(app);
const io = socketIO(httpServer, {
  autoConnect: false,
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) {
      callback(error);
    }
    socket.join(room);
    socket.emit("message", {
      user: "system",
      text: `Welcome ${name} to ${room}`,
    });
    socket.broadcast.to(room).emit("message", {
      user: "system",
      text: `${name} just joined ${room}`,
    });

    const roomUsers = getRoomUsers(room);
    io.to(room).emit("userList", {
      roomUsers,
    });

    io.emit("roomList", {
      rooms: getRooms(),
    });

    callback();
  });

  socket.on("message", (message) => {
    const user = getUserById(socket.id);

    io.to(user.room).emit("message", {
      user: user.name,
      text: message,
    });
  });

  socket.on("typing", ({ isTyping }) => {
    const user = getUserById(socket.id);
  
    if (isTyping) {
      io.to(user.room).emit("userTyping", {
        user: user.name,
        isTyping: true,
      });
    } else {
      io.to(user.room).emit("userTyping", {
        user: user.name,
        isTyping: false,
      });
    }
  });  

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "system",
        text: `${user.name} just left ${user.room}`,
      });
      const roomUsers = getRoomUsers(user.room);
      io.to(user.room).emit("userList", {
        roomUsers,
      });
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
