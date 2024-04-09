import { NavLink, Outlet, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchAppointentListPatientById } from "../../../services/appointmentListPatients";
import { createAppointmentRecord } from "../../../services/appointmentRecords";
import "./ExaminationDetail.scss";
import Card from "../../../components/Card";
import { convertDate } from "../../../util/date";
import { createAppointmentRecordDetail } from "../../../services/appointmentRecordDetails";
import { useSelector } from "react-redux";

export default function ExaminationDetail() {
  const { appopintmentListPatientId } = useParams();
  const appointmentListPatientQuery = useQuery({
    queryKey: ["appointmentlistpatient", appopintmentListPatientId],
    queryFn: () =>
      fetchAppointentListPatientById({ id: appopintmentListPatientId }),
  });
  const prescriptionState = useSelector((state) => state.prescription);

  const appointmentListPatientData = appointmentListPatientQuery.data;

  const recordDetailMutate = useMutation({
    mutationFn: createAppointmentRecordDetail,
  });

  const appointmentRecordMutate = useMutation({
    mutationFn: createAppointmentRecord,
    onSuccess: (data) => {
      prescriptionState.map((drug) => {
        const appointmentRecordId = data.id;
        const drugId = drug.id;
        const count = drug.amount;
        const usageId = drug.usageId;
        recordDetailMutate.mutate({
          appointmentRecordId,
          drugId,
          count,
          usageId,
        });
      });
    },
  });

  function finishExamHandler(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const appointmentRecordData = Object.fromEntries(formData);
    const symptoms = appointmentRecordData.symptoms;
    const diseaseId = appointmentRecordData.diagnostic;
    const patientId = appointmentListPatientData.patientId;
    const appointmentListId = appointmentListPatientData.appointmentListId;
    appointmentRecordMutate.mutate({
      symptoms,
      diseaseId,
      patientId,
      appointmentListId,
    });
  }

  return (
    <Card>
      <form
        className="w-100 h-100 d-flex flex-row  gap-3"
        onSubmit={finishExamHandler}
      >
        <div style={{ width: "40%" }}>
          <div className="row">
            <label className="col-form-label fw-bold">
              THÔNG TIN BỆNH NHÂN
            </label>
          </div>
          <div className="row gap-3">
            <div className="col">
              <label htmlFor="patientid" className="col-form-label fw-bold">
                Mã bệnh nhân
              </label>
              <input
                type="text"
                className="form-control"
                id="patientid"
                name="patientid"
                defaultValue={
                  appointmentListPatientData &&
                  appointmentListPatientData.patientId
                }
                disabled={true}
              />
            </div>
            <div className="col">
              <label htmlFor="fullname" className="col-form-label fw-bold">
                Tên bệnh nhân
              </label>
              <input
                type="text"
                className="form-control"
                id="fullname"
                defaultValue={
                  appointmentListPatientData &&
                  appointmentListPatientData.patient.fullName
                }
                disabled={true}
              />
            </div>
            <div className="col">
              <label htmlFor="phonenumber" className="col-form-label fw-bold">
                Số điện thoại
              </label>
              <input
                className="form-control"
                id="phonenumber"
                defaultValue={
                  appointmentListPatientData &&
                  appointmentListPatientData.patient.phoneNumber
                }
                disabled={true}
              ></input>
            </div>
          </div>
          <div className="row gap-3">
            <div className="col">
              <label htmlFor="gender" className="col-form-label fw-bold">
                Giới tính
              </label>
              <input
                className="form-control"
                id="gender"
                defaultValue={
                  appointmentListPatientData &&
                  appointmentListPatientData.patient.gender
                }
                disabled={true}
              ></input>
            </div>
            <div className="col">
              <label htmlFor="birthyear" className="col-form-label fw-bold">
                Năm sinh
              </label>
              <input
                className="form-control"
                id="birthyear"
                defaultValue={
                  appointmentListPatientData &&
                  appointmentListPatientData.patient.birthYear
                }
                disabled={true}
              ></input>
            </div>
            <div className="col">
              <label htmlFor="address" className="col-form-label fw-bold">
                Địa chỉ
              </label>
              <input
                className="form-control"
                id="address"
                defaultValue={
                  appointmentListPatientData &&
                  appointmentListPatientData.patient.address
                }
                disabled={true}
              ></input>
            </div>
          </div>
          <div className="row">
            <label className="col-form-label fw-bold">THÔNG TIN CA KHÁM</label>
          </div>
          <div className="row gap-3">
            <div className="col">
              <label htmlFor="appointmentid" className="col-form-label fw-bold">
                Mã ca khám
              </label>
              <input
                className="form-control"
                type="text"
                name="appointmentid"
                id="appointmentid"
                defaultValue={
                  appointmentListPatientData && appointmentListPatientData.id
                }
                disabled={true}
              ></input>
            </div>
            <div className="col">
              <label htmlFor="scheduledate" className="col-form-label fw-bold">
                Ngày khám
              </label>
              <input
                className="form-control"
                type="text"
                id="scheduledate"
                defaultValue={
                  appointmentListPatientData &&
                  convertDate(
                    appointmentListPatientData.appointmentList.scheduleDate
                  )
                }
                disabled={true}
              ></input>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <label htmlFor="symptoms" className="col-form-label fw-bold">
                Triệu chứng
              </label>
              <textarea
                className="form-control"
                type="text"
                name="symptoms"
                id="symptoms"
                rows="3"
              ></textarea>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <label htmlFor="diagnostic" className="col-form-label fw-bold">
                Chuẩn đoán
              </label>
              <input
                className="form-control"
                type="text"
                name="diagnostic"
                id="diagnostic"
              ></input>
            </div>
          </div>
        </div>
        <div
          className="h-100 d-flex flex-column gap-3"
          style={{ width: "60%" }}
        >
          <div
            className="row d-flex flex-row justify-content-between border-bottom appointment-navigation"
            style={{ height: "fit-content" }}
          >
            <nav
              className="col nav gap-3 text-start"
              style={{ width: "fit-content" }}
            >
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "nav-link nav-bar-active  border-bottom border-3 border-primary"
                    : "nav-link nav-bar "
                }
                to="prescription"
              >
                Đơn thuốc
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "nav-link  nav-bar-active  border-bottom border-3 border-primary"
                    : "nav-link nav-bar "
                }
                to="examhistory"
              >
                Lịch sử
              </NavLink>
            </nav>
            <div className="col text-end">
              <button className="btn btn-primary" type="submit">
                Hoàn thành
              </button>
            </div>
          </div>
          <div className="row w-100 h-100 overflow-hidden">
            <Outlet />
          </div>
        </div>
      </form>
    </Card>
  );
}
