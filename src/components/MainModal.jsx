import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import Modal from "react-bootstrap/Modal";
import { queryClient } from "../App";
import Form from "react-bootstrap/Form";
import NotificationDialog, { DialogAction } from "./NotificationDialog";
import { message } from "antd";

const MainModal = forwardRef(function MainModal(
  { children, addFn, keyQuery, onSubmit, searchElement, onChange },
  ref
) {
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const notiDialogRef = useRef();
  const modalState = useRef({
    header: "",
    isEditable: true,
    size: "",
    id: null,
  });

  const addMutate = useMutation({
    mutationFn: addFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...keyQuery] });
      modalState.current.isEditable = false;
      setShow(() => {
        return false;
      });
      if (modalState.current.id !== null) {
        notiDialogRef.current.setDialogData({ action: DialogAction.UPDATE });
      } else {
        notiDialogRef.current.setDialogData({ action: DialogAction.ADD });
      }
      notiDialogRef.current.toastSuccess();
      modalState.current.id = null;
    },
    onError: (data) => {
      notiDialogRef.current.setDialogData({ action: DialogAction.ADD });
      notiDialogRef.current.toastError({ message: data.message });
    },
  });

  useImperativeHandle(
    ref,
    () => {
      return {
        show({ isEditable, header, id }) {
          modalState.current.header = header;
          modalState.current.isEditable = isEditable;
          if (id) {
            modalState.current.id = id;
          }
          setShow(true);
          setValidated(false);
        },
        close() {
          modalState.current.isEditable = false;
          modalState.current.id = null;
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
      };
    },
    []
  );

  function closeHandler() {
    modalState.current.id = null;
    setValidated(false);
    setShow(() => {
      return false;
    });
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
    if (!onSubmit) {
      if (modalState.current.id !== null) data.id = modalState.current.id;
      addMutate.mutate({ ...data });
    } else {
      if (modalState.current.id !== null) data.id = modalState.current.id;
      onSubmit({ data, addMutate });
    }
    setValidated(false);
  }

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
          className="text-dark"
          style={{ height: "50px" }}
        >
          <Modal.Title>{modalState.current.header}</Modal.Title>
        </Modal.Header>
        <div tabIndex="-1" className="h-100">
          <div
            className="modal-body fw-bold h-100"
            style={{ padding: "0 0.75rem 0.75rem 0.75rem" }}
          >
            {!modalState.current.id && searchElement}
            <Form
              onChange={onChange}
              onSubmit={submitHandler}
              noValidate
              validated={validated}
              className="h-100"
            >
              {children}
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
});

export default MainModal;
