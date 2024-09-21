interface Props {
  label: string;
}

const Chip = ({ label }: Props) => {
  return (
    <div
      className="chip"
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0 8px",
        margin: "0 6px 3px 0",
        height: "32px",
        minWidth: "32px",
        fontSize: "12px",
        backgroundColor: "grey",
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
        <p style={{ textAlign: "center", color: "white" }}>{label}</p>
      </div>
    </div>
  );
};

export default Chip;
