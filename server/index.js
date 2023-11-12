const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/authRoutes");
const msgRoutes = require("./routes/messagesRoutes");
const socket = require("socket.io");

require("dotenv").config();

// creating an express app
const app = express();

// using cors and express's json
app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/msg", msgRoutes);

// connecting to mongoose DB
const DatabaseConnected = () => console.log("DB connected successfully");
const DatabaseNotConnected = (err) =>
  console.log("DB didn't connect with error:", err);

mongoose
  .connect(process.env.DB_URL, {
    // useNewUrlParser: true,
  })
  .then(DatabaseConnected)
  .catch(DatabaseNotConnected);
//   .catch((err) => console.log(err));

// starting the server
const serverIsStarted = (PORT) => console.log("Sever started on port:", PORT);

const server = app.listen(
  process.env.PORT || 4000,
  serverIsStarted(process.env.PORT)
);

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    Credential: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-received", data.msg);
    }
  });
});
