import NextLink from "next/link";

interface Props {
  href: string;
  children: React.ReactNode;
}

const Link = ({ href, children }: Props) => {
  return (
    <NextLink
      href={href}
      style={{
        color: "inherit",
        textDecoration: "none",
      }}
    >
      {children}
    </NextLink>
  );
};

export default Link;
