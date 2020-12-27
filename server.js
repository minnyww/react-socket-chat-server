const server = require("http").createServer();
const io = require("socket.io")(server, {
   cors: {
      origin: "*",
   },
});

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const ALL_MESSAGE_EVENT = "allMessageEvent";
let AllMessage = [];
io.on("connection", (socket) => {
   // Join a conversation
   //    console.log("socket : ", socket.handshake);
   const { roomId } = socket.handshake.query;
   socket.join(roomId);

   // Listen for new messages
   socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
      console.log("data :: ", data);
      AllMessage = [...AllMessage, data];
      io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
      io.in(roomId).emit(ALL_MESSAGE_EVENT, AllMessage);
   });

   socket.on("joined", (event) => {
      console.log("event : ", event);
   });

   // Leave the room if the user closes the socket
   socket.on("disconnect", () => {
      socket.leave(roomId);
   });
});

server.listen(PORT, () => {
   console.log(`Listening on port ${PORT}`);
});
