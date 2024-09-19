import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

interface Props {
  label: string;
}

const Chip = ({ label }: Props) => {
  return (
    <Box
      className="chip"
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0 8px",
        margin: "0 6px 3px 0",
        height: "32px",
        minWidth: "32px",
        fontSize: "12px",
        backgroundColor: grey[300],
        borderRadius: "16px",
        cursor: "default",
      }}
    >
      <div
        className="label"
        style={{
          padding: "0 4px",
        }}
      >
        <Typography variant="body2" textAlign={"center"} color="textPrimary">
          {label}
        </Typography>
      </div>
    </Box>
  );
};

export default Chip;
