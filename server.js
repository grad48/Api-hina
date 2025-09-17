const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

const API_KEY = "fa219ec2-f9ba-4816-95e8-adbe997759e8";

app.post("/enhance", upload.single("image"), async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.deepai.org/api/torch-srgan",
      {
        image: fs.createReadStream(req.file.path),
      },
      {
        headers: { "api-key": API_KEY },
      }
    );

    fs.unlinkSync(req.file.path);

    res.json({ enhanced: response.data.output_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error enhancing image" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
