import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  convertDate,
  convertDateToLocalTime,
  inputToDayFormat,
} from "../../util/date";
import useAuth from "../../hooks/useAuth";

import { queryClient } from "../../main";

import NotificationDialog, {
  DialogAction,
} from "../../components/NotificationDialog";
import RescordHistoryModal from "../settings/examination/RecordHistoryModal";
import InvoiceDetail from "../Invoice/InvoiceDetail";
import Card from "../../components/Card";
import TableHeader from "../../components/TableHeader";
import TableBody from "../../components/TableBody";
import BookingModal from "./BookingModal";
import {
  deleteBookingAppointmentById,
  fetchDataFromGoogleSheets,
  getAllBookingAppointmentList,
  getBookingAppointmentListByDate,
} from "../../services/booking";
import { useLocation, useRouteError } from "react-router";

function BookingPage() {
  const modalRef = useRef();
  const payModalRef = useRef();
  const invoiceRef = useRef();
  const notiDialogRef = useRef();
  const { auth } = useAuth();
  const permission = auth?.permission || [];
  const [examState, setExamState] = useState({
    name: "",
    date: inputToDayFormat(),
    state: "NotAccepted",
  });

  const location = useLocation();
  const [intervalId, setIntervalId] = useState(null);

  async function fetchData() {
    await fetchDataFromGoogleSheets();
    queryClient.invalidateQueries({ queryKey: ["booking"] });
  }

  const myFunction = () => {
    fetchData();
  };

  useEffect(() => {
    if (location.pathname == "/booking") {
      const newIntervalId = setInterval(myFunction, 1000);
      setIntervalId(newIntervalId);
      console.log("start interval");
      return () => {
        clearInterval(newIntervalId);
        console.log("clear interval");
      };
    }
    console.log(location.pathname);
  }, [location]);

  const bookingQuery = useQuery({
    queryKey: ["booking"],
    queryFn: async () => {
      let bookingDateDate = [];
      if (examState.date.trim() != "") {
        bookingDateDate = await getBookingAppointmentListByDate({
          bookingDate: examState.date,
        });
      } else {
        bookingDateDate = await getAllBookingAppointmentList();
      }
      const searchData = bookingDateDate.filter(
        (item) =>
          item?.fullName.toLowerCase().includes(examState.name) &&
          checkExamState(examState.state, item?.status)
      );
      return searchData;
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["booking"] });
  }, [examState]);

  function checkExamState(state, status) {
    if (state === "NotAccepted") {
      return status == null;
    } else if (state === "Accepted") {
      return status === "Accepted";
    } else if (state === "Cancelled") {
      return status === "Cancelled";
    } else if (state === "All") {
      return true;
    }
  }

  const bookingLists = bookingQuery.data;

  function acceptBookingAppointment({ data }) {
    modalRef.current.accept({ data });
  }

  async function deleteAppointmentHandler({ id }) {
    async function deletefunction() {
      return deleteBookingAppointmentById({ id });
    }
    notiDialogRef.current.setDialogData({
      action: DialogAction.DELETE,
      dispatchFn: deletefunction,
    });
    notiDialogRef.current.showDialogWarning({
      message: "Xác nhận hủy lịch hẹn?",
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

  const error = useRouteError();
  if (auth.isPending) {
    return <></>;
  }
  if (
    !auth.isAuth ||
    (auth.isAuth && !permission.includes("RBookingAppointment"))
  ) {
    throw error;
  }

  return (
    <>
      <RescordHistoryModal ref={payModalRef} />
      <InvoiceDetail ref={invoiceRef} />
      <NotificationDialog ref={notiDialogRef} keyQuery={["booking"]} />
      <div className="h-100 w-100 p-3">
        <Card>
          <div className="w-100 h-100 d-flex flex-column gap-3">
            <BookingModal ref={modalRef} setSearchData={setSearchData} />
            <div className=" w-100 h-100 overflow-hidden d-flex flex-column">
              <TableHeader>
                <div className="text-start" style={{ width: "5%" }}>
                  STT
                </div>
                <div className="text-start" style={{ width: "14%" }}>
                  Họ và tên
                </div>
                <div className="text-start" style={{ width: "8%" }}>
                  Giới tính
                </div>
                <div className="text-start" style={{ width: "8%" }}>
                  Năm sinh
                </div>
                <div className="text-start" style={{ width: "16%" }}>
                  Địa chỉ
                </div>
                <div className="text-start" style={{ width: "11%" }}>
                  Số điện thoại
                </div>
                <div className="text-start" style={{ width: "16%" }}>
                  Thời gian đặt
                </div>
                <div className="text-start" style={{ width: "10%" }}>
                  Lịch hẹn
                </div>
                <div className="text-start" style={{ width: "11%" }}>
                  Trạng thái
                </div>
                <div className="text-start" style={{ width: "1%" }}></div>
              </TableHeader>
              <TableBody>
                {bookingLists && bookingLists.length > 0 ? (
                  bookingLists.map((booking, index) => {
                    return (
                      <li
                        className=" list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                        key={booking.id}
                      >
                        <div className="text-start" style={{ width: "5%" }}>
                          {index + 1}
                        </div>
                        <div className="text-start" style={{ width: "14.5%" }}>
                          {booking?.fullName || ""}
                        </div>
                        <div className="text-start" style={{ width: "8%" }}>
                          {booking?.gender || ""}
                        </div>
                        <div className="text-start" style={{ width: "8%" }}>
                          {booking?.birthYear || ""}
                        </div>
                        <div className="text-start" style={{ width: "16%" }}>
                          <p
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              marginBottom: "0rem",
                              marginRight: "5px",
                            }}
                          >
                            {booking?.address || ""}
                          </p>
                        </div>
                        <div className="text-start" style={{ width: "11%" }}>
                          {booking?.phone || ""}
                        </div>
                        <div className="text-start" style={{ width: "16%" }}>
                          {convertDateToLocalTime(booking?.bookingDate) || ""}
                        </div>
                        <div className="text-start" style={{ width: "10%" }}>
                          {convertDate(booking?.bookingAppointment) || ""}
                        </div>
                        <div className="text-start" style={{ width: "9%" }}>
                          {booking.status == null && (
                            <span
                              className={"badge bg-danger"}
                              style={{ width: "6.1rem" }}
                            >
                              Chưa duyệt
                            </span>
                          )}
                          {booking.status == "Accepted" && (
                            <span
                              className={"badge bg-success"}
                              style={{ width: "6.1rem" }}
                            >
                              Đã duyệt
                            </span>
                          )}
                          {booking.status == "Cancelled" && (
                            <span
                              className={"badge bg-warning"}
                              style={{ width: "6.1rem" }}
                            >
                              Đã hủy
                            </span>
                          )}
                        </div>
                        {booking?.status == null &&
                          permission?.includes("ABookingAppointment") && (
                            <div
                              className="text-end"
                              style={{ width: "2.5%" }}
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
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
                            </div>
                          )}

                        <ul className="dropdown-menu shadow">
                          <li
                            className="dropdown-item"
                            onClick={() =>
                              acceptBookingAppointment({
                                data: booking,
                              })
                            }
                          >
                            <span>Duyệt</span>
                          </li>
                          <li
                            className="dropdown-item"
                            onClick={() =>
                              deleteAppointmentHandler({
                                id: booking.id,
                              })
                            }
                          >
                            <span>Hủy</span>
                          </li>
                        </ul>
                      </li>
                    );
                  })
                ) : (
                  <div className="position-relative w-100 h-100">
                    <h5 className="position-absolute top-50 start-50 translate-middle fw-bold text-dark">
                      Không có lịch hẹn
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

export default BookingPage;
