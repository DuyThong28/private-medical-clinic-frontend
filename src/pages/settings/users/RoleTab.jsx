import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";

import TableHeader from "../../../components/TableHeader";
import TableBody from "../../../components/TableBody";
import Card from "../../../components/Card";
import NotificationDialog, {
  DialogAction,
} from "../../../components/NotificationDialog";
import { deleteGroupById, fetchAllGroups } from "../../../services/group";
import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import { queryClient } from "../../../App";

function RoleTab() {
  const notiDialogRef = useRef();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const permission = auth?.permission || [];
  const formRef = useRef();
  const [searchState, setSearchState] = useState("1");

  const groupQuery = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const data = await fetchAllGroups();

      const searchData = data.filter((item) =>
        checkSearchState({ state: searchState, role: item })
      );

      return searchData;
    },
  });

  function checkSearchState({ state, role }) {
    if (state === "1") {
      return role.isActive === 1 ? true : false;
    } else if (state === "2") {
      return role.isActive === 0 ? true : false;
    } else {
      return true;
    }
  }

  const groups = groupQuery.data;

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["groups"],
    });
  }, [searchState]);

  function viewGroupHandler({ id }) {
    if (id) navigate(`${id}`);
    else navigate("new");
  }

  function deactiveateGroupHandler({ id, isActive }) {
    notiDialogRef.current.setDialogData({
      action: DialogAction.DELETE,
      dispatchFn: () => deleteGroupById({ id }),
    });
    if (isActive === 1)
      notiDialogRef.current.showDialogWarning({
        message: "Xác nhận lưu trữ vai trò?",
      });
    else
      notiDialogRef.current.showDialogWarning({
        message: "Xác nhận kích hoạt vai trò?",
      });
  }

  function changeFormHandler() {
    const formData = new FormData(formRef.current);
    const searchData = Object.fromEntries(formData);
    const state = searchData.state;
    setSearchState(state);
  }

  return (
    <div className="h-100 w-100">
      <NotificationDialog ref={notiDialogRef} keyQuery={["groups"]} />
      <Card className="p-3">
        <div className="w-100 h-100 d-flex flex-column gap-3">
          <div className=" w-100  d-flex flex-row justify-content-around">
            <div className="col fw-bold fs-4 text-black">
              <label>Quản lý vai trò</label>
            </div>
            <form
              className="d-flex flex-row gap-3 float-end"
              onChange={changeFormHandler}
              ref={formRef}
            >
              <div className="col" style={{ width: "fit-content" }}>
                <div className="col input-group flex-nowrap">
                  <select className="form-select" name="state" defaultValue={1}>
                    <option value="1">Hoạt động</option>
                    <option value="2">Ngưng hoạt động</option>
                    <option value="3">Tất cả</option>
                  </select>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  className="col btn btn-primary float-end"
                  onClick={viewGroupHandler}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-plus-lg me-2"
                    viewBox="0 2 16 16"
                  >
                    <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                  </svg>
                  Thêm mới
                </button>
              </div>
            </form>
          </div>
          <div className=" w-100 h-100 overflow-hidden d-flex flex-column gap-3">
            <TableHeader>
              <div className="text-start" style={{ width: "5%" }}>
                STT
              </div>
              <div className="text-start" style={{ width: "24%" }}>
                Vai trò
              </div>
              <div className="text-start" style={{ width: "60%" }}>
                Trạng thái
              </div>
              <div className="text-end" style={{ width: "10%" }}>
                Thao tác
              </div>
              <div className="text-end" style={{ width: "1%" }}></div>
            </TableHeader>
            <TableBody>
              {groups &&
                groups.map((group, index) => {
                  return (
                    <li
                      className=" dropdown-center list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                      key={group.id}
                    >
                      <div
                        className="text-start"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{ width: "5%" }}
                      >
                        {index + 1}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "25%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {group.groupName}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "60%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {group.isActive === 1 ? "Hoạt động" : "Ngưng hoạt động"}
                      </div>
                      <div
                        className="text-end"
                        style={{ width: "10%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {permission?.includes("RUserGroup") && (
                          <span
                            className="p-2"
                            onClick={() => viewGroupHandler({ id: group.id })}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#1B59F8"
                              className="bi bi-eye-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                              <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                            </svg>
                          </span>
                        )}
                        {permission?.includes("DUserGroup") &&
                          group.id !== 1 && (
                            <span
                              className="p-2"
                              onClick={() =>
                                deactiveateGroupHandler({
                                  id: group.id,
                                  isActive: group.isActive,
                                })
                              }
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
                          )}
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

export default RoleTab;
