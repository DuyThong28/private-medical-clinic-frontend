import NotificationDialog from "../../components/NotificationDialog";
import { useEffect, useRef, useState } from "react";
import PasswordInput from "../../components/PasswordInput";
import { Form } from "react-bootstrap";
import logo from "../../assets/logo.png";
import "./Login.scss";
import { useMutation } from "@tanstack/react-query";
import {
  checkMail,
  checkOTP,
  resetPassword,
  sendOTP,
} from "../../services/auth";
import { useNavigate, useRouteError } from "react-router";
import useAuth from "../../hooks/useAuth";

const resetStep = {
  CHECKMAIL: "check mail",
  SENDOTP: "send otp",
  CHECKOTP: "check otp",
  RESET: "reset password",
};

function ForgotPassword() {
  const notiDialogRef = useRef();
  const formRef = useRef();
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [resetState, setResetState] = useState(resetStep.CHECKMAIL);
  const [dataState, setDataState] = useState({
    newpassword: "",
    confirmpassword: "",
    isSubmitable: false,
  });

  const checkMailMutate = useMutation({
    mutationFn: checkMail,
    onSuccess: async (data) => {
      if (data === true) {
        const email = localStorage.getItem("email");
        setResetState(resetStep.CHECKOTP);
        notiDialogRef.current.toastSuccess({
          message: "Chúng tôi đã gửi mã OTP đến email " + email,
        });
        await sendOTP({ email });
      }
    },
    onError: (data) => {
      notiDialogRef.current.toastError({ message: data.message });
    },
  });

  const checkOPTMutate = useMutation({
    mutationFn: checkOTP,
    onSuccess: () => {
      setResetState(resetStep.RESET);
      notiDialogRef.current.toastSuccess({
        message: "Xác nhận thành công",
      });
    },
    onError: (data) => {
      notiDialogRef.current.toastError({ message: data.message });
    },
  });

  const resetPasswordMutate = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      notiDialogRef.current.toastSuccess({
        message: "Cài đặt mật khẩu mới thành công",
      });
      setTimeout(() => {
        navigate("/");
      }, 500);
    },
    onError: (data) => {
      notiDialogRef.current.toastError({ message: data.message });
    },
  });

  function onChangeHandler({ event, name }) {
    setDataState((prevState) => {
      return {
        ...prevState,
        [name]: event.target.value.trim(),
      };
    });
  }

  useEffect(() => {
    if (
      dataState.confirmpassword !== "" &&
      dataState.newpassword !== "" &&
      dataState.confirmpassword === dataState.newpassword
    ) {
      setDataState((prevState) => {
        return { ...prevState, isSubmitable: true };
      });
    } else {
      setDataState((prevState) => {
        return { ...prevState, isSubmitable: false };
      });
    }
  }, [dataState.newpassword, dataState.confirmpassword]);

  async function submitHandler(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData);
    if (resetState === resetStep.CHECKMAIL) {
      const email = data.email.trim();
      checkMailMutate.mutate({ email });
    } else if (resetState === resetStep.CHECKOTP) {
      const email = localStorage.getItem("email");
      const code = data.code.trim();
      checkOPTMutate.mutate({ email, code });
    } else if (resetState === resetStep.RESET) {
      const email = localStorage.getItem("email");
      const newPassword = data.newpassword.trim();
      const confirmPassword = data.confirmpassword.trim();
      resetPasswordMutate.mutate({ email, newPassword, confirmPassword });
    }
    setValidated(false);
  }

  function navigateToLoginHandler() {
    navigate("/");
  }

  const error = useRouteError();
  const { auth } = useAuth();
  if (auth.isPending) {
    return <></>;
  }
  if (auth.isAuth) {
    throw error;
  }

  return (
    <>
      <NotificationDialog ref={notiDialogRef} />
      <div className="d-flex flex-row h-100" style={{ background: "#ffffff" }}>
        <div className="col h-100 position-relative">
          <div className="col h-100">
            <div className="h-100 position-relative">
              <div
                className="position-absolute top-50 mt-50 start-50 translate-middle"
                style={{ width: "65%" }}
              >
                <div>
                  <div className="p-4">
                    {resetState === resetStep.CHECKMAIL && (
                      <div className="col fw-bold fs-4 mb-4 text-center text-dark">
                        <label>Tìm Kiếm Email</label>
                      </div>
                    )}
                    {resetState === resetStep.CHECKOTP && (
                      <div className="col fw-bold fs-4 mb-4 text-center text-dark">
                        <label>Xác Thực Mã OTP</label>
                      </div>
                    )}
                    {resetState === resetStep.RESET && (
                      <div className="col fw-bold fs-4 mb-4 text-center text-dark">
                        <label>Thiết Lập Mật Khẩu</label>
                      </div>
                    )}
                    <Form
                      method="post"
                      onSubmit={submitHandler}
                      noValidate
                      validated={validated}
                      ref={formRef}
                      className="h-100 mt-4"
                    >
                      {resetState === resetStep.CHECKMAIL && (
                        <div className="form-floating mb-3">
                          <input
                            type="email"
                            className="form-control rounded-3"
                            id="email"
                            placeholder="email"
                            name="email"
                            required
                            style={{
                              boxShadow:
                                "rgb(14 111 253 / 10%) 4px 4px 40px 0px",
                            }}
                          />
                          <label htmlFor="email">Email</label>
                        </div>
                      )}
                      {resetState === resetStep.CHECKOTP && (
                        <div className="form-floating mb-3">
                          <input
                            className="form-control rounded-3"
                            name="code"
                            id="code"
                            placeholder="Mã OTP"
                            required
                            style={{
                              boxShadow:
                                "rgb(14 111 253 / 10%) 4px 4px 40px 0px",
                            }}
                          ></input>
                          <label htmlFor="code">Mã OTP</label>
                        </div>
                      )}
                      {resetState === resetStep.RESET && (
                        <>
                          <PasswordInput
                            name={"newpassword"}
                            label={"Mật khẩu mới"}
                            value={dataState.newpassword}
                            onChange={(event) =>
                              onChangeHandler({ event, name: "newpassword" })
                            }
                            style={{
                              boxShadow:
                                "rgb(14 111 253 / 10%) 4px 4px 40px 0px",
                            }}
                          />
                          <PasswordInput
                            name={"confirmpassword"}
                            label={"Nhập lại mật khẩu mới"}
                            value={dataState.confirmpassword}
                            onChange={(event) =>
                              onChangeHandler({
                                event,
                                name: "confirmpassword",
                              })
                            }
                            style={{
                              boxShadow:
                                "rgb(14 111 253 / 10%) 4px 4px 40px 0px",
                            }}
                          />
                        </>
                      )}
                      <div className="forgot-password">
                        <a
                          className="fw-bold nav-link  mt-2 text-end"
                          onClick={navigateToLoginHandler}
                        >
                          Đăng nhập với mật khẩu
                        </a>
                      </div>
                      {resetState === resetStep.CHECKMAIL && (
                        <button
                          className="w-100 mb-3 mt-4 btn rounded-3 btn-primary shadow"
                          type="submit"
                        >
                          Tìm kiếm
                        </button>
                      )}
                      {resetState === resetStep.CHECKOTP && (
                        <button
                          className="w-100 mb-3 mt-4 btn rounded-3 btn-primary shadow"
                          type="submit"
                        >
                          Xác nhận
                        </button>
                      )}
                      {resetState === resetStep.RESET && (
                        <button
                          className="w-100 mb-3 mt-4 btn rounded-3 btn-primary shadow"
                          type="submit"
                          disabled={!dataState.isSubmitable}
                        >
                          Xác nhận
                        </button>
                      )}
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="h-100 position-relative"
          style={{
            width: "57%",
            background:
              "linear-gradient(52deg, #022281 12.59%, #056FDF 101.37%)",
          }}
        >
          <div
            className=" position-absolute translate-middle text-white text-center"
            style={{ top: "45%", left: "50%", marginBottom: "1rem" }}
          >
            <img src={logo} style={{ width: "4.5rem", height: "4.5rem" }} />
            <p className="fs-1  fw-bold">Private Medical Clinic</p>
            <p className="fs-5 ">Chăm sóc sức khỏe toàn diện</p>
          </div>
          s{" "}
          <div
            className=" position-absolute"
            style={{
              height: "400px",
              width: "400px",
              top: "80%",
              left: "65%",
              borderRadius: "50%",
              border: "1px solid #3a78ca",
            }}
          ></div>
          <div
            className=" position-absolute"
            style={{
              height: "400px",
              width: "400px",
              top: "65%",
              left: "80%",
              borderRadius: "50%",
              border: "1px solid #3a78ca",
            }}
          ></div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
