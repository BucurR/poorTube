import ffmpeg from "fluent-ffmpeg";
import { createDirIfnotExists, deleteFile } from "./util";
import path from "path";
import { PROCESSED_VIDEO_PATH_LOCAL, RAW_VIDEO_PATH_LOCAL } from "./constants";



export async function convertVideo(
  rawVideoName: string,
  processedVideoName: string
): Promise<void> {

  await createDirIfnotExists(RAW_VIDEO_PATH_LOCAL);
  await createDirIfnotExists(PROCESSED_VIDEO_PATH_LOCAL);
  const localRawPath =  path.join(RAW_VIDEO_PATH_LOCAL, rawVideoName)
  const localProcessedPath = path.join(PROCESSED_VIDEO_PATH_LOCAL, processedVideoName)
  return new Promise<void>((resolve, reject) => {
    ffmpeg(localRawPath)
      .outputOptions("-vf", "scale=1280:720")
      .on("end", () => {
        console.log("Video processing finished successfully.");
        resolve();
      })
      .on("error", (err) => {
        console.error("Error processing video:", err);
        reject(err);
      })
      .save(localProcessedPath);
  });
}


export async function deleteRawVideoFromLocal(filename: string) {
  await deleteFile(path.join(RAW_VIDEO_PATH_LOCAL, filename));
  console.log(`Deleted raw video from local storage: ${filename}`);
}


export async function deleteProcessedVideoFromLocal(filename: string) {
  await deleteFile(path.join(PROCESSED_VIDEO_PATH_LOCAL, filename));
  console.log(`Deleted processed video from local storage: ${filename}`);
}
