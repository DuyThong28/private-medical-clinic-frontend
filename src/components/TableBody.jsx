import "./TableBody.scss";

export default function TableBody({ children, isEditable }) {
  return (
    <div
      className={isEditable ? "row w-100 h-100" : "row w-100 h-100  scroll"}
      style={{
        zIndex: 0,
        scrollbarWidth: "thin",
      }}
    >
      <ul className=" list-group list-group-flush">{children}</ul>
    </div>
  );
}
