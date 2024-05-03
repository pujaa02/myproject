const express = require("express");
const cookie = require("cookie-parser");
const Swal = require("sweetalert2");
const app = express();
const http = require("http");
const server = http.createServer(app);
app.use(cookie());
app.use(express.json());
require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const logger = require("./logger");
app.set("view engine", "ejs");
const path = require("path");
const bodyParser = require("body-parser");
let port = process.env.PORT;
const userAuth = require("./routes/userAuthentication");
const route = require("./routes/bookSearchRoutes");
const bookpageroute = require("./routes/route2");
const userProfileRoute = require("./routes/userProfileRoutes");
const exp = require("constants");
app.use("/", route);
app.use(userAuth);
app.use(cookie());
app.use(express.static(__dirname + "/uploads"));
app.use(express.static(__dirname + "/comuploads"));
app.use(express.static(__dirname + "/public"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/sweetalert2",
  express.static(path.join(__dirname, "node_modules/sweetalert2/dist"))
);
app.use(
  "/charts",
  express.static(path.join(__dirname, "node_modules/apexcharts/dist/"))
);
app.use("/", require("./routes/bookDetail_route"));
app.use("/", userProfileRoute);
app.use("/", require("./routes/authorRoutes"));
app.use("/", require("./routes/issueBookRoutes"));
app.use("/", require("./routes/userAuthentication"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/", require("./routes/ticket"));
app.use(bookpageroute);

app.get("*", (req, res) => {
  res.render("wrongUrl");
});
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  socket.on("comment", (cmt) => {
    io.emit("repcmtsuccess", cmt);
  });

  socket.on("nestedcomment", (nescmt) => {
    io.emit("repnescmtsuccess", nescmt);
  });

  socket.on("sensation", (event) => {
    event;
    io.emit("respSensation", event);
  });
  socket.on("nestedcomment", (nescmt) => {
    io.emit("repnescmtsuccess", nescmt);
  });
  socket.on("community", () => {
    io.emit("rescommunity");
  });
});
server.listen(process.env.PORT, (err) => {
  if (err) {
    logger.error(
      `Error: other server is running in  ${port} ,change the port number`
    );
  } else {
    logger.info(`Server is running in port: ${port} `);
    app.use(userAuth);
  }
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    socket.broadcast.emit(`chat-message-${msg.ticket}`, msg.msg);
  });
});

io.on("end", (socket) => {
  ("hii");
});
