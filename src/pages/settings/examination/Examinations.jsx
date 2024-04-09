import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import {
  createAppointmentPatientList,
  fetchAllAppointmentListPatients,
} from "../../../services/appointmentListPatients";
import { queryClient } from "../../../App";
import Card from "../../../components/Card";
import TableHeader from "../../../components/TableHeader";
import TableBody from "../../../components/TableBody";
import { convertDate } from "../../../util/date";

function ExaminationsPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [modalState, setModalState] = useState({
    header: "",
    isEditable: true,
  });

  const appointmentListPatientsQuery = useQuery({
    queryKey: ["appointmentList"],
    queryFn: fetchAllAppointmentListPatients,
  });

  const appointmentPatientListMutate = useMutation({
    mutationFn: createAppointmentPatientList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointmentList"] });
    },
  });

  const appointmentListPatients = appointmentListPatientsQuery.data;

  function closeHandler() {
    setShow(() => {
      return false;
    });
  }
  function showHandler() {
    setModalState(() => {
      return { isEditable: true, header: "Đăng ký ca khám" };
    });
    setShow(true);
  }

  function submitHandler(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    const scheduledate = data.scheduledate;
    const patientInfo = {
      fullname: data?.fullname,
      phonenumber: data?.phonenumber,
      gender: data?.gender,
      birthyear: data?.birthyear,
      address: data?.address,
    };
    appointmentPatientListMutate.mutate({ scheduledate, patientInfo });
  }

  function acceptHandler(data) {
    navigate(`${data.id}/prescription`);
  }

  return (
    <Card>
      <Modal show={show} onHide={closeHandler}>
        <Modal.Header closeButton style={{ height: "50px" }}>
          <Modal.Title>{modalState.header}</Modal.Title>
        </Modal.Header>
        <div tabIndex="-1">
          <div className="modal-body">
            <div className="row gap-3">
              <div className="col input-group flex-nowrap">
                <span
                  className="input-group-text"
                  id="addon-wrapping"
                  style={{ backgroundColor: "white" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                  </svg>
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Tên bệnh nhân"
                  aria-label="medicine"
                  aria-describedby="addon-wrapping"
                />
              </div>
              <div className="col input-group flex-nowrap">
                <span
                  className="input-group-text"
                  id="addon-wrapping"
                  style={{ backgroundColor: "white" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                  </svg>
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Số điện thoại"
                  aria-label="medicine"
                  aria-describedby="addon-wrapping"
                />
              </div>
            </div>
            <form onSubmit={submitHandler}>
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
                    disabled={!modalState.isEditable}
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
                    name="fullname"
                    disabled={!modalState.isEditable}
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
                    name="phonenumber"
                    disabled={!modalState.isEditable}
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
                    name="gender"
                    disabled={!modalState.isEditable}
                  ></input>
                </div>
                <div className="col">
                  <label htmlFor="birthyear" className="col-form-label fw-bold">
                    Năm sinh
                  </label>
                  <input
                    className="form-control"
                    id="birthyear"
                    name="birthyear"
                    disabled={!modalState.isEditable}
                  ></input>
                </div>
                <div className="col">
                  <label htmlFor="address" className="col-form-label fw-bold">
                    Địa chỉ
                  </label>
                  <input
                    className="form-control"
                    id="address"
                    name="address"
                    disabled={!modalState.isEditable}
                  ></input>
                </div>
              </div>
              <div className="row">
                <label className="col-form-label fw-bold">
                  THÔNG TIN CA KHÁM
                </label>
              </div>
              <div className="row">
                <div>
                  <label
                    htmlFor="scheduledate"
                    className="col-form-label fw-bold"
                  >
                    Ngày khám
                  </label>
                  <input
                    className="form-control"
                    type="date"
                    name="scheduledate"
                    id="scheduledate"
                  ></input>
                </div>
              </div>
              <div className="row gap-3 mt-3">
                <button
                  type="button"
                  className="col btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={closeHandler}
                >
                  Đóng
                </button>
                {modalState.isEditable && (
                  <button type="submit" className="col btn btn-primary">
                    Tạo ca khám
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </Modal>

      <div className="w-100 h-100 d-flex flex-column gap-3">
        <div className="row w-100  d-flex flex-row justify-content-around">
          <div className="col fw-bold fs-4">
            <label>Danh sách ca khám</label>
          </div>

          <div className="col">
            <button
              className="col btn btn-primary float-end fw-bold"
              onClick={showHandler}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-plus-lg me-2"
                viewBox="0 2 16 16"
              >
                <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
              </svg>
              Đăng ký
            </button>
          </div>
        </div>

        <div className=" w-100 h-100 overflow-hidden d-flex flex-column gap-3">
          <TableHeader>
            <div className="text-start" style={{ width: "20%" }}>
              Họ và tên
            </div>
            <div className="text-start" style={{ width: "15%" }}>
              Năm sinh
            </div>
            <div className="text-start" style={{ width: "15%" }}>
              Số điện thoại
            </div>
            <div className="text-start" style={{ width: "20%" }}>
              Ngày khám
            </div>
            <div className="text-start" style={{ width: "15%" }}>
              Trạng thái
            </div>
            <div className="text-start" style={{ width: "15%" }}>
              Thanh toán
            </div>
          </TableHeader>
          <TableBody>
            {appointmentListPatients &&
              appointmentListPatients.map((appointmentListPatient) => {
                return (
                  <li
                    className=" dropdown-center list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                    key={appointmentListPatient.id}
                  >
                    <div
                      className="text-start"
                      style={{ width: "20%" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {appointmentListPatient.patient.fullName}
                    </div>
                    <div
                      className="text-start"
                      style={{ width: "15%" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {appointmentListPatient.patient.birthYear}
                    </div>
                    <div
                      className="text-start"
                      style={{ width: "15%" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {appointmentListPatient.patient.phoneNumber}
                    </div>
                    <div
                      className="text-start"
                      style={{ width: "20%" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {convertDate(
                        appointmentListPatient.appointmentList.scheduleDate
                      )}
                    </div>
                    <div
                      className="text-start"
                      style={{ width: "15%" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    ></div>
                    <div
                      className="text-start"
                      style={{ width: "15%" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    ></div>

                    <ul className="dropdown-menu">
                      <li className="dropdown-item">
                        <span
                          onClick={() => acceptHandler(appointmentListPatient)}
                        >
                          Tiếp nhận ca khám
                        </span>
                      </li>
                      <li className="dropdown-item">
                        <span>Cập nhật ca khám</span>
                      </li>
                      <li className="dropdown-item">
                        <span>Hủy ca khám</span>
                      </li>
                    </ul>
                  </li>
                );
              })}
          </TableBody>
        </div>
      </div>
    </Card>
  );
}

export default ExaminationsPage;
