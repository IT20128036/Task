var express = require("express");
var router = express.Router();
//import required package
var AWS = require("aws-sdk");

router.post("/classify", function (req, res, next) {
  // DON'T return the hardcoded response after implementing the backend

  let responses = [];

  console.log(req.files.file.name);

  const photo = req.files.file.data;
  // Your code starts here //

  //aws access details
  AWS.config.update({
    accessKeyId: "",
    secretAccessKey: "",
    region: "",
  });

  //input parameters
  const params = {
    Image: {
      Bytes: photo,
    },
    MaxLabels: 10,
  };

  //call aws rekognition class
  const client = new AWS.Rekognition();

  //detect labels
  client.detectLabels(params, function (err, response) {
    if (err) {
      console.log(err, err.stack); // if an error occurred
    } else {
      console.log(`Detected labels for: ${photo}`);
      response.Labels.forEach((label) => {
        responses.push(label.Name);
        console.log(`Label:      ${label.Name}`);
        console.log(`Confidence: ${label.Confidence}`);
        console.log("Instances:");
        label.Instances.forEach((instance) => {
          let box = instance.BoundingBox;
          console.log("  Bounding box:");
          console.log(`    Top:        ${box.Top}`);
          console.log(`    Left:       ${box.Left}`);
          console.log(`    Width:      ${box.Width}`);
          console.log(`    Height:     ${box.Height}`);
          console.log(`  Confidence: ${instance.Confidence}`);
        });
        console.log("Parents:");
        label.Parents.forEach((parent) => {
          console.log(`  ${parent.Name}`);
        });
      });
      //response
      res.json({
        labels: responses,
      });
    }
  });

  // Your code ends here //
});

module.exports = router;
