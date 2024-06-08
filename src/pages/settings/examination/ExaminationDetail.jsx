import {
  NavLink,
  Outlet,
  useParams,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { useRef, useState } from "react";
import Form from "react-bootstrap/Form";

import "./ExaminationDetail.scss";
import Card from "../../../components/Card";
import MainInput from "../../../components/MainInput";
import MainSelect from "../../../components/MainSelect";
import MainTextarea from "../../../components/MainTextarea";

import { inputDateFormat } from "../../../util/date";
import { prescriptionAction } from "../../../store/prescription";

import { fetchAppointentListPatientById } from "../../../services/appointmentListPatients";
import { createAppointmentRecordDetail } from "../../../services/appointmentRecordDetails";
import { createAppointmentRecord } from "../../../services/appointmentRecords";
import { fetchAllDisease } from "../../../services/diseases";
import NotificationDialog, {
  DialogAction,
} from "../../../components/NotificationDialog";
import useAuth from "../../../hooks/useAuth";

export default function ExaminationDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notiDialogRef = useRef();
  const formRef = useRef();
  const { auth } = useAuth();
  const permission = auth?.permission || [];
  // const [validated, setValidated] = useState(false);
  const { appopintmentListPatientId } = useParams();
  const [dataState, setDataState] = useState({
    data: null,
    isEditable: true,
  });

  const diseasesQuery = useQuery({
    queryKey: ["diseases"],
    queryFn: fetchAllDisease,
  });

  const prescriptionState = useSelector((state) => state.prescription);
  const diseaseState = diseasesQuery.data;

  function getDiseaseName({ id }) {
    const res = diseaseState.filter((disease) => {
      return disease.id == id;
    })[0];
    return res?.diseaseName || "";
  }

  const appointmentListPatientQuery = useQuery({
    queryKey: ["appointmentlistpatient", appopintmentListPatientId],
    queryFn: () =>
      fetchAppointentListPatientById({ id: appopintmentListPatientId }),
  });
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
      notiDialogRef.current.toastSuccess({ message: data.message });
      setTimeout(() => {
        navigate("/examinations");
        dispatch(prescriptionAction.removeAll());
      }, 1050);
    },
    onError: (data) => {
      notiDialogRef.current.toastError({ message: data.message });
    },
  });

  function changeFormHandler(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const examData = Object.fromEntries(formData);
    const symptoms = examData.symptoms.trim();
    setDataState((prevState) => {
      return {
        isEditable: prevState.isEditable,
        data: {
          ...prevState.data,
          symptoms,
        },
      };
    });
  }

  function finishHandler() {
    function finishExamHandler() {
      const form = formRef.current;
      if (form.checkValidity() === false) {
        // setValidated(true);
        return;
      }

      const formData = new FormData(form);
      const examData = Object.fromEntries(formData);
      const symptoms = examData.symptoms.trim();
      const diseaseId = examData.diagnostic;
      const patientId = appointmentListPatientData.patientId;
      const appointmentListId = appointmentListPatientData.appointmentListId;
      appointmentRecordMutate.mutate({
        symptoms,
        diseaseId,
        patientId,
        appointmentListId,
      });
      // setValidated(false);
    }
    notiDialogRef.current.setDialogData({
      action: DialogAction.FINISH,
      dispatchFn: finishExamHandler,
    });

    notiDialogRef.current.showDialogWarning({
      message: "Xác nhận hoàn thành ca khám?",
    });
  }
  const error = useRouteError();
  if (auth.isPending) {
    return <></>;
  }
  if (!auth.isAuth && !permission.includes("CRecord")) {
    throw error;
  }

  function backHandler() {
    navigate("/examinations");
  }

  return (
    <div className="p-3 h-100">
      <Card>
        <div className="position-relative">
          <span
            className="position-absolute back-btn"
            style={{ top: "0.4rem", left: "-1.9rem", padding: "1px" }}
            onClick={backHandler}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              className="bi bi-arrow-left-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
            </svg>
          </span>
        </div>
        <NotificationDialog ref={notiDialogRef} keyQuery={["patientlist"]} />
        <Form
          className="w-100 h-100 d-flex flex-row  gap-3"
          ref={formRef}
          noValidate
          onChange={changeFormHandler}
          // validated={validated}
        >
          <div style={{ width: "40%" }}>
            <div className="row">
              <label className="col-form-label fw-bold text-dark">
                THÔNG TIN BỆNH NHÂN
              </label>
            </div>
            <div
              style={{
                background: "#d8e8ff",
                borderRadius: "8px",
                padding: "0.5rem 1rem 0rem 1rem",
              }}
            >
              <div className="row gap-3">
                <MainInput
                  name={"patientid"}
                  isEditable={false}
                  defaultValue={
                    appointmentListPatientData &&
                    appointmentListPatientData.patientId
                  }
                  label={"Mã bệnh nhân"}
                />
                <MainInput
                  name={"fullname"}
                  isEditable={false}
                  defaultValue={
                    appointmentListPatientData &&
                    appointmentListPatientData.patient.fullName
                  }
                  label={"Họ và tên"}
                />

                <MainInput
                  name={"phonenumber"}
                  isEditable={false}
                  defaultValue={
                    appointmentListPatientData &&
                    appointmentListPatientData.patient.phoneNumber
                  }
                  label={"Số điện thoại"}
                />
              </div>
              <div className="row gap-3">
                <MainInput
                  name={"gender"}
                  isEditable={false}
                  defaultValue={
                    appointmentListPatientData &&
                    appointmentListPatientData.patient.gender
                  }
                  label={"Giới tính"}
                />
                <MainInput
                  name={"birthyear"}
                  isEditable={false}
                  defaultValue={
                    appointmentListPatientData &&
                    appointmentListPatientData.patient.birthYear
                  }
                  label={"Năm sinh"}
                />
                <MainInput
                  name={"address"}
                  isEditable={false}
                  defaultValue={
                    appointmentListPatientData &&
                    appointmentListPatientData.patient.address
                  }
                  label={"Địa chỉ"}
                />
              </div>
            </div>

            <div className="row">
              <label className="col-form-label fw-bold text-dark">
                THÔNG TIN CA KHÁM
              </label>
            </div>
            <div
              className="row gap-3"
              style={{
                background: "#d8e8ff",
                borderRadius: "8px",
                padding: "0.5rem 1rem 0rem 1rem",
              }}
            >
              <MainInput
                name={"appointmentid"}
                isEditable={false}
                defaultValue={
                  appointmentListPatientData && appointmentListPatientData.id
                }
                label={"Mã ca khám"}
              />
              <MainInput
                name="scheduledate"
                defaultValue={
                  appointmentListPatientData &&
                  inputDateFormat(
                    appointmentListPatientData.appointmentList.scheduleDate
                  )
                }
                isEditable={false}
                label={"Ngày khám"}
                type={"date"}
              />
              <div className="col"></div>
            </div>
            <div className="row">
              <MainTextarea
                name="symptoms"
                defaultValue={
                  appointmentListPatientData &&
                  appointmentListPatientData.symptoms
                }
                isEditable={dataState.isEditable}
                label={"Triệu chứng"}
              />
            </div>
            {permission?.includes("RDrug") && (
              <div className="row">
                <MainSelect
                  name={"diagnostic"}
                  defaultValue={
                    appointmentListPatientData &&
                    appointmentListPatientData.diseaseId
                  }
                  isEditable={dataState.isEditable}
                  label={"Chuẩn đoán"}
                  options={
                    diseaseState &&
                    diseaseState.map((disease) => {
                      return (
                        <option key={disease.id} value={disease.id}>
                          {disease.diseaseName}
                        </option>
                      );
                    })
                  }
                  text={
                    appointmentListPatientData &&
                    getDiseaseName({
                      id: appointmentListPatientData.diseaseId,
                    })
                  }
                />
              </div>
            )}
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
                {permission?.includes("RDrug") && (
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
                )}
                {permission?.includes("RRecord") && (
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
                )}
              </nav>
              {permission?.includes("CRecord") && (
                <div className="col text-end">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={finishHandler}
                    disabled={dataState.data?.symptoms ? false : true}
                  >
                    Hoàn thành
                  </button>
                </div>
              )}
            </div>
            <div className="row w-100 h-100 overflow-hidden">
              <Outlet />
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
}
