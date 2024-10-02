import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";

// S3クライアントの設定
const s3 = new S3Client({
  region: "ap-northeast-1", // リージョンを設定
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const BUCKET_NAME = "til-viewer-images"; // S3バケット名

export const getImageAsBase64 = async (key: string): Promise<string> => {
  try {
    // GetObjectCommandでS3からオブジェクトを取得
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    const response = await s3.send(command);

    // ストリームを読み込み、データをBufferに変換
    const readableStream = response.Body as Readable;
    const chunks: Uint8Array[] = [];
    for await (const chunk of readableStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Base64エンコードして返す
    const base64Image = buffer.toString("base64");
    return `data:image/jpeg;base64,${base64Image}`; // 画像形式がJPEGの場合
  } catch (error) {
    console.error("Error getting image from S3:", error);
    throw error;
  }
};
