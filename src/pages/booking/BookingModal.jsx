import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { fetchOnePatient } from "../../services/patients";
import MainDialog from "../../components/MainDialog";
import {
  inputDateFormat,
  inputToDayFormat,
  localFormat,
} from "../../util/date";
import { createAppointmentPatientList } from "../../services/appointmentListPatients";

const BookingModal = forwardRef(function BookingModal(
  { children, setSearchData },
  ref
) {
  const searchRef = useRef();
  const dialogRef = useRef();
  const searchRecordRef = useRef();
  const { auth } = useAuth();
  const permission = auth?.permission || [];
  const [dialogState, setDialogState] = useState({
    data: null,
    isEditable: true,
  });

  const [searchState, setSearchState] = useState({
    name: "",
    phonenumber: "",
    isDisable: false,
  });

  useImperativeHandle(
    ref,
    () => {
      return {
        edit({ data }) {
          const bookingInfo = {
            scheduleDate: data?.bookingAppointment,
            patientId: data?.patientId,
            fullName: data?.fullName,
            phoneNumber: data?.phone,
            address: data?.address,
            birthYear: data?.birthYear,
            gender: data?.gender,
            id: data?.id,
          };
          dialogRef.current.edit({
            action: "edit",
            data: bookingInfo,
          });
        },
        accept({ data }) {
          const bookingInfo = {
            scheduleDate: data?.bookingAppointment,
            patientId: data?.patientId,
            fullName: data?.fullName,
            phoneNumber: data?.phone,
            address: data?.address,
            birthYear: data?.birthYear,
            gender: data?.gender,
            bookingId: data?.id,
          };
          dialogRef.current.accept({
            action: "accept",
            data: bookingInfo,
          });
        },
      };
    },
    []
  );

  async function submitHandler({ data, addMutate }) {
    if (data.id) {
      addMutate.mutate({
        scheduledate: data?.scheduledate,
        patientInfo: {
          ...data,
        },
        appointmentData: {
          id: data.id,
          patientId: data.patientid,
        },
      });
    } else {
      addMutate.mutate({
        scheduledate: data?.scheduledate,
        patientInfo: {
          ...data,
        },
      });
    }
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

    if (resData && resData[0]) {
      dialogRef.current.setCurrentData();
      setDialogState((prevState) => {
        return {
          ...prevState,
          data: {
            ...resData[0],
            patientId: resData[0].id,
            scheduleDate: prevState.data?.scheduleDate,
          },
          isEditable: false,
        };
      });
    } else {
      dialogRef.current.setDialogData();
    }
  }

  function setData({ data, isEditable }) {
    setDialogState((prevState) => {
      return {
        ...prevState,
        data: data,
        isEditable: isEditable,
      };
    });
  }

  function changeSearchInputHandler({ state, event }) {
    setSearchState((prevState) => {
      return {
        ...prevState,
        [state]: event.target.value,
      };
    });
  }

  const searchElement = (
    <>
      {!dialogState.data?.appointmentId && (
        <div className="mt-3">
          <form ref={searchRef} className="row gap-3" onChange={searchHandler}>
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
                disabled={searchState.isDisable}
                value={searchState.name}
                onChange={(event) =>
                  changeSearchInputHandler({ state: "name", event: event })
                }
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
                disabled={searchState.isDisable}
                onChange={(event) =>
                  changeSearchInputHandler({
                    state: "phonenumber",
                    event: event,
                  })
                }
                value={searchState.phonenumber}
              />
            </div>
          </form>
        </div>
      )}
    </>
  );

  async function searchRecordHandler() {
    const formData = new FormData(searchRecordRef.current);
    const searchData = Object.fromEntries(formData);
    const name = searchData.name.trim();
    const date = searchData.date;
    const state = searchData.state;
    setSearchData({ name: name, date: date, state: state });
  }

  function changeFormHandler(event) {
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const resData = {
      patientId: data.patientid,
      address: data.address,
      birthYear: data.birthyear,
      fullName: data.fullname,
      gender: data.gender,
      phoneNumber: data.phonenumber,
      scheduleDate: data.scheduledate,
    };

    setDialogState((prevState) => {
      return {
        ...prevState,
        data: resData,
        isEditable: true,
      };
    });
  }

  function changeHandler() {}

  return (
    <div className=" w-100 d-flex flex-row">
      <div className="fw-bold fs-4 title-section">
        <label>Lịch hẹn</label>
      </div>
      <div className="feature-section">
        <div className="white-section">
          <div
            className="d-flex flex-row gap-3 float-end position-absolute top-50"
            style={{
              right: "0rem",
              transform: "translate(0%, -50%)",
            }}
          >
            <div className="col">
              <form
                ref={searchRecordRef}
                className="row gap-3"
                onChange={searchRecordHandler}
                style={{ width: "fit-content" }}
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
                  <input
                    type="date"
                    name="date"
                    defaultValue={inputToDayFormat()}
                    className="form-control"
                    aria-describedby="addon-wrapping"
                  />
                </div>
                <div className="col input-group flex-nowrap">
                  <select
                    className="form-select"
                    name="state"
                    defaultValue="NotAccepted"
                  >
                    <option value="NotAccepted">Chưa duyệt</option>
                    <option value="Accepted">Đã duyệt</option>
                    <option value="Cancelled">Đã hủy</option>
                    <option value="All">Tất cả</option>
                  </select>
                </div>
              </form>
            </div>
            <div style={{ width: "fit-content" }}>
              <MainDialog
                ref={dialogRef}
                addFn={createAppointmentPatientList}
                onEdit={setData}
                onSubmit={submitHandler}
                onChange={changeFormHandler}
                keyQuery={["appointmentList"]}
                searchElement={searchElement}
                setSearchState={setSearchState}
                addButton={false}
              >
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
                      className="form-control bg-body-secondary"
                      id="patientid"
                      name="patientid"
                      readOnly={true}
                      value={dialogState.data?.patientId ?? ""}
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
                      name="fullname"
                      readOnly={
                        dialogState.data?.patientId || !dialogState.isEditable
                      }
                      value={dialogState.data?.fullName ?? ""}
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
                      type="number"
                      value={dialogState.data?.phoneNumber ?? ""}
                      readOnly={
                        dialogState.data?.patientId || !dialogState.isEditable
                      }
                      required
                    ></input>
                  </div>
                </div>
                <div className="row gap-3">
                  <div className="col">
                    <label htmlFor="gender" className="col-form-label fw-bold">
                      Giới tính
                    </label>
                    {!dialogState.data?.patientId && dialogState.isEditable ? (
                      <select
                        className="form-select"
                        id="gender"
                        name="gender"
                        value={dialogState.data?.gender ?? ""}
                        readOnly={!dialogState.isEditable}
                        required
                      >
                        <option value="Nam" readOnly={!dialogState.isEditable}>
                          Nam
                        </option>
                        <option value="Nữ" readOnly={!dialogState.isEditable}>
                          Nữ
                        </option>
                      </select>
                    ) : (
                      <input
                        className="form-control"
                        id="gender"
                        name="gender"
                        value={dialogState.data?.gender ?? ""}
                        readOnly={!dialogState.isEditable}
                      />
                    )}
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
                      name="birthyear"
                      type="number"
                      value={dialogState.data?.birthYear ?? ""}
                      readOnly={
                        dialogState.data?.patientId || !dialogState.isEditable
                      }
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
                      value={dialogState.data?.address ?? ""}
                      readOnly={
                        dialogState.data?.patientId || !dialogState.isEditable
                      }
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
                      min={inputToDayFormat()}
                      value={
                        dialogState.data && dialogState.data?.scheduleDate
                          ? inputDateFormat(dialogState.data?.scheduleDate)
                          : inputToDayFormat()
                      }
                      onChange={changeHandler}
                      required
                    ></input>
                  </div>
                </div>
              </MainDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default BookingModal;
