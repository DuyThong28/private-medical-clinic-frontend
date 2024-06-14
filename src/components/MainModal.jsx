import {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import { useMutation } from "@tanstack/react-query";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import NotificationDialog from "./NotificationDialog";
import "./MainModal.scss";
import { sendUserInfo, sendUserInfoByUserId } from "../services/users";
import { queryClient } from "../main";
import { fetchOnePatient } from "../services/patients";
import { createBookingAppointment } from "../services/booking";

const icons = {
  add: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="35"
      height="35"
      fill="#008A2E"
      className="bi bi-shield-fill-plus"
      viewBox="0 0 16 16"
    >
      <path d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m-.5 5a.5.5 0 0 1 1 0v1.5H10a.5.5 0 0 1 0 1H8.5V9a.5.5 0 0 1-1 0V7.5H6a.5.5 0 0 1 0-1h1.5z" />
    </svg>
  ),
  view: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="35"
      height="35"
      fill="#343434"
      className="bi bi-prescription2"
      viewBox="0 0 16 16"
    >
      <path d="M7 6h2v2h2v2H9v2H7v-2H5V8h2z" />
      <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v10.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 14.5V4a1 1 0 0 1-1-1zm2 3v10.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V4zM3 3h10V1H3z" />
    </svg>
  ),
  edit: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="35"
      height="35"
      fill="#0973DC"
      className="bi bi-pencil-fill"
      viewBox="0 0 16 16"
    >
      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
    </svg>
  ),
  accept: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="35"
      height="35"
      fill="#008A2E"
      className="bi bi-shield-fill-plus"
      viewBox="0 0 16 16"
    >
      <path d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m-.5 5a.5.5 0 0 1 1 0v1.5H10a.5.5 0 0 1 0 1H8.5V9a.5.5 0 0 1-1 0V7.5H6a.5.5 0 0 1 0-1h1.5z" />
    </svg>
  ),
};

