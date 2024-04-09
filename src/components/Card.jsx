export default function Card({ children }) {
  return (
    <div className="col h-100 p-3" style={{ backgroundColor: "#F9F9F9" }}>
      <div className="w-100 h-100 shadow border rounded-4 p-3 bg-white">
        {children}
      </div>
    </div>
  );
}
