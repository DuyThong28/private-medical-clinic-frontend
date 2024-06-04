import { useNavigate, useParams, useRouteError } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Card from "../../components/Card";
import HistoryTab from "../settings/examination/HistoryTab";

import { fetchPatientById } from "../../services/patients";
import MainInput from "../../components/MainInput";
import useAuth from "../../hooks/useAuth";

export default function PatientDetail() {
  const { patientId } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const permission = auth?.permission || [];
  const [dataState, setDataState] = useState({
    data: null,
    isEditable: true,
  });

  const patientDetailQuery = useQuery({
    queryKey: ["patientDetail", patientId],
    queryFn: () => fetchPatientById({ id: patientId }),
  });

  useEffect(() => {
    setDataState((prevState) => {
      return {
        ...prevState,
        data: patientDetailQuery.data,
      };
    });
  }, [patientId, patientDetailQuery.data]);

  function backHandler() {
    navigate("/patients");
  }

  const error = useRouteError();
  if (auth.isPending) {
    return <></>;
  }
  if (!auth.isAuth || (auth.isAuth && !permission.includes("RPatient"))) {
    throw error;
  }

  return (
    <div className="p-3 h-100">
      <Card>
      <div className="position-relative">
          <span
            className="position-absolute back-btn"
            style={{ top: "0.4rem", left: "-1.9rem", padding: "1px" }}
            onClick={backHandler}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              fill="currentColor"
              className="bi bi-arrow-left-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
            </svg>
          </span>
        </div>
        <Form className="w-100 h-100 d-flex flex-column  gap-3">
          {permission?.includes("RPatient") && (
            <div className="gap-3 row">
              <div className="col">
                <div className="row gap-3">
                  <MainInput
                    name={"patientid"}
                    isEditable={false}
                    defaultValue={dataState.data && dataState.data.id}
                    label={"Mã bệnh nhân"}
                  />
                  <MainInput
                    name={"fullname"}
                    isEditable={false}
                    defaultValue={dataState.data && dataState.data.fullName}
                    label={"Tên bệnh nhân"}
                  />

                  <MainInput
                    name={"phonenumber"}
                    isEditable={false}
                    defaultValue={dataState.data && dataState.data.phoneNumber}
                    label={"Số điện thoại"}
                  />
                </div>
                <div className="row gap-3">
                  <MainInput
                    name={"gender"}
                    isEditable={false}
                    defaultValue={dataState.data && dataState.data.gender}
                    label={"Giới tính"}
                  />
                  <MainInput
                    name={"birthyear"}
                    isEditable={false}
                    defaultValue={dataState.data && dataState.data.birthYear}
                    label={"Năm sinh"}
                  />
                  <MainInput
                    name={"address"}
                    isEditable={false}
                    defaultValue={dataState.data && dataState.data.address}
                    label={"Địa chỉ"}
                  />
                </div>
              </div>
            </div>
          )}

          {permission?.includes("RRecord") && (
            <div className="w-100 h-100 overflow-hidden">
              <HistoryTab isEditable={true} />
            </div>
          )}
        </Form>
      </Card>
    </div>
  );
}
