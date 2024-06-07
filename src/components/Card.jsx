export default function Card({ children, className }) {
  return (
    <div
      className={"col h-100 "}
      style={{
        backgroundColor: "transparent",
        boxShadow: "6px 6px 54px 0px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div
        className={
          !className ? "w-100 h-100  rounded-3 p-3 bg-white" : className
        }
      >
        {children}
      </div>
    </div>
  );
}
