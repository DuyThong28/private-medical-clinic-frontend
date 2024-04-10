import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchAllPatients,
  addPatient,
  fetchPatientById,
  deletePatientById,
} from "../../services/patients";
import { useRef, useState } from "react";
import Card from "../../components/Card";
import TableHeader from "../../components/TableHeader";
import TableBody from "../../components/TableBody";
import MainModal from "../../components/MainModal";
import Form from "react-bootstrap/Form";

function PatientsPage() {
  const modalRef = useRef();
  const searchRef = useRef();
  const [patientData, setPatientData] = useState(null);
  const [validated, setValidated] = useState(false);

  const patientsQuery = useQuery({
    queryKey: ["patientlist"],
    queryFn: () => {
      const formData = new FormData(searchRef.current);
      const searchData = Object.fromEntries(formData);
      const name = searchData.name;
      const phoneNumber = searchData.phonenumber;
      return fetchAllPatients({ name: name, phoneNumber: phoneNumber });
    },
  });

  const addPatientMutate = useMutation({
    mutationFn: addPatient,
    onSuccess: () => {
      modalRef.current.close();
      setPatientData(() => {
        return null;
      });
      patientsQuery.refetch();
    },
  });

  const patients = patientsQuery.data;

  function closeHandler() {
    setPatientData(() => {
      return null;
    });
    modalRef.current.close();
  }

  function showHandler() {
    setValidated(false);
    setPatientData(() => null);
    modalRef.current.show({ isEditable: true, header: "Thêm mới" });
  }

  function searchHandler() {
    patientsQuery.refetch();
  }

  function submitHandler(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    if (patientData !== null) {
      data.id = patientData.id;
    }
    addPatientMutate.mutate({ ...data });
    setValidated(false);
  }

  async function editPatientHandler({ id, action }) {
    const data = await fetchPatientById({ id });
    setPatientData(() => {
      return { ...data };
    });
    if (action === "edit") {
      modalRef.current.show({
        isEditable: true,
        header: "Chỉnh sửa thông tin",
      });
    }
    if (action === "view") {
      modalRef.current.show({
        isEditable: false,
        header: "Thông tin chi tiết",
      });
    }
  }

  async function deletePatientHandler(id) {
    await deletePatientById({ id });
    patientsQuery.refetch();
  }

  return (
    <Card>
      <MainModal ref={modalRef}>
        <div tabIndex="-1">
          <div className="modal-body">
            <Form onSubmit={submitHandler} noValidate validated={validated}>
              <div className="row gap-3">
                {patientData && (
                  <div className="col">
                    <label
                      htmlFor="fullname"
                      className="col-form-label fw-bold"
                    >
                      Mã bệnh nhân
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="patientId"
                      name="patientId"
                      defaultValue={patientData?.id ?? ""}
                      disabled={true}
                    />
                  </div>
                )}
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
                    disabled={!modalRef.current?.isEditable() || false}
                    required
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
                    disabled={!modalRef.current?.isEditable() || false}
                    required
                  ></input>
                </div>
              </div>
              <div className="row gap-3">
                <div className="col">
                  <label htmlFor="gender" className="col-form-label fw-bold">
                    Giới tính
                  </label>
                  <select
                    className="form-select"
                    id="gender"
                    name="gender"
                    defaultValue={patientData?.gender ?? ""}
                    disabled={!modalRef.current?.isEditable() || false}
                    required
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
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
                    disabled={!modalRef.current?.isEditable() || false}
                    required
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
                    disabled={!modalRef.current?.isEditable() || false}
                    required
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
                {modalRef.current?.isEditable() && (
                  <button type="submit" className="col btn btn-primary">
                    Lưu
                  </button>
                )}
              </div>
            </Form>
          </div>
        </div>
      </MainModal>

      <div className="w-100 h-100 d-flex flex-column gap-3">
        <div className="row w-100  d-flex flex-row justify-content-around">
          <div className="col fw-bold fs-4">
            <label>Bệnh nhân</label>
          </div>
          <div className="col">
            <div className="row">
              <form
                ref={searchRef}
                className="row gap-3"
                onChange={searchHandler}
              >
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
                    name="name"
                    type="search"
                    className="form-control"
                    placeholder="Tên bệnh nhân"
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
                    name="phonenumber"
                    className="form-control"
                    placeholder="Số điện thoại"
                    aria-label="medicine"
                    aria-describedby="addon-wrapping"
                  />
                </div>
                <div style={{ width: "fit-content" }}>
                  <button
                    type="button"
                    className=" btn btn-primary float-end fw-bold"
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
              </form>
            </div>
          </div>
        </div>

        <div className=" w-100 h-100 overflow-hidden d-flex flex-column gap-3">
          <TableHeader>
            <div className="text-start" style={{ width: "5%" }}>
              STT
            </div>
            <div className="text-start" style={{ width: "14%" }}>
              Mã bệnh nhân
            </div>
            <div className="text-start" style={{ width: "15%" }}>
              Họ và tên
            </div>
            <div className="text-start" style={{ width: "15%" }}>
              Số điện thoại
            </div>
            <div className="text-start" style={{ width: "10%" }}>
              Giới tính
            </div>
            <div className="text-start" style={{ width: "15%" }}>
              Năm sinh
            </div>
            <div className="text-start" style={{ width: "15%" }}>
              Địa chỉ
            </div>
            <div className="text-center" style={{ width: "10%" }}>
              Thao tác
            </div>
            <div className="text-end" style={{ width: "1%" }}></div>
          </TableHeader>
          <TableBody>
            {patients &&
              patients.map((patient) => {
                return (
                  <li
                    className="list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                    key={patient.id}
                  >
                    <div className="text-start" style={{ width: "5%" }}>
                      {patients.indexOf(patient) + 1}
                    </div>
                    <div className="text-start" style={{ width: "15%" }}>
                      {patient.id}
                    </div>
                    <div className="text-start" style={{ width: "15%" }}>
                      {patient.fullName}
                    </div>
                    <div className="text-start" style={{ width: "15%" }}>
                      {" "}
                      {patient.phoneNumber}
                    </div>
                    <div className="text-start" style={{ width: "10%" }}>
                      {patient.gender}
                    </div>
                    <div className="text-start" style={{ width: "15%" }}>
                      {patient.birthYear}
                    </div>
                    <div className="text-start" style={{ width: "15%" }}>
                      {patient.address}
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
