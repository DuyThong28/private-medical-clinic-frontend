import { Navigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  let title = "Không Tìm Thấy!";
  let message = "Không thể tìm thấy tài nguyên hay trang!";

  return (
    <div className="col h-100">
      <div
        className="h-100 position-relative"
        style={{ backgroundColor: "#F9F9F9" }}
      >
        <div
          className="position-absolute start-50 translate-middle text-center"
          style={{ top: "40%" }}
        >
          <h1>{title}</h1>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}
