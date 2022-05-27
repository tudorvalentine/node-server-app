const express = require("express");
const path = require("path");
const { hostname } = require("os");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 80;
const urlencodedParser = express.urlencoded({ extended: false });
var options = {
  root: path.join(__dirname),
};
const pathDownload = options.root + "/download/";
app.use(express.static(__dirname + "/"));
app.get("/", (req, res) => {
  res.end("<h1>Hello, it is my SERVER for the Augmented Images application based on Android OS!</h1>")

  const parseIp = (request) =>
  request.headers["x-forwarded-for"]?.split(",").shift() ||
  request.socket?.remoteAddress;

  console.log(parseIp(req));
});

function s_f(response, file) {
  let fullFilePath = pathDownload + file;
  fs.stat(pathDownload + file, (err, stats) => {
    if (err) {
      console.log("File not found.");
      response.send("File not found!!");
    } else {
      console.log("Download file > " + fullFilePath);
      response.attachment(fullFilePath);
      response.sendFile(fullFilePath);
      console.log(fullFilePath + " was downloaded !!");
    }
  });
}

app.get("/download", (req, res) => {
  console.log(req.query);
  s_f(res, req.query.filename);
});
app.get("/pdf", (req, res) => {
  let pathPDF = "https://" + req.headers.host + "/pdf/" + req.query.pdf;
  let page = '<iframe src="' + pathPDF + '" width="100%" height="600" />';
  console.log("Sent PDF ...");
  res.send(page);
  console.log("PDF was sent!");
});
app.get("/form-input", (req, res) => {
  let fileName = "form-input/form.html";
  res.sendFile(fileName, options, (err) => {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
