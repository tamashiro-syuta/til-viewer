import { FileCommitsSchema } from "@/entity/file-commits.type";
import { formatDateToYYYYMMDD } from "@/lib/utils";
import { FileCommitsRepository } from "@/repository/file-commits";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const ddbDocClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "file-commits-table";

export class NewFileCommitsRepository implements FileCommitsRepository {
  async GetCommitByDate(date: Date): Promise<FileCommitsSchema[] | undefined> {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "#d = :pk", // NOTE: エイリアス #d に置き換え
      ExpressionAttributeNames: {
        "#d": "date", // NOTE: エイリアスで予約語を回避
      },
      ExpressionAttributeValues: {
        ":pk": formatDateToYYYYMMDD(date), // NOTE: 日付のフォーマットを整形
      },
    };

    try {
      const data = await ddbDocClient.send(new QueryCommand(params));
      console.log("result : " + JSON.stringify(data));

      const fileCommits = data.Items?.map((item) => {
        const fileCommit: FileCommitsSchema = {
          date: item.date,
          path: item.path,
          commitCount: item.commitCount,
        };

        return fileCommit;
      });

      return fileCommits;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async GetListBetweenDate(
    start: Date,
    end: Date
  ): Promise<FileCommitsSchema[] | undefined> {
    const params = {
      TableName: TABLE_NAME,
      FilterExpression: "#d BETWEEN :start AND :end",
      ExpressionAttributeNames: {
        "#d": "date",
      },
      ExpressionAttributeValues: {
        ":start": formatDateToYYYYMMDD(start),
        ":end": formatDateToYYYYMMDD(end),
      },
    };

    try {
      const data = await ddbDocClient.send(new ScanCommand(params));
      const fileCommits = data.Items?.map((item) => {
        const fileCommit: FileCommitsSchema = {
          date: item.date,
          path: item.path,
          commitCount: item.commitCount,
        };

        return fileCommit;
      });

      return fileCommits;
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
