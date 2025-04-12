import express from "express";
import { downloadRawVideo, uploadProcessedVideo } from "./blobService";
import {
  convertVideo,
  deleteProcessedVideoFromLocal,
  deleteRawVideoFromLocal,
} from "./videoProcessing";

require("dotenv").config();

const app = express();
app.use(express.json());

app.post("/process-video", async (req, res) => {
  try {
    const fileName = req.body.fileName;
    if (!fileName) {
      throw new Error("Invalid message payload received.");
    }
  } catch (err) {
    console.error(err);
    res.status(400).send("Bad Request: Missing filename.");
  }
  let data = req.body;
  await downloadRawVideo(data.fileName);
  const convertedVideoName = data.fileName.replace(".mp4", "-processed.mp4");
  try {
    await convertVideo(data.fileName, convertedVideoName);
  } catch (err) {
    console.error(err);
    await Promise.all([
      deleteRawVideoFromLocal(data.fileName),
      deleteProcessedVideoFromLocal(convertedVideoName),
    ]);
    res.status(500).send("Internal Server Error: Video processing failed.");
  }
  await uploadProcessedVideo(convertedVideoName);
  await Promise.all([
    deleteRawVideoFromLocal(data.fileName),
    deleteProcessedVideoFromLocal(convertedVideoName),
  ]);

   res.status(200).send("Processing finished successfully");
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
