import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { fetchAllBills, deleteBillById } from "../../services/bill";

import { fetchPatientById } from "../../services/patients";

import Card from "../../components/Card";
import TableHeader from "../../components/TableHeader";
import TableBody from "../../components/TableBody";
import InvoiceDetail from "./InvoiceDetail";
import { fetchAllAppointmentListById } from "../../services/appointmentList";
import { convertDate, compareDates, inputToDayFormat } from "../../util/date";
import { formatNumber } from "../../util/money";
import NotificationDialog, {
  DialogAction,
} from "../../components/NotificationDialog";
import useAuth from "../../hooks/useAuth";
import { queryClient } from "../../main";
import { useRouteError } from "react-router";

function PatientsPage() {
  const searchRef = useRef();
  const { auth } = useAuth();
  const permission = auth?.permission || [];
  const notiDialogRef = useRef();
  const dialogRef = useRef();
  const [billState, setBillState] = useState({
    date: inputToDayFormat(),
  });

  const billsQuery = useQuery({
    queryKey: ["bills"],
    queryFn: async () => {
      const data = await fetchAllBills();
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
      const searchData = finalData.filter((item) =>
        compareDates(item?.appointmentList.scheduleDate, billState.date)
      );
      return searchData;
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["bills"] });
  }, [billState]);

  const bills = billsQuery.data;

  function searchHandler() {
    const formData = new FormData(searchRef.current);
    const searchData = Object.fromEntries(formData);
    const date = searchData.date;
    setBillState(() => {
      return { date: date };
    });
  }

  function viewHandler({ bill }) {
    dialogRef.current.showDetail({ bill });
  }

  const error = useRouteError();
  if (auth.isPending) {
    return <></>;
  }
  if (!auth.isAuth || (auth.isAuth && !permission.includes("RInvoice"))) {
    throw error;
  }

  return (
    <>
      <InvoiceDetail ref={dialogRef} />
      <NotificationDialog ref={notiDialogRef} keyQuery={["bills"]} />
      <div className="h-100 w-100 p-3">
        <Card className="w-100 h-100  rounded-3 bg-white">
          <div className="w-100 h-100 d-flex flex-column gap-3">
            <div className=" w-100  d-flex flex-row justify-content-around">
              <div className=" w-100 d-flex flex-row">
                <div className="fw-bold fs-4 title-section">
                  <label>Hóa đơn</label>
                </div>
                <div className="feature-section">
                  <div className="white-section">
                    <div
                      className="d-flex flex-row gap-3 float-end position-absolute top-50"
                      style={{
                        right: "1rem",
                        transform: "translate(0%, -50%)",
                      }}
                    >
                      {" "}
                      <form
                        ref={searchRef}
                        onChange={searchHandler}
                        style={{ width: "fit-content" }}
                      >
                        <input
                          type="date"
                          defaultValue={inputToDayFormat()}
                          name="date"
                          className="form-control"
                          aria-describedby="addon-wrapping"
                        />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className=" w-100 h-100 overflow-hidden d-flex flex-column"
              style={{ padding: "0rem 1rem 1rem 1rem" }}
            >
              <TableHeader>
                <div className="text-start" style={{ width: "5%" }}>
                  STT
                </div>
                <div className="text-start" style={{ width: "24%" }}>
                  Mã hóa đơn
                </div>
                <div className="text-start" style={{ width: "30%" }}>
                  Ngày Thu
                </div>
                <div className="text-start" style={{ width: "30%" }}>
                  Tổng tiền
                </div>

                <div className="text-end" style={{ width: "10%" }}>
                  Thao tác
                </div>
                <div className="text-end" style={{ width: "1%" }}></div>
              </TableHeader>
              <TableBody>
                {bills && bills.length > 0 ? (
                  bills.map((bill, index) => {
                    return (
                      <li
                        className="list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                        key={index}
                      >
                        <div className="text-start" style={{ width: "5%" }}>
                          {index + 1}
                        </div>
                        <div className="text-start" style={{ width: "25%" }}>
                          {bill.id}
                        </div>
                        <div className="text-start" style={{ width: "30%" }}>
                          {convertDate(bill?.appointmentList?.scheduleDate)}
                        </div>
                        <div className="text-start" style={{ width: "30%" }}>
                          {formatNumber(bill.drugExpense + bill.feeConsult)}
                        </div>
                        <div className="text-end" style={{ width: "10%" }}>
                          {permission?.includes("RInvoice") && (
                            <span
                              className="p-2  action-view-btn"
                              onClick={() =>
                                viewHandler({
                                  bill,
                                })
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-eye-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
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
                      Không có hóa đơn
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

export default PatientsPage;
