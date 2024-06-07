import PreScriptionTab from "./PrescriptionTab";
import {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { useQuery } from "@tanstack/react-query";

import {
  convertDate,
  localFormat,
  stringToDayFormat,
} from "../../../util/date";
import { fetchAppointmentRecordById } from "../../../services/appointmentRecords";

import MainInput from "../../../components/MainInput";
import MainTextarea from "../../../components/MainTextarea";
import MainSelect from "../../../components/MainSelect";
import MainModal from "../../../components/MainModal";
import Form from "react-bootstrap/Form";
import { fetchAllDisease } from "../../../services/diseases";
import logo from "../../../assets/logo.svg";
import billtop from "../../../assets/billtop.svg";
import billbottom from "../../../assets/billbottom.svg";
import { useReactToPrint } from "react-to-print";
import "./RecordHistoryModal.scss";

const RescordHistoryModal = forwardRef(function RescordHistoryModal(
  { children },
  ref
) {
  const modalRef = useRef();
  modalRef.current?.isLarge();
  const [dialogState, setDialogState] = useState({
    data: null,
    isEditable: false,
  });

  const [appointmentRecordData, setAppointmentRecordData] = useState(null);

  const [titleSTate, setTitleState] = useState("Phiếu khám bệnh");
  const contentToPrint = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
    documentTitle: titleSTate,

    onBeforePrint: () => {
      console.log("before printing...");
    },
    onAfterPrint: () => {
      console.log("after printing...");
    },
    removeAfterPrint: true,
  });

  useEffect(() => {
    if (appointmentRecordData != null) {
      setTitleState(
        () =>
          `Phiếu khám bệnh-${appointmentRecordData.id}-${
            appointmentRecordData.patient.fullName
          }-${localFormat(appointmentRecordData.appointmentList.scheduleDate)}`
      );
    } else {
      setTitleState(() => "Phiếu khám bệnh");
    }
  }, [appointmentRecordData]);

  const diseasesQuery = useQuery({
    queryKey: ["diseases"],
    queryFn: fetchAllDisease,
  });

  const diseaseState = diseasesQuery.data;
  function getDiseaseName({ id }) {
    const res = diseaseState.filter((disease) => {
      return disease.id == id;
    })[0];
    return res?.diseaseName || "";
  }

  useImperativeHandle(ref, () => {
    return {
      async show({ id }) {
        const resData = await fetchAppointmentRecordById({ id });
        setAppointmentRecordData(() => {
          return { ...resData };
        });
        modalRef.current.show({
          isEditable: true,
          header: "Phiếu khám bệnh",
          action: "view",
        });
      },
    };
  });

  const formBody = (
    <>
      {" "}
      <div className="row  gap-3">
        <div className="col examination-info-container">
          <div className="row gap-3">
            <MainInput
              name={"patientid"}
              isEditable={dialogState.isEditable}
              defaultValue={appointmentRecordData && appointmentRecordData.id}
              label={"Mã bệnh nhân"}
            />
            <MainInput
              name={"fullname"}
              isEditable={dialogState.isEditable}
              defaultValue={
                appointmentRecordData && appointmentRecordData.patient.fullName
              }
              label={"Họ và tên"}
            />

            <MainInput
              name={"phonenumber"}
              isEditable={dialogState.isEditable}
              defaultValue={
                appointmentRecordData &&
                appointmentRecordData.patient.phoneNumber
              }
              label={"Số điện thoại"}
            />
            <MainInput
              name={"gender"}
              isEditable={dialogState.isEditable}
              defaultValue={
                appointmentRecordData && appointmentRecordData.patient.gender
              }
              label={"Giới tính"}
            />
            <MainInput
              name={"birthyear"}
              isEditable={dialogState.isEditable}
              defaultValue={
                appointmentRecordData && appointmentRecordData.patient.birthYear
              }
              label={"Năm sinh"}
            />
            <MainInput
              name={"address"}
              isEditable={dialogState.isEditable}
              defaultValue={
                appointmentRecordData && appointmentRecordData.patient.address
              }
              label={"Địa chỉ"}
            />
          </div>
          <div className="row gap-3 w-100">
            <div className="col w-100">
              <div className="row">
                <MainInput
                  name={"appointmentid"}
                  isEditable={dialogState.isEditable}
                  defaultValue={
                    appointmentRecordData && appointmentRecordData.id
                  }
                  label={"Mã ca khám"}
                />
                <MainInput
                  name="scheduledate"
                  defaultValue={
                    appointmentRecordData &&
                    convertDate(
                      appointmentRecordData.appointmentList.scheduleDate
                    )
                  }
                  isEditable={dialogState.isEditable}
                  label={"Ngày khám"}
                  type={"date"}
                />
                <MainTextarea
                  name="symptoms"
                  defaultValue={
                    appointmentRecordData && appointmentRecordData.symptoms
                  }
                  isEditable={dialogState.isEditable}
                  label={"Triệu chứng"}
                />
              </div>
            </div>
            <div className="col w-100">
              <MainSelect
                name={"diagnostic"}
                defaultValue={
                  appointmentRecordData && appointmentRecordData.diseaseId
                }
                isEditable={dialogState.isEditable}
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
                  appointmentRecordData &&
                  getDiseaseName({
                    id: appointmentRecordData.diseaseId,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row  overflow-hidden h-100">
        <PreScriptionTab
          recordId={appointmentRecordData?.id}
          isEditable={dialogState.isEditable}
        />
      </div>
    </>
  );

  const printContent = (
    <div
      ref={contentToPrint}
      className="d-flex flex-column h-100 bg-white position-relative print-content"
    >
      <img
        src={billtop}
        className="w-100 position-absolute"
        style={{
          zIndex: "0",
          opacity: "0.9",
        }}
      />
      <div
        style={{
          marginBottom: "1rem",
          zIndex: "1",
          padding: "2rem",
          marginTop: "1.5rem",
        }}
      >
        <div className="d-flex flex-row">
          <img src={logo} style={{ width: "4rem", height: "4rem" }} />
          <div
            style={{
              paddingLeft: "0.5rem",
              fontWeight: "600",
            }}
          >
            <p
              style={{
                padding: 0,
                margin: 0,
                color: "#022281",
                fontSize: "1rem",
              }}
            >
              PRIVATE MEDICAL CLINIC
            </p>
            <p
              style={{
                padding: 0,
                margin: 0,
                fontSize: "0.8rem",
                color: "#021d6e",
              }}
            >
              Địa chỉ: Tp.HCM
            </p>
            <p
              style={{
                padding: 0,
                margin: 0,
                fontSize: "0.9rem",
                color: "#021d6e",
              }}
            >
              SDT: 0343855777
            </p>
          </div>
        </div>
        <div className="fw-bold mt-3 fs-4 text-center">
          <label style={{ color: "#022281" }}>PHIẾU KHÁM BỆNH</label>
        </div>
      </div>
      <div style={{ zIndex: "1", paddingLeft: "2rem", paddingRight: "2rem" }}>
        {formBody}
      </div>
      <div
        style={{
          zIndex: "1",
          padding: "2rem",
        }}
      ></div>
      <img
        src={billbottom}
        className="w-100 position-absolute bottom-0 start-0"
        style={{
          zIndex: "0",
          opacity: "0.8",
        }}
      />
    </div>
  );

  return (
    <>
      <div style={{ width: "0px", height: "0px", overflow: "hidden" }}>
        {printContent}
      </div>
      <MainModal ref={modalRef}>
        <div tabIndex="-1" className="h-100">
          <div className="modal-body h-100">
            <Form className="w-100 h-100  gap-3 examination-info">
              {formBody}
              <div className="d-flex gap-3 mt-3 justify-content-center">
                <button
                  type="button"
                  className="btn btn-secondary fw-bold"
                  onClick={handlePrint}
                  style={{ minWidth: "100px" }}
                >
                  In
                </button>
              </div>
            </Form>
          </div>
        </div>
      </MainModal>
    </>
  );
});

export default RescordHistoryModal;
