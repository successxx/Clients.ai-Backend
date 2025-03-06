import { createWriteStream } from "fs";
const fs = require("node:fs");
import { v4 as uuidv4 } from "uuid";

export const uploadFile = async (
  file: any,
  fileName: string,
  subDirectory: string,
  userId: number
) => {
  fileName = uuidv4() + "-" + fileName;
  const folderName = createFolder(subDirectory, userId);
  const filePath = `${folderName}/${fileName}`;
  const relativePath = `/uploads/${subDirectory}/${userId}/${fileName}`;
  const writeStream = createWriteStream(filePath);
  return new Promise((resolve, reject) => {
    file
      .pipe(writeStream)
      .on("finish", () => {
        resolve(relativePath);
      })
      .on("error", (err: any) => {
        reject(err);
      });
  });
};

const createFolder = (subDirectory: string, userId: number) => {
  const folderName = __dirname + `/../uploads/${subDirectory}/${userId}`;
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName, { recursive: true });
    }
    return folderName;
  } catch (err) {
    console.error(err);
  }
};
