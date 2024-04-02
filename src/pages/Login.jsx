import loginImage from "../assets/login-background.png";
import "./Login.scss";
import { json, redirect } from "react-router";

function LoginPage() {
  async function submitHandler(event){
    event.preventDefault();
    const form = new FormData(event.target);
    const username=form.get('username');
    const password=form.get('password');
    const userData = {
      username, password
    };

    const response = await fetch("http://localhost:8080/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData)
    })

    if(!response.ok){
      throw json(
        { message: "could not login" },
        {
          status: 500,
        }
      );
    }
    
      
  const resData = await response.json();
  const accessToken = resData.user.accessToken;
  const refreshToken = resData.user.refreshToken;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken",refreshToken);
  return redirect("/settings");
  
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
              <form onSubmit={submitHandler}>
                <button
                  className="w-100 py-2 mb-2 btn btn-outline-secondary rounded-3"
                  type="submit"
                >
                  <span className="p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      fill="#a10a02"
                      viewBox="0 0 17 17"
                    >
                      <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
                    </svg>
                  </span>
                  Log in with Google
                </button>
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
