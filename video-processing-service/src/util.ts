import fs from 'fs';

export async function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Failed to delete file at ${filePath}`, err);
            reject(err);
          } else {
            console.log(`File deleted at ${filePath}`);
            resolve();
          }
        });
      } else {
        console.log(`File not found at ${filePath}, skipping delete.`);
        resolve();
      }
    });
  }
export async function createDirIfnotExists(dirPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(dirPath)) {
        fs.mkdir(dirPath, { recursive: true }, (err) => {
          if (err) {
            console.error(`Failed to create directory at ${dirPath}`, err);
            reject(err);
          } else {
            console.log(`Directory created at ${dirPath}`);
            resolve();
          }
        });
      } else {
        console.log(`Directory already exists at ${dirPath}, skipping creation.`);
        resolve();
      }
    });
  }