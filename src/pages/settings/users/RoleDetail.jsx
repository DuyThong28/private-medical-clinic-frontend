import { useState, useRef, useEffect } from "react";

import Card from "../../../components/Card";
import NotificationDialog from "../../../components/NotificationDialog";
import { useNavigate, useParams, useRouteError } from "react-router";
import { Form } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createGroup, fetchGroupById } from "../../../services/group";
import { fetchAllFeatures } from "../../../services/features";
import PermissionArea from "./PermissionArea";
import useAuth from "../../../hooks/useAuth";

function RoleDetail() {
  const { roleId } = useParams();
  const formRef = useRef();
  const { auth } = useAuth();
  const permission = auth?.permission || [];
  const notiDialogRef = useRef();
  const navigate = useNavigate();
  const [dataState, setDataState] = useState({
    data: null,
    isEditable: false,
    isSubmitable: false,
    isActive: false,
  });

  const allFeatures = {
    Booking: ["RBookingAppointment", "ABookingAppointment"],
    Examination: [
      "RAppointment",
      "CAppointment",
      "UAppointment",
      "DAppointment",
      "CRecord",
      "CInvoice",
    ],
    Patient: ["RPatient", "CPatient", "UPatient", "RRecord"],
    Invoice: ["RInvoice"],
    Report: ["RReport"],
    User: [
      "RUser",
      "CUser",
      "UUser",
      "DUser",
      "UUserGroup",
      "RUserGroup",
      "CUserGroup",
      "DUserGroup",
    ],
    Medicine: ["RDrug", "CDrug", "DDrug", "UDrug"],
    Principle: ["RArgument", "UArgument"],
  };

  const [permissionState, setPermissionState] = useState({});
  const roleQuery = useQuery({
    queryKey: ["groups", roleId],
    queryFn: async () => {
      const resData = await fetchGroupById({ id: roleId });
      return resData;
    },
    enabled: roleId !== undefined,
  });

  const featureQuery = useQuery({
    queryKey: ["feature"],
    queryFn: fetchAllFeatures,
  });

  useEffect(() => {
    setDataState((prevState) => {
      if (roleId !== undefined) {
        return {
          ...prevState,
          data: roleQuery.data?.groupUser.groupName,
          isActive:
            roleQuery.data?.groupUser.id !== 1 &&
            roleQuery.data?.groupUser.isActive === 1
              ? true
              : false,
          isSubmitable: true,
        };
      } else {
        return {
          ...prevState,
          data: "",
          isSubmitable: false,
          isActive: true,
          isEditable: true,
        };
      }
    });
  }, [roleQuery.data, dataState.isEditable]);

  useEffect(() => {
    if (featureQuery.data !== undefined) {
      const featureData = {
        Booking: {
          group: "Booking",
          featName: "Lịch hẹn",
          children: [],
        },
        Examination: {
          group: "Examination",
          featName: "Ca khám",
          children: [],
        },
        Patient: {
          group: "Patient",
          featName: "Bệnh nhân",
          children: [],
          isCheckedAll: false,
        },
        Invoice: {
          group: "Invoice",
          featName: "Hóa đơn",
          children: [],
          isCheckedAll: false,
        },
        Report: {
          group: "Report",
          featName: "Báo cáo",
          children: [],
          isCheckedAll: false,
        },
        User: {
          group: "User",
          featName: "Người dùng",
          children: [],
          isCheckedAll: false,
        },
        Medicine: {
          group: "Medicine",
          featName: "Thuốc",
          children: [],
          isCheckedAll: false,
        },
        Principle: {
          group: "Principle",
          featName: "Quy định",
          children: [],
          isCheckedAll: false,
        },
      };

      featureQuery.data.map((feature) => {
        const isChecked =
          roleId &&
          roleQuery.data &&
          roleQuery.data.allAllowedPermissions.includes(feature.id);
        const mapFeature = { ...feature, isChecked };
        for (const groupPermission in allFeatures) {
          if (allFeatures[groupPermission].includes(mapFeature.loadedElement)) {
            featureData[groupPermission].children.push(mapFeature);
          }
        }

        for (const groupPermission in allFeatures) {
          let checkedCount = 0;
          featureData[groupPermission].children.map((feature) => {
            if (feature.isChecked === true) {
              checkedCount++;
            }
          });
          if (allFeatures[groupPermission].length === checkedCount) {
            featureData[groupPermission].isCheckedAll = true;
          }
        }
      });
      setPermissionState(() => {
        return featureData;
      });
    }
  }, [featureQuery.data, roleQuery.data, dataState.isEditable]);

  function changeHandler({ group, data }) {
    setPermissionState((prevState) => {
      return {
        ...prevState,
        [group]: data,
      };
    });
  }

  const addRoleMutate = useMutation({
    mutationFn: createGroup,
    onSuccess: (data) => {
      notiDialogRef.current.toastSuccess({ message: data.message });
      setTimeout(() => {
        navigate("/users/roles");
      }, 500);
    },
    onError: (data) => {
      notiDialogRef.current.toastError({ message: data.message });
    },
  });

  function submitHandler() {
    const form = formRef.current;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const groupName = data.groupname.trim();
    const allAllowedPermissions = [];
    for (const groupPermission in permissionState) {
      permissionState[groupPermission].children.map((permit) => {
        if (permit.isChecked === true) allAllowedPermissions.push(permit.id);
      });
    }

    addRoleMutate.mutate({ groupName, id: roleId, allAllowedPermissions });
  }

  function changeNameHandler(event) {
    event.preventDefault();
    const groupName = event.target.value;
    if (groupName.trim() !== "") {
      setDataState((prevState) => {
        return {
          ...prevState,
          data: groupName,
          isSubmitable: true,
        };
      });
    } else {
      setDataState((prevState) => {
        return {
          ...prevState,
          data: groupName,
          isSubmitable: false,
        };
      });
    }
  }

  function updateHandler() {
    setDataState((prevState) => {
      return {
        ...prevState,
        isEditable: true,
      };
    });
  }

  function cancelHandler() {
    if (roleId !== undefined)
      setDataState((prevState) => {
        return {
          ...prevState,
          isEditable: false,
        };
      });
    else {
      navigate("/users/roles");
    }
  }

  function backHandler() {
    navigate("/users/roles");
  }

  const error = useRouteError();
  if (auth.isPending) {
    return <></>;
  }
  if (!auth.isAuth || (auth.isAuth && !permission.includes("RUser"))) {
    throw error;
  }

  return (
    <div className="h-100 w-100 d-flex flex-row">
      <NotificationDialog ref={notiDialogRef} keyQuery={["member"]} />
      <div className="h-100 p-3" style={{ width: "30%" }}>
        <Card>
          <div className="position-relative">
            <span
              className="position-absolute back-btn"
              style={{ top: "0.4rem", left: "-1.9rem", padding: "1px" }}
              onClick={backHandler}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-arrow-left-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
              </svg>
            </span>
          </div>
          <Form className=" h-100 d-flex flex-column gap-3" ref={formRef}>
            <div className=" w-100  d-flex flex-row justify-content-around">
              {roleId && (
                <div className="col fw-bold fs-4 role-header">
                  <label>Chi tiết vai trò</label>
                </div>
              )}
              {!roleId && (
                <div className="col fw-bold fs-4 text-black role-header">
                  <label>Thêm mới vai trò</label>
                </div>
              )}
            </div>
            <div className=" w-100 h-100 d-flex flex-column gap-3">
              <div className="row">
                <label
                  htmlFor="groupname"
                  className="col-form-label fw-bold text-dark"
                >
                  Tên vai trò
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="groupname"
                  name="groupname"
                  onChange={changeNameHandler}
                  value={dataState.data || ""}
                  disabled={!dataState.isEditable}
                  required
                />
              </div>
              {dataState.isActive ? (
                dataState.isEditable ? (
                  <div className="d-flex gap-3 mt-3 justify-content-center">
                    <button
                      type="button"
                      className="btn btn-secondary shadow-sm"
                      style={{ minWidth: "100px" }}
                      onClick={cancelHandler}
                    >
                      hủy
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary  shadow-sm"
                      style={{ minWidth: "100px" }}
                      onClick={submitHandler}
                      disabled={!dataState.isSubmitable}
                    >
                      Lưu
                    </button>
                  </div>
                ) : (
                  <div className="d-flex gap-3 mt-3 justify-content-center">
                    <button
                      type="button"
                      className="btn btn-primary  shadow-sm"
                      style={{ minWidth: "100px" }}
                      onClick={updateHandler}
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                )
              ) : (
                <></>
              )}
            </div>
          </Form>
        </Card>
      </div>
      <div
        className="h-100 position-relative"
        style={{ width: "70%", padding: "1rem 1rem 1rem 0rem" }}
      >
        <Card className="w-100 h-100  rounded-3 bg-white">
          <div className="h-100 d-flex flex-column gap-3">
            <div className=" w-100 d-flex flex-row">
              <div className="fw-bold fs-4 title-section">
                <label>Phân quyền chi tiết</label>
              </div>
              <div className="feature-section">
                <div className="white-section"></div>
              </div>
            </div>
            <div className=" w-100 h-100 scroll gap-3">
              <PermissionArea
                data={permissionState.Booking}
                onChange={changeHandler}
                disabled={!dataState.isEditable}
              />
              <PermissionArea
                data={permissionState.Examination}
                onChange={changeHandler}
                disabled={!dataState.isEditable}
              />
              <PermissionArea
                data={permissionState.Patient}
                onChange={changeHandler}
                disabled={!dataState.isEditable}
              />
              <PermissionArea
                data={permissionState.Invoice}
                onChange={changeHandler}
                disabled={!dataState.isEditable}
              />
              <PermissionArea
                data={permissionState.Report}
                onChange={changeHandler}
                disabled={!dataState.isEditable}
              />
              <PermissionArea
                data={permissionState.User}
                onChange={changeHandler}
                disabled={!dataState.isEditable}
              />
              <PermissionArea
                data={permissionState.Medicine}
                onChange={changeHandler}
                disabled={!dataState.isEditable}
              />
              <PermissionArea
                data={permissionState.Principle}
                onChange={changeHandler}
                disabled={!dataState.isEditable}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default RoleDetail;
