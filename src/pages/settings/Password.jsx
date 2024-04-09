function PasswordView() {
  return (
    <div className="col">
      <div
        className="h-100 position-relative"
        style={{ backgroundColor: "#F9F9F9" }}
      >
        <div
          className="w-50 modal-content rounded-4 shadow  content position-absolute top-50 mt-50 start-50 translate-middle"
          style={{ height: "fit-content", backgroundColor: "#FEFEFE" }}
        >
          <div className=" p-4 border-bottom-0 align-self-center">
            <p className="fw-bold mb-10 fs-2 ">Cài Đặt Mật Khẩu</p>
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
                <label htmlFor="currentpassword">Mật khẩu hiện tại</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control rounded-3"
                  id="newpassword"
                  placeholder="newpassword"
                  name="newpassword"
                />
                <label htmlFor="newpassword">Mật khẩu mới</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control rounded-3"
                  id="retypepassword"
                  placeholder="retypepassword"
                  name="retypepassword"
                />
                <label htmlFor="retypepassword">Nhập lại mật khẩu mới</label>
              </div>
              <div className="w-100 d-flex justify-content-center gap-5">
                <button
                  className="btn btn-lg btn btn-outline-primary rounded-pill "
                  type="button"
                  style={{ width: "200px" }}
                >
                  Đóng
                </button>
                <button
                  className="btn btn-lg btn btn-primary rounded-pill "
                  type="submit"
                  style={{ width: "200px" }}
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordView;
