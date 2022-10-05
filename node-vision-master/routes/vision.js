var express = require("express");
var router = express.Router();
//import required package
var AWS = require("aws-sdk");

router.post("/classify", function (req, res, next) {
  // DON'T return the hardcoded response after implementing the backend
  let response = ["shoe", "red", "nike"];

  // Your code starts here //

  //aws access details
  const config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  //input parameters
  const params = {
    Image: {
      S3Object: {
        Bucket: "testingbucket",
        Name: req.files.file,
      },
    },
    MaxLabels: 10,
  };

  //cal aws rekognition class
  const client = new AWS.Rekognition();

  //detect labels
  client.detectLabels(params, function (err, response) {
    if (err) {
      console.log(err, err.stack); // if an error occurred
    } else {
      console.log(`Detected labels for: ${photo}`);
      response.Labels.forEach((label) => {
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
        labels: response,
      });
    }
  });

  // Your code ends here //
});

module.exports = router;
