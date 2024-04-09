import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchAllPatients,
  addPatient,
  fetchPatientById,
  deletePatientById,
} from "../../services/patients";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { queryClient } from "../../App";
import Card from "../../components/Card";
import TableHeader from "../../components/TableHeader";
import TableBody from "../../components/TableBody";

function PatientsPage() {
  const [patientData, setPatientData] = useState(null);
  const [show, setShow] = useState(false);
  const [modalState, setModalState] = useState({
    header: "",
    isEditable: true,
  });

  const patientsQuery = useQuery({
    queryKey: ["patients"],
    queryFn: fetchAllPatients,
  });

  const addPatientMutate = useMutation({
    mutationFn: addPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      setShow(() => {
        setPatientData(() => {
          return null;
        });
        return false;
      });
    },
  });

  const patients = patientsQuery.data;

  function submitHandler(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    if (patientData !== null) {
      data.id = patientData.id;
    }
    addPatientMutate.mutate({ ...data });
  }

  async function editPatientHandler({ id, action }) {
    const data = await fetchPatientById({ id });
    setPatientData(() => {
      return { ...data };
    });
    if (action === "edit") {
      setModalState(() => {
        return { isEditable: true, header: "Chỉnh sửa thông tin" };
      });
    }
    if (action === "view") {
      setModalState(() => {
        return { isEditable: false, header: "Thông tin chi tiết" };
      });
    }
    setShow(true);
  }

  async function deletePatientHandler(id) {
    await deletePatientById({ id });
    queryClient.invalidateQueries({ queryKey: ["patients"] });
  }

  function closeHandler() {
    setShow(() => {
      setPatientData(() => {
        return null;
      });
      return false;
    });
  }
  function showHandler() {
    setModalState(() => {
      return { isEditable: true, header: "Thêm mới" };
    });
    setShow(true);
  }


  return (
    <Card>
      <Modal show={show} onHide={closeHandler}>
        <Modal.Header closeButton style={{ height: "50px" }}>
          <Modal.Title>{modalState.header}</Modal.Title>
        </Modal.Header>
        <div tabIndex="-1">
          <div className="modal-body">
            <form onSubmit={submitHandler}>
              <div className="row gap-3">
                <div className="col">
                  <label htmlFor="fullname" className="col-form-label fw-bold">
                    Tên bệnh nhân
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullname"
                    name="fullname"
                    defaultValue={patientData?.fullName ?? ""}
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
                    defaultValue={patientData?.phoneNumber ?? ""}
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
                    defaultValue={patientData?.gender ?? ""}
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
                    defaultValue={patientData?.birthYear ?? ""}
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
                    defaultValue={patientData?.address ?? ""}
                    disabled={!modalState.isEditable}
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
                    Lưu
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
            <label>Bệnh nhân</label>
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
              Thêm mới
            </button>
          </div>
        </div>

        <div className=" w-100 h-100 overflow-hidden d-flex flex-column gap-3">
          <TableHeader>
            <div className="text-start" style={{ width: "30%" }}>
              Họ và tên
            </div>
            <div className="text-start" style={{ width: "20%" }}>
              Số điện thoại
            </div>
            <div className="text-start" style={{ width: "20%" }}>
              Giới tính
            </div>
            <div className="text-start" style={{ width: "20%" }}>
              Năm sinh
            </div>
            <div className="text-end" style={{ width: "10%" }}>
              Thao tác
            </div>
          </TableHeader>
          <TableBody>
            {patients &&
              patients.map((patient) => {
                return (
                  <li
                    className="list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                    key={patient.id}
                  >
                    <div className="text-start" style={{ width: "30%" }}>
                      {patient.fullName}
                    </div>
                    <div className="text-start" style={{ width: "20%" }}>
                      {" "}
                      {patient.phoneNumber}
                    </div>
                    <div className="text-start" style={{ width: "20%" }}>
                      {patient.gender}
                    </div>
                    <div className="text-start" style={{ width: "20%" }}>
                      {patient.birthYear}
                    </div>
                    <div className="text-end" style={{ width: "10%" }}>
                      <span
                        className="p-2"
                        onClick={() =>
                          editPatientHandler({
                            id: patient.id,
                            action: "view",
                          })
                        }
                      >
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
                      <span
                        className="p-2"
                        onClick={() =>
                          editPatientHandler({
                            id: patient.id,
                            action: "edit",
                          })
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="#1B59F8"
                          className="bi bi-pencil-square"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                      </span>
                      <span
                        className="p-2"
                        onClick={() => deletePatientHandler(patient.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="#1B59F8"
                          className="bi bi-archive-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8z" />
                        </svg>
                      </span>
                    </div>
                  </li>
                );
              })}
          </TableBody>
        </div>
      </div>
    </Card>
  );
}

export default PatientsPage;