const MainModal = forwardRef(function MainModal(
  {
    children,
    addFn,
    keyQuery,
    onSubmit,
    searchElement,
    onChange,
    isPasswordChanged,
    setIsSubmitable,
    onEdit,
    setSearchState,
  },
  ref
) {
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const formRef = useRef();
  const notiDialogRef = useRef();
  const modalState = useRef({
    header: "",
    isEditable: true,
    size: "",
    id: null,
    action: null,
    bookingId: null,
  });

  const existingPatientState = useRef({
    existingData: null,
    isUsingExistingData: false,
    currentData: null,
  });

  const updateBookingMutate = useMutation({
    mutationFn: createBookingAppointment,
    onSuccess: () => {
      console.log("accept success");
      queryClient.invalidateQueries({ queryKey: ["booking"] });
    },
  });

  const addMutate = useMutation({
    mutationFn: addFn,
    onSuccess: (data) => {
      if (modalState.current.bookingId != null) {
        updateBookingMutate.mutate({
          id: modalState.current.bookingId,
          bookingAppointment: data.bookingAppointment,
        });
      }
      queryClient.invalidateQueries({ queryKey: [...keyQuery] });
      modalState.current.isEditable = false;
      setShow(() => {
        return false;
      });
      notiDialogRef.current.toastSuccess({ message: data.message });
      modalState.current.id = null;
      modalState.current.bookingId = null;
      if (data.sendUserInfo && data.sendUserInfo === true) {
        sendUserInfo(data);
      }
      if (data.sendUserInfoByUserId && data.sendUserInfoByUserId === true) {
        sendUserInfoByUserId(data);
      }
    },
    onError: (data) => {
      notiDialogRef.current.toastError({ message: data.message });
    },
  });

  function changeFormHandler() {
    const form = formRef.current;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const retypepassword = data.retypepassword.trim();
    const newpassword = data.newpassword.trim();
    if (
      retypepassword !== "" &&
      newpassword !== "" &&
      retypepassword === newpassword
    ) {
      setIsSubmitable(() => {
        return true;
      });
    } else {
      setIsSubmitable(() => {
        return false;
      });
    }
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        async show({ isEditable, header, id, action, phoneNumber, bookingId }) {
          modalState.current.header = header;
          modalState.current.isEditable = isEditable;
          modalState.current.action = action;
          if (id) {
            modalState.current.id = id;
          }
          if (bookingId) {
            modalState.current.bookingId = bookingId;
          }
          if (phoneNumber != undefined && phoneNumber) {
            const existedPatient = await fetchOnePatient({
              name: "",
              phoneNumber: phoneNumber,
            });
            if (
              existedPatient &&
              existedPatient.length > 0 &&
              existedPatient[0]
            ) {
              existingPatientState.current.existingData = {
                ...existedPatient[0],
                patientId: existedPatient[0].id,
              };
            }
          }
          setShow(true);
          setValidated(false);
        },
        close() {
          modalState.current.isEditable = false;
          modalState.current.id = null;
          modalState.current.bookingId = null;
          setShow(() => {
            return false;
          });
          setValidated(false);
        },
        isEditable() {
          return modalState.current.isEditable;
        },
        isLarge() {
          modalState.current.size = "xl";
        },
        setCurrentData() {
          if (existingPatientState.current.currentData == null) {
            const form = formRef.current;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            existingPatientState.current.currentData = {
              address: data.address,
              birthYear: data.birthyear,
              fullName: data.fullname,
              gender: data.gender,
              phoneNumber: data.phonenumber,
              scheduleDate: data.scheduledate,
            };
            existingPatientState.current.existingData.scheduleDate =
              data.scheduledate;
          }
        },
        setDialogData() {
          if (existingPatientState.current.currentData != null) {
            onEdit({
              data: existingPatientState.current.currentData,
              isEditable: true,
            });
          }
        },
      };
    },
    []
  );

  function closeHandler() {
    modalState.current.id = null;
    existingPatientState.current.existingData = null;
    existingPatientState.current.currentData = null;
    existingPatientState.current.isUsingExistingData = false;
    setValidated(false);
    setShow(() => {
      return false;
    });
  }

  function submitHandler(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!validateForm(form)) {
      setValidated(true);
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    if (!onSubmit) {
      if (modalState.current.id !== null) data.id = modalState.current.id;
      addMutate.mutate({ ...data });
    } else {
      if (modalState.current.id !== null) data.id = modalState.current.id;
      onSubmit({ data, addMutate });
    }
    setValidated(false);
  }

  function validateForm(form) {
    for (const element of form.elements) {
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.value = element.value.trim();
      }
    }

    return form.checkValidity();
  }

  function validateFormTrimStart(form) {
    for (const element of form.elements) {
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.value = element.value.trimStart();
      }
    }
  }

  function changeFormTrimStartHandler(event){
    event.preventDefault();
    const form = event.currentTarget;
    validateFormTrimStart(form);
    if(onChange){
      onChange(form)
    }
  }


  async function checkHandler(event) {
    existingPatientState.current.isUsingExistingData = event.target.checked;

    if (event.target.checked === true) {
      if (existingPatientState.current.currentData == null) {
        const form = formRef.current;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        existingPatientState.current.currentData = {
          address: data.address,
          birthYear: data.birthyear,
          fullName: data.fullname,
          gender: data.gender,
          phoneNumber: data.phonenumber,
          scheduleDate: data.scheduledate,
        };
        existingPatientState.current.existingData.scheduleDate =
          data.scheduledate;
      }

      setSearchState(() => {
        return {
          phonenumber: "",
          name: "",
          isDisable: true,
        };
      });
      onEdit({
        data: existingPatientState.current.existingData,
        isEditable: false,
      });
    } else {
      setSearchState(() => {
        return {
          phonenumber: "",
          name: "",
          isDisable: false,
        };
      });
      if (existingPatientState.current.currentData != null) {
        onEdit({
          data: existingPatientState.current.currentData,
          isEditable: true,
        });
      }
    }
  }

  const switchElement = (
    <div
      className="form-check form-switch mt-3 mb-1"
      style={{ color: "#000000" }}
    >
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id="flexSwitchCheckChecked"
        onChange={checkHandler}
      />
      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
        Sử dụng thông tin bệnh nhân trong hệ thống
      </label>
    </div>
  );

  return (
    <>
      <NotificationDialog ref={notiDialogRef} />
      <Modal
        ref={ref}
        show={show}
        onHide={closeHandler}
        centered
        size={modalState.current.size}
        style={{ zIndex: "1050" }}
      >
        <Modal.Header
          closeButton
          className={`fw-bold text-dark fs-5 ${modalState.current.action}`}
          style={{ height: "50px" }}
        >
          <div className="title">{modalState.current.header}</div>
        </Modal.Header>
        <div tabIndex="-1" className="h-100">
          <div className={`h position-relative ${modalState.current.action}`}>
            <div className="position-absolute start-50 translate-middle">
              <div
                className="position-relative"
                style={{
                  height: "90px",
                  width: "90px",
                  background: "#ffffff",
                  borderRadius: "45px",
                  top: "-50px",
                }}
              >
                <div className="position-absolute top-50 start-50 translate-middle">
                  <div className="position-relative shadow-sm noti-icon">
                    <div className=" position-absolute top-50 start-50 translate-middle">
                      {modalState.current.action &&
                        icons[modalState.current.action]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-body fw-bold h-100"
            style={{ padding: "0 0.75rem 0.75rem 0.75rem" }}
          >
            {!modalState.current.id && searchElement}
            {modalState.current.action == "accept" &&
              existingPatientState.current.existingData != null &&
              switchElement}
            {!isPasswordChanged ? (
              <Form
                ref={formRef}
                onChange={changeFormTrimStartHandler}
                onSubmit={submitHandler}
                noValidate
                validated={validated}
                className="h-100"
              >
                {children}
              </Form>
            ) : (
              <Form
                ref={formRef}
                onChange={changeFormHandler}
                onSubmit={submitHandler}
                noValidate
                validated={validated}
                className="h-100"
              >
                {children}
              </Form>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
});

export default MainModal;
