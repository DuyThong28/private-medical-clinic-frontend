import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import { useDispatch } from "react-redux";

import Card from "../../../components/Card";
import TableHeader from "../../../components/TableHeader";
import TableBody from "../../../components/TableBody";
import ExaminationModal from "./ExaminationModal";

import {
  deleteAppointmentListPatientById,
  fetchAllAppointmentListPatients,
  moveAppointmentListPatientToTheEnd,
} from "../../../services/appointmentListPatients";
import { convertDate, inputToDayFormat } from "../../../util/date";
import { prescriptionAction } from "../../../store/prescription";
import { fetchPatientById } from "../../../services/patients";
import { fetchAllAppointmentListById } from "../../../services/appointmentList";
import { compareDates } from "../../../util/date";
import RescordHistoryModal from "./RecordHistoryModal";
import InvoiceDetail from "../../Invoice/InvoiceDetail";
import NotificationDialog, {
  DialogAction,
} from "../../../components/NotificationDialog";
import useAuth from "../../../hooks/useAuth";
import { queryClient } from "../../../main";

function ExaminationsPage() {
  const navigate = useNavigate();
  const modalRef = useRef();
  const payModalRef = useRef();
  const invoiceRef = useRef();
  const notiDialogRef = useRef();
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const permission = auth?.permission || [];
  const [examState, setExamState] = useState({
    name: "",
    date: inputToDayFormat(),
    state: 1,
  });

  const appointmentListPatientQuery = useQuery({
    queryKey: ["appointmentList"],
    queryFn: async () => {
      const data = await fetchAllAppointmentListPatients();
      const finalData = await Promise.all(
        data.map(async (item) => {
          const patient = await fetchPatientById({ id: item.patientId });
          const appointmentList = await fetchAllAppointmentListById({
            id: item.appointmentListId,
          });

          return {
            ...item,
            patient,
            appointmentList,
          };
        })
      );
      const searchData = finalData.filter(
        (item) =>
          item?.patient.fullName.toLowerCase().includes(examState.name) &&
          compareDates(item?.appointmentList.scheduleDate, examState.date) &&
          checkExamState(examState.state, item?.billId)
      );
      return searchData;
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["appointmentList"] });
  }, [examState]);

  function checkExamState(state, billId) {
    if (state == 1) {
      return !billId;
    } else if (state == 2) {
      return billId;
    } else if (state == 3) {
      return true;
    }
  }

  const appointmentListPatients = appointmentListPatientQuery.data;

  function acceptHandler(data) {
    dispatch(prescriptionAction.removeAll());
    if (permission?.includes("RDrug")) navigate(`${data.id}/prescription`);
    else if (permission?.includes("RRecord"))
      navigate(`${data.id}/examhistory`);
    else navigate(`${data.id}`);
  }

  function payHandler({ id }) {
    invoiceRef.current.show({ id });
  }

  function editAppointmentHandler({ data }) {
    modalRef.current.edit({ data });
  }

  async function deleteAppointmentHandler({ id }) {
    async function deletefunction() {
      return await deleteAppointmentListPatientById({ id });
    }
    notiDialogRef.current.setDialogData({
      action: DialogAction.DELETE,
      dispatchFn: deletefunction,
    });
    notiDialogRef.current.showDialogWarning({
      message: "Xác nhận hủy lịch khám?",
    });
  }

  function setSearchData({ name, date, state }) {
    setExamState(() => {
      return {
        name,
        date,
        state,
      };
    });
  }

  async function moveToTheEndHandler({ id }) {
    async function moveToEnd() {
      return moveAppointmentListPatientToTheEnd({ id });
    }
    notiDialogRef.current.setDialogData({
      action: DialogAction.DELETE,
      dispatchFn: moveToEnd,
    });
    notiDialogRef.current.showDialogWarning({
      message: "Xác nhận chuyển lịch khám xuống cuối?",
    });
  }

  const error = useRouteError();
  if (auth.isPending) {
    return <></>;
  }
  if (!auth.isAuth || (auth.isAuth && !permission.includes("RAppointment"))) {
    throw error;
  }

  return (
    <>
      <RescordHistoryModal ref={payModalRef} />
      <InvoiceDetail ref={invoiceRef} />
      <NotificationDialog ref={notiDialogRef} keyQuery={["appointmentList"]} />
      <div className="h-100 w-100 p-3">
        <Card   className="w-100 h-100  rounded-3 bg-white">
          <div className="w-100 h-100 d-flex flex-column gap-3">
            <ExaminationModal ref={modalRef} setSearchData={setSearchData} />
            <div className=" w-100 h-100 overflow-hidden d-flex flex-column"        style={{ padding: "0rem 1rem 1rem 1rem" }}>
              <TableHeader>
                <div className="text-start" style={{ width: "5%" }}>
                  STT
                </div>
                <div className="text-start" style={{ width: "14%" }}>
                  Mã ca khám
                </div>
                <div className="text-start" style={{ width: "15%" }}>
                  Họ và tên
                </div>
                <div className="text-start" style={{ width: "14%" }}>
                  Năm sinh
                </div>
                <div className="text-start" style={{ width: "15%" }}>
                  Số điện thoại
                </div>
                <div className="text-start" style={{ width: "13%" }}>
                  Ngày khám
                </div>
                <div className="text-start" style={{ width: "11%" }}>
                  Trạng thái
                </div>
                <div className="text-start" style={{ width: "11%" }}>
                  Thanh toán
                </div>
                <div className="text-start" style={{ width: "1%" }}></div>
              </TableHeader>
              <TableBody>
                {appointmentListPatients &&
                appointmentListPatients.length > 0 ? (
                  appointmentListPatients.map((appointmentListPatient) => {
                    return (
                      <li
                        className=" dropdown-center list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                        key={appointmentListPatient.id}
                      >
                        <div className="text-start" style={{ width: "5%" }}>
                          {appointmentListPatient.orderNumber}
                        </div>
                        <div className="text-start" style={{ width: "14.2%" }}>
                          {appointmentListPatient.id}
                        </div>
                        <div className="text-start" style={{ width: "15%" }}>
                          {appointmentListPatient.patient?.fullName}
                        </div>
                        <div className="text-start" style={{ width: "14.2%" }}>
                          {appointmentListPatient.patient?.birthYear}
                        </div>
                        <div className="text-start" style={{ width: "15.1%" }}>
                          {appointmentListPatient.patient?.phoneNumber}
                        </div>
                        <div className="text-start" style={{ width: "13%" }}>
                          {convertDate(
                            appointmentListPatient.appointmentList?.scheduleDate
                          )}
                        </div>
                        <div className="text-start" style={{ width: "11%" }}>
                          <span
                            className={
                              appointmentListPatient.appointmentRecordId
                                ? "badge bg-success"
                                : "badge bg-danger"
                            }
                          >
                            {appointmentListPatient.appointmentRecordId
                              ? "Hoàn thành"
                              : "Chưa khám"}
                          </span>
                        </div>
                        <div className="text-end" style={{ width: "10%" }}>
                          <span
                            className={
                              appointmentListPatient.billId
                                ? "badge bg-success"
                                : "badge bg-danger"
                            }
                          >
                            {appointmentListPatient.billId
                              ? "Đã thanh toán"
                              : "Chưa thanh toán"}
                          </span>
                        </div>

                        <div
                          className="text-end"
                          style={{ width: "2.5%" }}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {!appointmentListPatient.billId && (
                            <span className="action-view-btn">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-three-dots-vertical"
                                viewBox="0 0 16 16"
                              >
                                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                              </svg>
                            </span>
                          )}
                        </div>
                        {!appointmentListPatient.billId && (
                          <ul className="dropdown-menu shadow">
                            {permission?.includes("CRecord") &&
                              !appointmentListPatient.appointmentRecordId && (
                                <li
                                  className="dropdown-item"
                                  onClick={() =>
                                    acceptHandler(appointmentListPatient)
                                  }
                                >
                                  {!appointmentListPatient.appointmentRecordId && (
                                    <span>Tiếp nhận</span>
                                  )}
                                </li>
                              )}

                            {appointmentListPatient.appointmentRecordId &&
                              permission?.includes("CInvoice") && (
                                <li
                                  className="dropdown-item"
                                  onClick={() =>
                                    payHandler({
                                      id: appointmentListPatient.appointmentRecordId,
                                    })
                                  }
                                >
                                  <span>Thanh toán</span>
                                </li>
                              )}
                            {!appointmentListPatient.appointmentRecordId && (
                              <>
                                {permission?.includes("UAppointment") && (
                                  <>
                                    <li
                                      className="dropdown-item"
                                      onClick={() =>
                                        editAppointmentHandler({
                                          data: appointmentListPatient,
                                        })
                                      }
                                    >
                                      <span>Cập nhật</span>
                                    </li>
                                    <li
                                      className="dropdown-item"
                                      onClick={() =>
                                        moveToTheEndHandler({
                                          id: appointmentListPatient.id,
                                        })
                                      }
                                    >
                                      <span>Chuyển xuống cuối</span>
                                    </li>
                                  </>
                                )}
                                {permission?.includes("DAppointment") && (
                                  <li
                                    className="dropdown-item"
                                    onClick={() =>
                                      deleteAppointmentHandler({
                                        id: appointmentListPatient.id,
                                      })
                                    }
                                  >
                                    <span>Hủy</span>
                                  </li>
                                )}
                              </>
                            )}
                          </ul>
                        )}
                      </li>
                    );
                  })
                ) : (
                  <div className="position-relative w-100 h-100">
                    <h5 className="position-absolute top-50 start-50 translate-middle fw-bold text-dark">
                      Không có ca khám
                    </h5>
                  </div>
                )}
              </TableBody>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default ExaminationsPage;
