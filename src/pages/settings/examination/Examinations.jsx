import { useQuery, useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createAppointmentPatientList,
  deleteAppointmentListPatientById,
  fetchAllAppointmentListPatients,
} from "../../../services/appointmentListPatients";
import { queryClient } from "../../../App";
import Card from "../../../components/Card";
import TableHeader from "../../../components/TableHeader";
import TableBody from "../../../components/TableBody";
import { convertDate, inputDateFormat } from "../../../util/date";
import { fetchOnePatient } from "../../../services/patients";
import MainModal from "../../../components/MainModal";
import Form from "react-bootstrap/Form";

function ExaminationsPage() {
  const navigate = useNavigate();
  const searchRef = useRef();
  const modalRef = useRef();
  const [patientData, setPatientData] = useState(null);
  const [validated, setValidated] = useState(false);

  const appointmentListPatientsQuery = useQuery({
    queryKey: ["appointmentList"],
    queryFn: fetchAllAppointmentListPatients,
  });

  const appointmentPatientListMutate = useMutation({
    mutationFn: createAppointmentPatientList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointmentList"] });
      modalRef.current.close();
    },
  });

  const appointmentListPatients = appointmentListPatientsQuery.data;

  function showHandler() {
    setValidated(false);
    setPatientData(() => null);
    modalRef.current.show({ isEditable: true, header: "Đăng ký ca khám" });
  }

  function closeHandler() {
    modalRef.current.close();
  }

  async function submitHandler(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const scheduledate = data?.scheduledate;

    if (patientData.appointmentId) {
      appointmentPatientListMutate.mutate({
        scheduledate,
        appointmentData: {
          id: patientData?.appointmentId,
          patientId: patientData?.id,
        },
      });
    } else {
      const patientInfo = {
        fullname: data?.fullname,
        phonenumber: data?.phonenumber,
        gender: data?.gender,
        birthyear: data?.birthyear,
        address: data?.address,
      };
      appointmentPatientListMutate.mutate({ scheduledate, patientInfo });
    }
    setValidated(false);
  }

  async function searchHandler() {
    const formData = new FormData(searchRef.current);
    const searchData = Object.fromEntries(formData);
    const name = searchData.name;
    const phoneNumber = searchData.phonenumber;
    const resData = await fetchOnePatient({
      name: name,
      phoneNumber: phoneNumber,
    });
    setPatientData(() => (resData && resData[0]) || null);
  }

  function acceptHandler(data) {
    navigate(`${data.id}/prescription`);
  }

  function editAppointmentHandler({ data }) {
    setPatientData(() => {
      const patient = data?.patient;
      const currentData = { ...patient };
      currentData.scheduleDate = data.appointmentList.scheduleDate;
      currentData.appointmentId = data.id;
      return {
        ...currentData,
      };
    });
    modalRef.current.show({ isEditable: false, header: "Chỉnh sửa thông tin" });
  }

  async function deleteAppointmentHandler({ id }) {
    await deleteAppointmentListPatientById({ id });
    queryClient.invalidateQueries({ queryKey: ["appointmentList"] });
  }

  return (
    <Card>
      <MainModal ref={modalRef}>
        <div tabIndex="-1">
          <div className="modal-body">
            {!patientData?.appointmentId && (
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
                </form>
              </div>
            )}

            <Form
              className="needs-validation"
              onSubmit={submitHandler}
              noValidate
              validated={validated}
            >
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
                    disabled={true}
                    defaultValue={patientData?.id ?? ""}
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
                    disabled={patientData || !modalRef.current?.isEditable()}
                    defaultValue={patientData?.fullName ?? ""}
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
                    type="tel"
                    defaultValue={patientData?.phoneNumber ?? ""}
                    disabled={patientData || !modalRef.current?.isEditable()}
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
                    disabled={patientData || !modalRef.current?.isEditable()}
                    value={patientData?.gender}
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
                    type="number"
                    defaultValue={patientData?.birthYear ?? ""}
                    disabled={patientData || !modalRef.current?.isEditable()}
                    required
                    min="0"
                    max={new Date().getFullYear()}
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
                    disabled={patientData || !modalRef.current?.isEditable()}
                    required
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
                    defaultValue={
                      inputDateFormat(patientData?.scheduleDate) ?? ""
                    }
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
                <button type="submit" className="col btn btn-primary">
                  Lưu
                </button>
              </div>
            </Form>
          </div>
        </div>
      </MainModal>

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
            <div className="text-start" style={{ width: "5%" }}>
              STT
            </div>
            <div className="text-start" style={{ width: "14%" }}>
              Mã ca khám
            </div>
            <div className="text-start" style={{ width: "15%" }}>
              Họ và tên
            </div>
            <div className="text-start" style={{ width: "15%" }}>
              Năm sinh
            </div>
            <div className="text-start" style={{ width: "15%" }}>
              Số điện thoại
            </div>
            <div className="text-start" style={{ width: "15%" }}>
              Ngày khám
            </div>
            <div className="text-start" style={{ width: "10%" }}>
              Trạng thái
            </div>
            <div className="text-end" style={{ width: "10%" }}>
              Thanh toán
            </div>
            <div className="text-start" style={{ width: "1%" }}></div>
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
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ width: "5%" }}
                    >
                      {appointmentListPatients.indexOf(appointmentListPatient) +
                        1}
                    </div>
                    <div
                      className="text-start"
                      style={{ width: "15%" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {appointmentListPatient.id}
                    </div>
                    <div
                      className="text-start"
                      style={{ width: "15%" }}
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
                      style={{ width: "15%" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {convertDate(
                        appointmentListPatient.appointmentList.scheduleDate
                      )}
                    </div>
                    <div
                      className="text-start"
                      style={{ width: "10%" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    ></div>
                    <div
                      className="text-start"
                      style={{ width: "10%" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    ></div>

                    <ul className="dropdown-menu">
                      <li className="dropdown-item">
                        <span
                          onClick={() => acceptHandler(appointmentListPatient)}
                        >
                          Tiếp nhận
                        </span>
                      </li>
                      <li className="dropdown-item">
                        <span
                        >
                          Thanh toán
                        </span>
                      </li>
                      <li className="dropdown-item">
                        <span
                          onClick={() =>
                            editAppointmentHandler({
                              data: appointmentListPatient,
                            })
                          }
                        >
                          Cập nhật
                        </span>
                      </li>
                      <li className="dropdown-item">
                        <span
                          onClick={() =>
                            deleteAppointmentHandler({
                              id: appointmentListPatient.id,
                            })
                          }
                        >
                          Hủy
                        </span>
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
