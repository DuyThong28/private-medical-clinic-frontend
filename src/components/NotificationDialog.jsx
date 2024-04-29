import { useMutation } from "@tanstack/react-query";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { queryClient } from "../App";
import "./NotificationDialog.scss";

export const DialogAction = {
  DELETE: "delete",
  ADD: "add",
  UPDATE: "update",
  FINISH: "finish",
};

const icon = {
  ["warning-notification"]: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      fill="#DC7609"
      className="bi bi-trash3-fill"
      viewBox="0 0 16 16"
    >
      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
    </svg>
  ),
  ["success-notification"]: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      fill="#008A2E"
      className="bi bi-check-circle-fill"
      viewBox="0 0 16 16"
    >
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
    </svg>
  ),
  ["error-notification"]: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      fill="#E50000"
      className="bi bi-exclamation-circle-fill"
      viewBox="0 0 16 16"
    >
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
    </svg>
  ),
};

const NotificationDialog = forwardRef(function NotificationDialog(
  { children, keyQuery },
  ref
) {
  const [show, setShow] = useState(false);
  const modalState = useRef({
    isToast: true,
    message: "Thông báo",
    buttonGroup: null,
    class: "",
    actionFn: null,
  });

  const buttonDelete = (
    <div className="d-flex gap-3 mt-3 justify-content-center">
      <button
        type="button"
        className="btn button-outline  shadow-sm"
        onClick={closeHandler}
        style={{ minWidth: "70px" }}
      >
        Hủy
      </button>
      <button
        type="button"
        className="btn button  shadow-sm"
        onClick={deleteHandler}
        style={{ minWidth: "70px" }}
      >
        Xóa
      </button>
    </div>
  );

  const buttonAdd = (
    <div className="d-flex gap-3 mt-3 justify-content-center">
      <button
        type="button"
        className="btn button-outline"
        onClick={closeHandler}
        style={{ minWidth: "70px" }}
      >
        Hủy
      </button>
      <button
        type="button"
        className="btn button"
        onClick={saveHandler}
        style={{ minWidth: "70px" }}
      >
        Lưu
      </button>
    </div>
  );

  const buttonComplete = (
    <div className="d-flex gap-3 mt-3 justify-content-center">
      <button
        type="button"
        className="btn button-outline"
        onClick={closeHandler}
        style={{ minWidth: "100px" }}
      >
        Hủy
      </button>
      <button
        type="button"
        className="btn button"
        onClick={saveHandler}
        style={{ minWidth: "100px" }}
      >
        Xác nhận
      </button>
    </div>
  );

  const buttongroup = {
    delete: buttonDelete,
    add: buttonAdd,
    update: buttonAdd,
    complete: buttonComplete,
  };

  const deleteMutate = useMutation({
    mutationFn: modalState.actionFn,
    onSuccess: (data) => {
      toastSuccess({ message: data.message });
      queryClient.invalidateQueries({ queryKey: [...keyQuery] });
    },
    onError: (data) => {
      toastError({ message: data.message });
    },
  });

  function deleteHandler() {
    if (modalState.actionFn != null) {
      deleteMutate.mutate();
    }
    modalState.actionFn = null;
  }

  function saveHandler() {
    if (modalState.actionFn !== null) {
      modalState.actionFn();
    }
    modalState.actionFn = null;
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        setDialogData({ action, dispatchFn }) {
          if (action === DialogAction.ADD) {
            modalState.buttonGroup = buttongroup.add;
          } else if (action === DialogAction.UPDATE) {
            modalState.buttonGroup = buttongroup.update;
          } else if (action === DialogAction.DELETE) {
            modalState.actionFn = dispatchFn;
            modalState.buttonGroup = buttongroup.delete;
          } else if (action === DialogAction.FINISH) {
            modalState.actionFn = dispatchFn;
            modalState.buttonGroup = buttongroup.complete;
          }
        },
        toastSuccess(data) {
          toastSuccess(data);
        },
        toastError(data) {
          toastError(data);
        },
        showDialogWarning(data) {
          dialogWarning(data);
        },
        toastWarning(data) {
          toastWarning(data);
        },
      };
    },
    []
  );

  function toastSuccess(data) {
    modalState.isToast = true;
    modalState.class = "success-notification";
    modalState.message = data?.message ?? "Thao tác thành công";
    setShow(() => {
      return true;
    });
    setTimeout(() => {
      setShow(() => {
        return false;
      });
    }, 1000);
  }

  function toastError(data) {
    modalState.isToast = true;
    modalState.class = "error-notification";
    modalState.message = data?.message ?? "Thao tác thất bại";
    setShow(() => {
      return true;
    });
    setTimeout(() => {
      setShow(() => {
        return false;
      });
    }, 1000);
  }

  function toastWarning(data) {
    modalState.isToast = true;
    modalState.class = "warning-notification";
    modalState.message = data?.message ?? "Thông báo";
    setShow(() => {
      return true;
    });
    setTimeout(() => {
      setShow(() => {
        return false;
      });
    }, 1000);
  }

  function dialogWarning(data) {
    modalState.isToast = false;
    modalState.class = "warning-notification";
    modalState.message = data?.message ?? "Thông báo";
    setShow(() => {
      return true;
    });
  }

  function closeHandler() {
    modalState.isToast = true;
    setShow(() => {
      return false;
    });
  }

  return (
    <div>
      <Modal
        ref={ref}
        show={show}
        onHide={closeHandler}
        centered
        size="sm"
        className={modalState.class}
      >
        <div
          className="modal-content"
          style={{ padding: "0 0.75rem 0.75rem 0.75rem" }}
        >
          <div className="modal-body position-relative">
            <div className="position-absolute start-50 translate-middle">
              <div
                className="position-relative"
                style={{
                  height: "90px",
                  width: "90px",
                  background: "#ffffff",
                  borderRadius: "45px",
                  top: "-15px",
                }}
              >
                <div className="position-absolute top-50 start-50 translate-middle">
                  <div className="position-relative shadow-sm noti-icon">
                    <div className=" position-absolute top-50 start-50 translate-middle">
                      {icon[modalState.class]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-body fs-5 text-center text-dark fw-bold">
            {modalState.message}
          </div>
          {!modalState.isToast && modalState.buttonGroup}
        </div>
      </Modal>
    </div>
  );
});

export default NotificationDialog;
