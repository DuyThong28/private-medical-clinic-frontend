import { useQuery } from "@tanstack/react-query";
import { useParams, useRouteError } from "react-router-dom";
import { useRef } from "react";

import TableBody from "../../../components/TableBody";
import TableHeader from "../../../components/TableHeader";
import RescordHistoryModal from "./RecordHistoryModal";

import {
  deleteAppointmentRecordById,
  fetchAppointmentRecordByPatientId,
} from "../../../services/appointmentRecords";
import { convertDate } from "../../../util/date";
import { fetchAppointentListPatientById } from "../../../services/appointmentListPatients";
import { fetchAllDisease } from "../../../services/diseases";
import NotificationDialog, {
  DialogAction,
} from "../../../components/NotificationDialog";
import useAuth from "../../../hooks/useAuth";

export default function HistoryTab({ isEditable }) {
  let { patientId } = useParams();
  const modalRef = useRef();
  const notiDialogRef = useRef();
  const { appopintmentListPatientId } = useParams();

  const { auth } = useAuth();
  const permission = auth?.permission || [];

  const diseasesQuery = useQuery({
    queryKey: ["diseases"],
    queryFn: fetchAllDisease,
  });

  const diseaseState = diseasesQuery.data;

  const patientData = useQuery({
    queryKey: ["appointmentlistpatient", appopintmentListPatientId],
    queryFn: () =>
      fetchAppointentListPatientById({ id: appopintmentListPatientId }),
    enabled: !patientId,
  });

  if (!patientId) {
    patientId = patientData.data && patientData.data?.patientId;
  }

  const appointmentRecordsQuery = useQuery({
    queryKey: ["appointmentrecords", patientId],
    queryFn: () => fetchAppointmentRecordByPatientId({ patientId }),
  });
  const recordHistory = appointmentRecordsQuery.data;

  function getDiseaseName({ id }) {
    const res = diseaseState.filter((disease) => disease.id == id);
    return res[0]?.diseaseName ?? "";
  }

  async function showRecordHandler({ id }) {
    await modalRef.current.show({ id });
  }

  async function deleterecordHandler({ id }) {
    notiDialogRef.current.setDialogData({
      action: DialogAction.DELETE,
      dispatchFn: () => deleteAppointmentRecordById({ id }),
    });
    notiDialogRef.current.showDialogWarning({
      message: "Xác nhận xóa phiếu khám bệnh?",
    });
  }

  const error = useRouteError();
  if (auth.isPending) {
    return <></>;
  }
  if (!auth.isAuth || (auth.isAuth && !permission.includes("RRecord"))) {
    throw error;
  }

  return (
    <>
      <NotificationDialog
        ref={notiDialogRef}
        keyQuery={["appointmentrecords", patientId]}
      />
      <RescordHistoryModal ref={modalRef} />
      <div className="w-100 h-100 d-flex flex-column gap-3">
        <TableHeader>
          <div className="text-start" style={{ width: "20%" }}>
            Mã ca khám
          </div>
          <div className="text-start" style={{ width: "29%" }}>
            Ngày khám
          </div>
          <div className="text-start" style={{ width: "40%" }}>
            Loại bệnh
          </div>
          <div className="text-end" style={{ width: "10%" }}>
            Thao tác
          </div>
          <div style={{ width: "1%" }}></div>
        </TableHeader>
        <TableBody>
          {recordHistory && recordHistory.length > 0 ? (
            recordHistory.map((record) => {
              return (
                <li
                  className="list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                  key={record.id}
                >
                  <div className="text-start" style={{ width: "20%" }}>
                    {record.id}
                  </div>
                  <div className="text-start" style={{ width: "30%" }}>
                    {convertDate(record.appointmentList.scheduleDate)}
                  </div>
                  <div className="text-start" style={{ width: "40%" }}>
                    {getDiseaseName({ id: record.diseaseId })}
                  </div>
                  <div className="text-end" style={{ width: "10%" }}>
                    {permission?.includes("RRecord") && (
                      <span
                        className="p-2"
                        onClick={() => showRecordHandler({ id: record.id })}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="#646565"
                          className="bi bi-eye-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                        </svg>
                      </span>
                    )}

                    {permission?.includes("DRecord") && isEditable && (
                      <span
                        className="p-2"
                        onClick={() => deleterecordHandler({ id: record.id })}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="#646565"
                          className="bi bi-archive-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8z" />
                        </svg>
                      </span>
                    )}
                  </div>
                </li>
              );
            })
          ) : (
            <div className="position-relative w-100 h-100">
              <h5 className="position-absolute top-50 start-50 translate-middle fw-bold text-dark">
                Không có phiếu khám bệnh
              </h5>
            </div>
          )}
        </TableBody>
      </div>
    </>
  );
}
