const express = require("express");
const app = new express();
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
var cors = require("cors");
app.use(express.static("client-side/build"));
app.use(bodyParser.json());
app.use(cors());

// Upload Image File To UploadImages Directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./UploadImgs");
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);

    const fileName = file.originalname;
    cb(null, fileName);
  },
});

const limits = {
  fieldNameSize: 300,
  fileSize: 10000000, // 10 Mb
};
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/ebp" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Not Allow!"));
  }
};

const upload = multer({
  storage: storage,
  limits: limits,
  fileFilter: fileFilter,
}).single("uploaded_file");

app.post("/upload", (req, res) => {
  upload(req, res, (error) => {
    if (error) {
      res.send("fail");
    } else {
      res.send("success");
    }
  });
});

// Remove Uploaded File

app.post("/remove", (req, res) => {
  let ImageName = req.body["ImageName"];
  console.log(ImageName);
  fs.unlink("./UploadImgs/" + ImageName, (err) => {
    if (err) {
      res.send("fail");
    } else {
      res.send("success");
    }
  });
});

// Create PDF
app.post("/createPDF", (req, res) => {
  let ImgArrayData = req.body["ImgArrayData"];
  console.log(ImgArrayData);
  const doc = new PDFDocument({
    autoFirstPage: false,
    size: "a4",
    margin: 50,
  });
  let pdfFileName =
    Math.floor(100000 + Math.random() * 900000) +
    "_" +
    Math.round(new Date() / 1000) +
    "_output.pdf";
  doc.pipe(fs.createWriteStream("./OutputPDF/" + pdfFileName));
  let ImageOption = {
    align: "center",
    valign: "center",
    overflow: false,
  };
  ImgArrayData.forEach((item, i) => {
    doc.addPage().image("./UploadImgs/" + item.ImageName, ImageOption);
  });

  doc.end();
  res.send(pdfFileName);
});

// Download PDF
app.get("/downloadPDF/:outputFile", (req, res) => {
  let outputFile = req.params.outputFile;
  const file = `${__dirname}+"/OutputPDF/+ ${outputFile}`;
  res.download(file);
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
