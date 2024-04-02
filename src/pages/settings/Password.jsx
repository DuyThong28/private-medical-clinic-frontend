import "./Password.scss";

function PasswordView() {
  return (
    <>
      <div className="password-container mx-auto w-50 ">
        <div className="modal-content rounded-4 shadow content ">
          <div className=" p-5 pb-4 border-bottom-0 align-self-center">
            <p className="fw-bold mb-10 fs-2 ">Password Settings</p>
          </div>

          <div className="modal-body p-5 pt-0">
            <form>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control rounded-3"
                  id="currentpassword"
                  placeholder="currentpassword"
                  name="currentpassword"
                />
                <label htmlFor="currentpassword">Current Password</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control rounded-3"
                  id="newpassword"
                  placeholder="newpassword"
                  name="newpassword"
                />
                <label htmlFor="newpassword">New Password</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control rounded-3"
                  id="retypepassword"
                  placeholder="retypepassword"
                  name="retypepassword"
                />
                <label htmlFor="retypepassword">Retype Password</label>
              </div>
              <button
                className="w-100 mb-2 btn btn-lg rounded-3 btn btn-secondary"
                type="submit"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default PasswordView;
