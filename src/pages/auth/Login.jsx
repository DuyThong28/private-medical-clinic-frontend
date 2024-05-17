import { redirect, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { login } from "../../services/auth";

import loginImage from "../../assets/login-background.png";
import logo from "../../assets/logo.png";
import GoogleButton from "react-google-button";
import NotificationDialog from "../../components/NotificationDialog";
import PasswordInput from "../../components/PasswordInput";
import Card from "../../components/Card";
import "./Login.scss";
import useAuth from "../../hooks/useAuth";

function LoginPage() {
  const { setAuth } = useAuth();
  const notiDialogRef = useRef();
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  localStorage.removeItem("email");

  const { mutate } = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: (data) => {
      const refreshToken = data.user.refreshToken;
      setAuth(jwtDecode(refreshToken));
      setValidated(false);
      window.open("http://localhost:3000/home", "_self");
    },
    onError: (data) => {
      notiDialogRef.current.toastError({ message: data.message });
    },
  });

  async function localLoginHandler(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    const formData = new FormData(event.target);
    const username = formData.get("username").trim();
    const password = formData.get("password").trim();
    if (username && password) {
      const userData = {
        username,
        password,
      };
      mutate(userData);
    }
  }

  async function loginWithGoogleHandler() {
    window.open("http://localhost:8080/api/v1/auth/google", "_self");
  }

  function navigateToForgotPassHandler() {
    navigate("/forgotpassword");
  }

  return (
    <>
      <NotificationDialog ref={notiDialogRef} />
      <div
        className="d-flex flex-row h-100 w-100"
        style={{ background: "#ffffff" }}
      >
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
          <div
            className=" position-absolute"
            style={{
              height: "400px",
              width: "400px",
              top: "80%",
              left: "-20%",
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
              left: "-35%",
              borderRadius: "50%",
              border: "1px solid #3a78ca",
            }}
          ></div>
          {/* <img src={loginImage} className="w-100 h-100" /> */}
        </div>

        <div className="col h-100 position-relative">
          <div className="col h-100">
            <div className="h-100 position-relative">
              <div
                className="position-absolute top-50 mt-50 start-50 translate-middle"
                style={{ width: "65%" }}
              >
                <div>
                  <div className="p-4">
                    <div className="col fw-bold fs-4 mb-4 text-center text-dark">
                      <label>Đăng Nhập</label>
                    </div>
                    <div>
                      <div
                        className="position-relative border border-1 mb-4 login-with-google"
                        style={{
                          height: "40px",
                          overflow: "hidden",
                          background: "#3A57E8",
                          boxShadow: "6px 6px 54px 0px rgba(0, 0, 0, 0.08)",
                        }}
                      >
                        <GoogleButton
                          className="position-absolute top-50 start-50 translate-middle w-100"
                          style={{
                            marginLeft: "-1px",
                          }}
                          label="Đăng nhập với Google"
                          onClick={loginWithGoogleHandler}
                        />
                      </div>
                      <Form
                        method="post"
                        onSubmit={localLoginHandler}
                        noValidate
                        validated={validated}
                        className="h-100"
                      >
                        <div className="col">
                          <label
                            htmlFor="username"
                            className="col-form-label fw-bold  text-dark"
                          >
                            Tên đăng nhập
                          </label>
                          <div>
                            <input
                              className="form-control input-border"
                              type="text"
                              name="username"
                              id="username"
                              placeholder="Tên đăng nhập"
                              required
                              style={{
                                boxShadow:
                                  "6px 6px 54px 0px rgba(0, 0, 0, 0.08)",
                              }}
                            ></input>
                          </div>
                        </div>
                        <PasswordInput
                          className="input-border"
                          name={"password"}
                          label={"Mật khẩu"}
                          style={{
                            boxShadow: "6px 6px 54px 0px rgba(0, 0, 0, 0.05)",
                          }}
                        />
                        <div className="forgot-password">
                          <a
                            className="fw-bold nav-link  mt-2 text-end"
                            onClick={navigateToForgotPassHandler}
                          >
                            Quên mật khẩu
                          </a>
                        </div>
                        <button
                          className="w-100 mb-3 mt-4 btn rounded-3 shadow btn-primary"
                          type="submit"
                        >
                          Đăng nhập
                        </button>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
