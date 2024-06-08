import { useEffect, useRef, useState } from "react";
import Card from "../../components/Card";
import { Form } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../services/auth";
import PasswordInput from "../../components/PasswordInput";
import NotificationDialog from "../../components/NotificationDialog";
import useAuth from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const resetStep = {
  INFO: "change password",
  RESET: "reset password",
};

function PasswordView() {
  const [dataState, setDataState] = useState({
    currentpassword: "",
    newpassword: "",
    retypepassword: "",
    isEditable: false,
    isSubmitable: false,
  });
  const { auth } = useAuth();
  const [validated, setValidated] = useState(false);
  const [resetState, setResetState] = useState(resetStep.INFO);
  const notiDialogRef = useRef();

  const jwtToken = Cookies.get("refreshToken");
  let userData = {};
  if (jwtToken != undefined) {
    userData = jwtDecode(jwtToken);
  }

  const changePasswordMutate = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      notiDialogRef.current.toastSuccess({
        message: "Thay đổi mật khẩu thành công",
      });
      setDataState(() => {
        return {
          currentpassword: "",
          newpassword: "",
          retypepassword: "",
          isEditable: false,
          isSubmitable: false,
        };
      });
      setValidated(false);
    },
    onError: (data) => {
      notiDialogRef.current.toastError({
        message: data.message,
      });
    },
  });

  useEffect(() => {
    if (
      dataState.currentpassword !== "" &&
      dataState.newpassword !== "" &&
      dataState.retypepassword !== "" &&
      dataState.retypepassword === dataState.newpassword
    ) {
      setDataState((prevState) => {
        return { ...prevState, isSubmitable: true };
      });
    } else {
      setDataState((prevState) => {
        return { ...prevState, isSubmitable: false };
      });
    }
  }, [
    dataState.currentpassword,
    dataState.newpassword,
    dataState.retypepassword,
  ]);

  function editHandler() {
    setResetState(resetStep.RESET);
    setDataState((prevState) => {
      return {
        ...prevState,
        isEditable: true,
      };
    });
  }

  function onChangeHandler({ event, name }) {
    setDataState((prevState) => {
      return {
        ...prevState,
        [name]: event.target.value.trim(),
      };
    });
  }

  async function submitHanlder(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    const currentPassword = data.currentpassword;
    const newPassword = data.newpassword;
    const confirmPassword = data.retypepassword;
    changePasswordMutate.mutate({
      id: userData.id,
      confirmPassword,
      newPassword,
      currentPassword,
    });
  }

  function cancelHandler() {
    setResetState(resetStep.INFO);
    setDataState(() => {
      return {
        currentpassword: "",
        newpassword: "",
        retypepassword: "",
        isEditable: false,
        isSubmitable: false,
      };
    });
  }

  return (
    <>
      <NotificationDialog ref={notiDialogRef} keyQuery={[]} />
      <div
        className="col h-100 position-relative"
        style={{ background: "#F5F6FA" }}
      >
        <div
          className="position-absolute h"
          style={{
            height: "35%",
            width: "100%",
            background: "linear-gradient(90deg, #0048b2, #3b8aff 100%)",
            bottom: 0,
          }}
        ></div>
        <div className="col h-100">
          <div className="h-100 position-relative">
            <div
              className="position-absolute top-50 mt-50 start-50 translate-middle"
              style={{ width: "40%", height: "22rem" }}
            >
              <Card>
                <div className="h-100">
                  {resetState === resetStep.INFO && (
                    <div
                      className="row fw-bold fs-4 text-center text-dark"
                      style={{ height: "10%" }}
                    >
                      <label>Thông Tin Cá Nhân</label>
                    </div>
                  )}
                  {resetState === resetStep.RESET && (
                    <div
                      className="row fw-bold fs-4 text-center text-dark"
                      style={{ height: "10%" }}
                    >
                      <label>Thiết Lập Mật Khẩu</label>
                    </div>
                  )}
                  <div style={{ height: "90%" }}>
                    <Form
                      onSubmit={submitHanlder}
                      noValidate
                      validated={validated}
                      className="h-100 d-flex flex-column justify-content-between"
                    >
                      {resetState === resetStep.INFO && (
                        <>
                          <div className="row">
                            <label className="col-form-label fw-bold  text-dark mt-4">
                              Họ và tên
                            </label>
                            <input
                              className="form-control fw-bold"
                              disabled
                              style={{
                                boxShadow:
                                  "6px 6px 54px 0px rgba(0, 0, 0, 0.08)",
                              }}
                              value={userData?.fullName || ""}
                            ></input>
                          </div>
                          <div className="row">
                            <label className="col-form-label fw-bold  text-dark">
                              Vai trò
                            </label>
                            <input
                              className="form-control fw-bold mb-4"
                              disabled
                              style={{
                                boxShadow:
                                  "6px 6px 54px 0px rgba(0, 0, 0, 0.08)",
                              }}
                              value={userData?.role || ""}
                            ></input>
                          </div>
                        </>
                      )}
                      {resetState === resetStep.RESET && (
                        <div className="row">
                          <PasswordInput
                            name={"currentpassword"}
                            label={"Mật khẩu hiện tại"}
                            disabled={!dataState.isEditable}
                            value={dataState.currentpassword}
                            onChange={(event) =>
                              onChangeHandler({
                                event,
                                name: "currentpassword",
                              })
                            }
                          />
                          <PasswordInput
                            name={"newpassword"}
                            label={"Mật khẩu mới"}
                            disabled={!dataState.isEditable}
                            value={dataState.newpassword}
                            onChange={(event) =>
                              onChangeHandler({ event, name: "newpassword" })
                            }
                          />
                          <PasswordInput
                            name={"retypepassword"}
                            label={"Nhập lại mật khẩu mới"}
                            disabled={!dataState.isEditable}
                            value={dataState.retypepassword}
                            onChange={(event) =>
                              onChangeHandler({ event, name: "retypepassword" })
                            }
                          />
                        </div>
                      )}
                      <div className="row  mt-3">
                        {resetState === resetStep.INFO && (
                          <div className="d-flex flex-row gap-3 justify-content-center">
                            <button
                              className="btn btn-primary fw-bold"
                              onClick={editHandler}
                              type="button"
                            >
                              Thay đổi mật khẩu
                            </button>
                          </div>
                        )}
                        {resetState === resetStep.RESET && (
                          <div className="d-flex flex-row gap-3 justify-content-center">
                            <button
                              type="button"
                              className="col btn btn-secondary fw-bold"
                              onClick={cancelHandler}
                              style={{ width: "7rem" }}
                            >
                              Hủy
                            </button>
                            <button
                              className="col btn btn-primary fw-bold"
                              type="submit"
                              disabled={!dataState.isSubmitable}
                              style={{ width: "7rem" }}
                            >
                              Lưu
                            </button>
                          </div>
                        )}
                      </div>
                    </Form>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PasswordView;
