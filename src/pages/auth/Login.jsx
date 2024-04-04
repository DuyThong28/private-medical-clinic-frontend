import loginImage from "../../assets/login-background.png";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import GoogleButton from "react-google-button";
import { login } from "../../util/auth";

function LoginPage() {
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate("/systems/home");
    },
  });

  async function localLoginHandler(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");
    if (username && password) {
      const userData = {
        username,
        password,
      };
      mutate(userData);
    }
  }

  async function loginWithGoogleHandler() {
    const newWindow = window.open(
      "http://localhost:8080/api/v1/auth/google",
      "_blank",
      "width=500, height=600"
    );

    if (newWindow) {
      const timer = setInterval(() => {
        if (newWindow.closed) {
          mutate();
          if (timer) clearInterval(timer);
        }
      });
    }
  }

  return (
    <>
      <div className="login">
        <div className="content-left">
          <img src={loginImage} />
        </div>
        <div className="content-right">
          <div className="modal-content rounded-4 shadow content">
            <div className=" p-5 pb-4 border-bottom-0 align-self-center">
              <h1 className="fw-bold mb-0 fs-2 ">Log In</h1>
            </div>

            <div className="modal-body p-5 pt-0">
              <form method="post" onSubmit={localLoginHandler}>
                <GoogleButton
                  className="w-100  mb-2"
                  onClick={loginWithGoogleHandler}
                />

                <hr className="my-4" />

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control rounded-3"
                    id="username"
                    placeholder="username"
                    name="username"
                  />
                  <label htmlFor="username">Username</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control rounded-3"
                    id="password"
                    placeholder="Password"
                    name="password"
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="w-100 mb-2 btn btn-lg rounded-3 btn-primary"
                  type="submit"
                >
                  Log In
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
