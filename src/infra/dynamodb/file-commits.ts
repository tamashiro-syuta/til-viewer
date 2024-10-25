import {
  CreateFileCommitInputSchema,
  FileCommitsSchema,
} from "@/entity/file-commits.type";
import { formatDateToYYYYMMDD } from "@/lib/utils";
import { FileCommitsRepository } from "@/repository/file-commits";
import {
  BatchWriteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  WriteRequest,
} from "@aws-sdk/client-dynamodb";
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

  async Create({ date, path, commitCount }: CreateFileCommitInputSchema) {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        date: { N: formatDateToYYYYMMDD(date).toString() }, // パーティションキー: 数値
        path: { S: path }, // ソートキー: 文字列
        commitCount: { N: commitCount.toString() }, // 数値フィールド
      },
    };

    try {
      const command = new PutItemCommand(params);
      await client.send(command);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async BulkCreate(items: CreateFileCommitInputSchema[]) {
    const writeRequests: WriteRequest[] = items.map(
      ({ date, path, commitCount }) => ({
        PutRequest: {
          Item: {
            date: { N: formatDateToYYYYMMDD(date).toString() }, // パーティションキー: 数値
            path: { S: path }, // ソートキー: 文字列
            commitCount: { N: commitCount.toString() }, // 数値フィールド
          },
        },
      })
    );

    try {
      const command = new BatchWriteItemCommand({
        RequestItems: {
          [TABLE_NAME]: writeRequests,
        },
      });

      const response = await client.send(command);

      // UnprocessedItemsが返ってきた場合は再試行が必要
      if (
        response.UnprocessedItems &&
        Object.keys(response.UnprocessedItems).length > 0
      ) {
        await client.send(
          new BatchWriteItemCommand({
            RequestItems: response.UnprocessedItems,
          })
        );
      }
    } catch (error) {
      console.error("Error during bulk insert:", error);
      throw error;
    }
  }
}
