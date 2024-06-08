export default function TableHeader({ children, className }) {
  return (
    <div
      style={{
        padding: "8px 15px",
        color: "#000000",
        background: "#d8e8ff",
        border: "1px solid #F1F4F9",
        borderRadius: "6px",
        zIndex: 0,
        fontWeight:500
      }}
      className={ className? `row list-group-item  list-group-item-action d-flex flex-row w-100  ${className}` :`row list-group-item  list-group-item-action d-flex flex-row w-100  `}
    >
      {children}
    </div>
  );
}
