import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";

import TableHeader from "../../../components/TableHeader";
import TableBody from "../../../components/TableBody";
import Card from "../../../components/Card";
import MainDialog from "../../../components/MainDialog";
import NotificationDialog, {
  DialogAction,
} from "../../../components/NotificationDialog";
import {
  createUser,
  deleteUserById,
  fetchAllUsers,
  fetchUserById,
} from "../../../services/users";
import { fetchAllGroups } from "../../../services/group";
import PasswordInput from "../../../components/PasswordInput";
import { resetPasswordById } from "../../../services/auth";
import useAuth from "../../../hooks/useAuth";

function MemberTab() {
  const { auth } = useAuth();
  const permission = auth?.permission || [];
  const dialogRef = useRef();
  const notiDialogRef = useRef();
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [dialogState, setDialogState] = useState({
    data: null,
    isEditable: true,
  });
  const [listState, setListState] = useState([]);

  const membersQuery = useQuery({
    queryKey: ["members"],
    queryFn: fetchAllUsers,
  });
  const members = membersQuery.data;

  const groupQuery = useQuery({
    queryKey: ["group"],
    queryFn: fetchAllGroups,
  });

  const groups = groupQuery.data;

  function setData({ data, isEditable }) {
    setDialogState((prevState) => {
      return {
        ...prevState,
        data: data,
        isEditable: isEditable,
      };
    });
  }

  useEffect(() => {
    setListState(() => members);
  }, [members]);

  function searchHandler(event) {
    const textSearch = event.target.value.toLowerCase().trim();
    const result = members.filter((member) =>
      member.fullName.toLowerCase().includes(textSearch)
    );
    setListState(() => result);
  }

  async function editUserHandler({ id, action }) {
    setIsPasswordChanged(() => false);
    await dialogRef.current.edit({ id, action });
  }

  async function changePasswordHandler({ id, action }) {
    setIsPasswordChanged(() => true);
    await dialogRef.current.edit({ id, action });
  }

  async function deleteUserHandler(id) {
    notiDialogRef.current.setDialogData({
      action: DialogAction.DELETE,
      dispatchFn: () => deleteUserById({ id }),
    });
    notiDialogRef.current.showDialogWarning({
      message: "Xác nhận xóa thành viên?",
    });
  }

  function onSubmitPassword({ data, addMutate }) {
    const newPassword = data.newpassword;
    const confirmPassword = data.retypepassword;
    const id = data.id;
    addMutate.mutate({
      id,
      confirmPassword,
      newPassword,
    });
  }

  const editUserInfoElement = (
    <>
      {dialogState.data?.id && (
        <div className="row">
          <label htmlFor="memberid" className="col-form-label fw-bold">
            Mã nhân viên
          </label>
          <input
            type="text"
            className="form-control"
            id="memberid"
            name="memberid"
            defaultValue={dialogState.data?.id ?? ""}
            disabled={true}
          />
        </div>
      )}
      <div className="row">
        <label htmlFor="fullname" className="col-form-label fw-bold">
          Họ và tên
        </label>
        <input
          type="text"
          className="form-control"
          id="fullname"
          name="fullname"
          defaultValue={dialogState.data?.fullName ?? ""}
          disabled={!dialogState.isEditable || false}
          required
        />
      </div>
      <div className="row gap-3">
        <div className="col">
          <label htmlFor="email" className="col-form-label fw-bold">
            Email
          </label>
          <input
            className="form-control"
            id="email"
            name="email"
            type="email"
            defaultValue={dialogState.data?.email ?? ""}
            disabled={!dialogState.isEditable || false}
            required
          ></input>
        </div>
        <div className="col">
          <label htmlFor="usergroupid" className="col-form-label fw-bold">
            Vai trò
          </label>
          <select
            className="form-select"
            id="usergroupid"
            name="usergroupid"
            defaultValue={dialogState.data?.userGroupId ?? ""}
            disabled={!dialogState.isEditable || false}
            required
          >
            {groups &&
              groups.map((group) => {
                return (
                  <option key={group.id} value={group.id}>
                    {group.groupName}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="row">
          <label htmlFor="username" className="col-form-label fw-bold">
            Tên người dùng
          </label>
          <input
            className="form-control"
            id="username"
            name="username"
            defaultValue={dialogState.data?.userName ?? ""}
            disabled={!dialogState.isEditable || false}
            required
          ></input>
        </div>
        {!dialogState.data?.id && (
          <div className="row">
            <PasswordInput
              name={"password"}
              label={"Mật khẩu"}
              disabled={!dialogState.isEditable || false}
            />
          </div>
        )}
      </div>
    </>
  );

  const changePasswordElement = (
    <>
      <div className="row">
        <label htmlFor="username" className="col-form-label fw-bold text-dark">
          Tên người dùng
        </label>
        <input
          className="form-control"
          id="username"
          name="username"
          defaultValue={dialogState.data?.userName ?? ""}
          disabled={true}
          required
        ></input>
      </div>
      <PasswordInput
        name={"newpassword"}
        label={"Mật khẩu mới"}
        disabled={!dialogState.isEditable}
        value={dialogState.newpassword}
      />
      <PasswordInput
        name={"retypepassword"}
        label={"Nhập lại mật khẩu mới"}
        disabled={!dialogState.isEditable}
        value={dialogState.retypepassword}
      />
    </>
  );

  return (
    <div className="h-100 w-100">
      <NotificationDialog ref={notiDialogRef} keyQuery={["members"]} />
      <Card className="p-3">
        <div className="w-100 h-100 d-flex flex-column gap-3">
          <div className=" w-100  d-flex flex-row justify-content-around">
            <div className="col fw-bold fs-4 text-black">
              <label>Quản lý thành viên</label>
            </div>
            <div className="row gap-3">
              <div className="col input-group flex-nowrap">
                <span
                  className="input-group-text"
                  id="addon-wrapping"
                  style={{ backgroundColor: "white" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                  </svg>
                </span>
                <input
                  name="name"
                  type="search"
                  className="form-control"
                  placeholder="Họ và tên"
                  aria-describedby="addon-wrapping"
                  onInput={searchHandler}
                />
              </div>
              <div style={{ width: "fit-content" }}>
                <MainDialog
                  ref={dialogRef}
                  addFn={isPasswordChanged ? resetPasswordById : createUser}
                  editFn={fetchUserById}
                  onEdit={setData}
                  keyQuery={["members"]}
                  isPasswordChanged={isPasswordChanged}
                  setIsPasswordChanged={setIsPasswordChanged}
                  onSubmit={isPasswordChanged ? onSubmitPassword : null}
                  addButton={permission?.includes("CUser") ? true : false}
                >
                  {isPasswordChanged
                    ? changePasswordElement
                    : editUserInfoElement}
                </MainDialog>
              </div>
            </div>
          </div>
          <div className=" w-100 h-100 overflow-hidden d-flex flex-column gap-3">
            <TableHeader>
              <div className="text-start" style={{ width: "5%" }}>
                STT
              </div>
              <div className="text-start" style={{ width: "19%" }}>
                Họ và tên
              </div>
              <div className="text-start" style={{ width: "20%" }}>
                Tên người dùng
              </div>
              <div className="text-start" style={{ width: "25%" }}>
                Email
              </div>
              <div className="text-start" style={{ width: "20%" }}>
                Vai trò
              </div>
              <div className="text-start" style={{ width: "10%" }}>
                Thao tác
              </div>
              <div className="text-start" style={{ width: "1%" }}></div>
            </TableHeader>
            <TableBody>
              {listState &&
                listState.map((user, index) => {
                  return (
                    <li
                      className=" dropdown-center list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                      key={user.id}
                    >
                      <div
                        className="text-start"
                        aria-expanded="false"
                        style={{ width: "5%" }}
                      >
                        {index + 1}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "20%" }}
                        aria-expanded="false"
                      >
                        {user.fullName}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "20%" }}
                        aria-expanded="false"
                      >
                        {user.userName}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "25%" }}
                        aria-expanded="false"
                      >
                        {user.email}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "20%" }}
                        aria-expanded="false"
                      >
                        {user.userGroup.groupName}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "10%" }}
                        aria-expanded="false"
                      >
                        {permission?.includes("UUser") && (
                          <span
                            className="p-2"
                            onClick={() =>
                              editUserHandler({ id: user.id, action: "edit" })
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#1B59F8"
                              className="bi bi-pencil-square"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                            </svg>
                          </span>
                        )}
                        {permission?.includes("UUser") && (
                          <span
                            className="p-2"
                            onClick={() =>
                              changePasswordHandler({
                                id: user.id,
                                action: "edit",
                              })
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#1B59F8"
                              className="bi bi-lock-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2" />
                            </svg>
                          </span>
                        )}
                        {/* {permission?.includes("DUser") && (
                          <span
                            className="p-2"
                            onClick={() => deleteUserHandler(user.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#1B59F8"
                              className="bi bi-archive-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8z" />
                            </svg>
                          </span>
                        )} */}
                      </div>
                    </li>
                  );
                })}
            </TableBody>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default MemberTab;