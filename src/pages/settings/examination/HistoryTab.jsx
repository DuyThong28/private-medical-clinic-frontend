import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";

import TableBody from "../../../components/TableBody";
import TableHeader from "../../../components/TableHeader";
import MainModal from "../../../components/MainModal";
import Form from "react-bootstrap/Form";
import PreScriptionTab from "./PrescriptionTab";

import {
  fetchAppointmentRecordById,
  fetchAppointmentRecordByPatientId,
} from "../../../services/appointmentRecords";
import { queryClient } from "../../../App";
import { convertDate } from "../../../util/date";

export default function HistoryTab() {
  const { appopintmentListPatientId } = useParams();
  const [appointmentRecordData, setAppointmentRecordData] = useState(null);
  const patientData = queryClient.getQueryData([
    "appointmentlistpatient",
    appopintmentListPatientId,
  ]);

  const patientId = patientData?.patientId;

  const appointmentRecordsQuery = useQuery({
    queryKey: ["appointmentrecords", patientId],
    queryFn: () => fetchAppointmentRecordByPatientId({ patientId }),
  });

  const recordHistory = appointmentRecordsQuery.data;

  const diseaseState = useSelector((state) => state.disease);

  function getDiseaseName({ id }) {
    const res = diseaseState.filter((disease) => disease.id == id);
    return res[0]?.diseaseName ?? "";
  }

  const modalRef = useRef();
  modalRef.current?.isLarge();

  async function showRecordHandler({ id }) {
    const resData = await fetchAppointmentRecordById({ id });
    setAppointmentRecordData(() => {
      return { ...resData };
    });
    modalRef.current.show({ isEditable: true, header: "Lịch sử khám" });
  }

  return (
    <div>
      <MainModal ref={modalRef}>
        <div tabIndex="-1">
          <div className="modal-body">
            <Form className="w-100 h-100 d-flex flex-row  gap-3">
              <div style={{ width: "40%" }}>
                <div className="row">
                  <label className="col-form-label fw-bold">
                    THÔNG TIN BỆNH NHÂN
                  </label>
                </div>
                <div className="row gap-3">
                  <div className="col">
                    <label
                      htmlFor="patientid"
                      className="col-form-label fw-bold"
                    >
                      Mã bệnh nhân
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="patientid"
                      name="patientid"
                      defaultValue={
                        appointmentRecordData && appointmentRecordData.patientId
                      }
                      disabled={true}
                    />
                  </div>
                  <div className="col">
                    <label
                      htmlFor="fullname"
                      className="col-form-label fw-bold"
                    >
                      Tên bệnh nhân
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullname"
                      defaultValue={
                        appointmentRecordData &&
                        appointmentRecordData.patient.fullName
                      }
                      disabled={true}
                    />
                  </div>
                  <div className="col">
                    <label
                      htmlFor="phonenumber"
                      className="col-form-label fw-bold"
                    >
                      Số điện thoại
                    </label>
                    <input
                      className="form-control"
                      id="phonenumber"
                      defaultValue={
                        appointmentRecordData &&
                        appointmentRecordData.patient.phoneNumber
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
                        appointmentRecordData &&
                        appointmentRecordData.patient.gender
                      }
                      disabled={true}
                    ></input>
                  </div>
                  <div className="col">
                    <label
                      htmlFor="birthyear"
                      className="col-form-label fw-bold"
                    >
                      Năm sinh
                    </label>
                    <input
                      className="form-control"
                      id="birthyear"
                      defaultValue={
                        appointmentRecordData &&
                        appointmentRecordData.patient.birthYear
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
                        appointmentRecordData &&
                        appointmentRecordData.patient.address
                      }
                      disabled={true}
                    ></input>
                  </div>
                </div>
                <div className="row">
                  <label className="col-form-label fw-bold">
                    THÔNG TIN CA KHÁM
                  </label>
                </div>
                <div className="row gap-3">
                  <div className="col">
                    <label
                      htmlFor="appointmentid"
                      className="col-form-label fw-bold"
                    >
                      Mã ca khám
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      name="appointmentid"
                      id="appointmentid"
                      defaultValue={
                        appointmentRecordData && appointmentRecordData.id
                      }
                      disabled={true}
                    ></input>
                  </div>
                  <div className="col">
                    <label
                      htmlFor="scheduledate"
                      className="col-form-label fw-bold"
                    >
                      Ngày khám
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id="scheduledate"
                      defaultValue={
                        appointmentRecordData &&
                        convertDate(
                          appointmentRecordData.appointmentList.scheduleDate
                        )
                      }
                      disabled={true}
                    ></input>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label
                      htmlFor="symptoms"
                      className="col-form-label fw-bold"
                    >
                      Triệu chứng
                    </label>
                    <textarea
                      className="form-control"
                      type="text"
                      name="symptoms"
                      id="symptoms"
                      rows="3"
                      required
                      defaultValue={
                        appointmentRecordData && appointmentRecordData.symptoms
                      }
                      disabled={true}
                    ></textarea>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label
                      htmlFor="diagnostic"
                      className="col-form-label fw-bold"
                    >
                      Chuẩn đoán
                    </label>
                    <select
                      className="form-select"
                      name="diagnostic"
                      id="diagnostic"
                      required
                      disabled={true}
                      defaultValue={
                        appointmentRecordData && appointmentRecordData.diseaseId
                      }
                    >
                      {diseaseState &&
                        diseaseState.map((disease) => {
                          return (
                            <option key={disease.id} value={disease.id}>
                              {disease.diseaseName}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
              </div>

              <div
                className="h-100 d-flex flex-column gap-3"
                style={{ width: "60%" }}
              >
                <PreScriptionTab recordId={appointmentRecordData?.id} />
              </div>
            </Form>
          </div>
        </div>
      </MainModal>

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
          {recordHistory &&
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
                    <span onClick={() => showRecordHandler({ id: record.id })}>
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
    </div>
  );
}
