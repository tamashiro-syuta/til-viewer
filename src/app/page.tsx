import { Divider, List, ListItem, ListItemText } from "@mui/material";
import { fetchAllArticles } from "./actions/repository";
import Link from "@/components/link";

export default async function Home() {
  const articles = await fetchAllArticles();

  return (
    <List>
      <Divider />
      {articles.map((article) => (
        <Link href={`/${article}`}>
          <ListItem>
            <ListItemText
              primary={article}
              sx={{ overflowWrap: "break-word" }}
            />
          </ListItem>
          <Divider />
        </Link>
      ))}
    </List>
  );
}
