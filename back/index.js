require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
https = require("https");
const app = express();
const receivingRouter = require("./routes/receivingRouter.js");
const sendingRouter = require("./routes/sendingRouter.js");
const updatingRouter = require("./routes/updatingRouter.js");
const refreshingRouter = require("./routes/refreshingRouter.js");
const userRouter = require("./routes/userRouter.js");
const cors = require("cors");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'ccg')))

app.use(cors({ origin: "*" }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  console.log(req.originalUrl);
  next();
});
function logger(req, res, next) {
  console.log(
    "*********************************************************************** \n",
    "Time of request :",
    new Date(),
    " path of request :",
    req.baseUrl,
    " \n body of request :",
    req.body
  );

  var oldWrite = res.write,
    oldEnd = res.end;

  var chunks = [];

  res.write = function (chunk) {
    chunks.push(chunk);

    return oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) chunks.push(chunk);
    var body = Buffer.concat(
      chunks.map((x) => (typeof x === "string" ? Buffer.from(x, "binary") : x))
    ).toString("utf8");
    console.log(
      "*********************************************************************** \n",
      "Time of response :",
      new Date(),
      "Path of response : ",
      req.path,
      " \n body of response ",
      body,
      "\n"
    );
    oldEnd.apply(res, arguments);
  };

  next();
}
app.use(logger);
app.use("/receiving", receivingRouter);
app.use("/refreshing", refreshingRouter);
app.use("/sending", sendingRouter);
app.use("/updating", updatingRouter);
app.use("/user", userRouter);

const readFiles = async (folder)=>{
  console.log("reading files in ", folder);
  return new Promise((resolve, reject)=>{
    fs.readdir(folder, (err, files) => {
      var names =[]
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        names.push(file)
      }
      resolve(names)
    });
  })
}
app.get("/recievedFiles", async (req, res) => {
  const recievedFilesFolder = "/home/opendata/reception_cft/CCG/";
  const fs = require("fs");
  var recievedFiles  = await readFiles(recievedFilesFolder)
  res.status(200).json(recievedFiles)
});
app.get("/sentFiles", async (req, res) => {
  const sentFilesFolder = "/home/opendata/archive/";
  const fs = require("fs");
  var sentFiles  = await readFiles(sentFilesFolder)
  res.status(200).json(sentFiles)
});
app.post("/download", (req, res) => {
  const filename = req.body.filename
  const filePath = path.join('/home/opendata/', filename);
  res.download(filePath, function (err) {
    if (err) {
      res.status(500).send([])
    }
  });
});
app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "ccg/index.html"));
});
// https
//   .createServer(
//     {
//       key: fs.readFileSync("key.pem"),
//       cert: fs.readFileSync("cert.pem"),
//       passphrase: "alamana",
//     },
//     app
//   )
//   .listen(2023, () => {
//     console.log("AAA-CCG API is running at ", 2023);
//   });

  app.listen(2023, () => {
    console.log("AAA-CCG API is running at ", 2023);
  });