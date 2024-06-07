export default function TableHeader({ children, className }) {
  return (
    <div
      style={{
        padding: "8px 15px",
        color: "#36383A",
        background: "#F1F4F9",
        border: "1px solid #F1F4F9",
        borderRadius: "6px",
        zIndex: 0,
      }}
      className={ className? `row list-group-item  list-group-item-action d-flex flex-row w-100 fw-bold ${className}` :`row list-group-item  list-group-item-action d-flex flex-row w-100 fw-bold `}
    >
      {children}
    </div>
  );
}
