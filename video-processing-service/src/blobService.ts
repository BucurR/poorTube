import { BlobServiceClient } from "@azure/storage-blob";
import { RAW_VIDEO_PATH_LOCAL } from "./constants";
import path from "path";

const sasUrl = `https://poortubestorage.blob.core.windows.net/?${process.env.AZURE_STORAGE_SAS_TOKEN}`;
const blobServiceClient = new BlobServiceClient(sasUrl);
const rawVideoContainerName = "raw-videos";
const processedVideoContainerName = "processed-videos";
const rawVideoContainer = blobServiceClient.getContainerClient(
  rawVideoContainerName
);
const processedVideoContainer = blobServiceClient.getContainerClient(
  processedVideoContainerName
);

export async function downloadRawVideo(
  fileName: string,
): Promise<void> {
  const blockBlobClient = rawVideoContainer.getBlockBlobClient(fileName);
  console.log(
    `Downloading video "${fileName}" ...`
  );
  const downloadFilePath = path.join(RAW_VIDEO_PATH_LOCAL, fileName);
  await blockBlobClient.downloadToFile(downloadFilePath);
  console.log(`Download completed: ${rawVideoContainerName}/${fileName} downloaded to ${downloadFilePath}`);
}

export async function uploadProcessedVideo(
    fileName: string
  ): Promise<void> {
    const blockBlobClient = processedVideoContainer.getBlockBlobClient(fileName);
    const localFilePath = path.join(RAW_VIDEO_PATH_LOCAL, fileName);
    console.log(`Uploading file "${localFilePath}" to blob "${fileName}"...`);
    await blockBlobClient.uploadFile(localFilePath);
    console.log(`Upload completed:Uploaded ${fileName} to blob: ${blockBlobClient.url}`);
  }
  