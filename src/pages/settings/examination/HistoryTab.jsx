import { useQuery } from "@tanstack/react-query";
import { fetchAllAppointmentRecords } from "../../../services/appointmentRecords";
import TableBody from "../../../components/TableBody";
import TableHeader from "../../../components/TableHeader";

export default function HistoryTab() {
  const appointmentRecordsQuery = useQuery({
    queryKey: ["appointmentrecords"],
    queryFn: fetchAllAppointmentRecords,
  });

  const recordHistory = appointmentRecordsQuery.data;
  let count = 1;

  function viewRecordHandler({ id }) {}

  return (
    <div className="w-100 h-100 d-flex flex-column gap-3">
      <TableHeader>
        <div className="text-start" style={{ width: "5%" }}>
          Stt
        </div>
        <div className="text-start" style={{ width: "45%" }}>
          Ngày khám
        </div>
        <div className="text-start" style={{ width: "40%" }}>
          Loại bệnh
        </div>
        <div className="text-end" style={{ width: "10%" }}>
          Thao tác
        </div>
      </TableHeader>
      <TableBody>
        {recordHistory &&
          recordHistory.map((record) => {
            return (
              <li
                className="list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                key={record.id}
              >
                <div className="text-start" style={{ width: "5%" }}>
                  {count++}
                </div>
                <div className="text-start" style={{ width: "45%" }}>
                  {record.appointmentListId}
                </div>
                <div className="text-start" style={{ width: "40%" }}>
                  {record.diseaseId}
                </div>
                <div className="text-end" style={{ width: "10%" }}>
                  <span onClick={() => viewRecordHandler({ id: record.id })}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="#1B59F8"
                      className="bi bi-eye-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                    </svg>
                  </span>
                </div>
              </li>
            );
          })}
      </TableBody>
    </div>
  );
}
