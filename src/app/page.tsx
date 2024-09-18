import { Divider, List, ListItem, ListItemText } from "@mui/material";
import Link from "@/components/link";
import { fetchAllArticles } from "@/lib/repository";

export default async function Home() {
  const articles = await fetchAllArticles();

  return (
    <List>
      <Divider />
      {articles.map((article) => (
        <Link href={`/${article}`} key={`all-articles-page-${article}`}>
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
