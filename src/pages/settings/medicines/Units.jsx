import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";

import {
  createNewUnit,
  deleteUnit,
  fetchAllUnit,
} from "../../../services/units";

import TableHeader from "../../../components/TableHeader";
import TableBody from "../../../components/TableBody";
import Card from "../../../components/Card";
import MainDialog from "../../../components/MainDialog";
import NotificationDialog, {
  DialogAction,
} from "../../../components/NotificationDialog";
import useAuth from "../../../hooks/useAuth";
import { useRouteError } from "react-router";
import { normalizeString } from "../../../util/compare";

function UnitsTab() {
  const { auth } = useAuth();
  const permission = auth?.permission || [];
  const dialogRef = useRef();
  const notiDialogRef = useRef();
  const [dialogState, setDialogState] = useState({
    data: null,
    isEditable: true,
  });
  const [listState, setListState] = useState([]);

  const unitsQuery = useQuery({
    queryKey: ["units"],
    queryFn: fetchAllUnit,
  });
  const units = unitsQuery.data;

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
    setListState(() => units);
  }, [units]);

  function searchHandler(event) {
    const textSearch = event.target.value.toLowerCase().trim();
    const normalizedTextSearch = normalizeString(textSearch);
    const searchWords = normalizedTextSearch.split(" ");

    const result = units.filter((unit) =>
      searchWords.every((word) => normalizeString(unit.unitName).includes(word))
    );

    setListState(() => result);
  }

  function editUnitHandler({ unit, action }) {
    dialogRef.current.edit({ action, data: unit });
  }

  const error = useRouteError();
  if (auth.isPending) {
    return <></>;
  }
  if (!auth.isAuth || (auth.isAuth && !permission.includes("RDrug"))) {
    throw error;
  }

  return (
    <div className="h-100 w-100 p-3">
      <NotificationDialog ref={notiDialogRef} keyQuery={["units"]} />
      <Card className="w-100 h-100  rounded-3 bg-white">
        <div className="w-100 h-100 d-flex flex-column gap-3">
          <div className=" w-100  d-flex flex-row justify-content-around">
            <div className=" w-100 d-flex flex-row">
              <div className="fw-bold fs-4 title-section">
                <label>Đơn vị</label>
              </div>
              <div className="feature-section">
                <div className="white-section">
                  <div
                    className="d-flex flex-row gap-3 float-end position-absolute top-50"
                    style={{
                      right: "1rem",
                      transform: "translate(0%, -50%)",
                    }}
                  >
                    {" "}
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
                          placeholder="Đơn vị"
                          aria-describedby="addon-wrapping"
                          onInput={searchHandler}
                        />
                      </div>
                      <div style={{ width: "fit-content" }}>
                        <MainDialog
                          ref={dialogRef}
                          addFn={createNewUnit}
                          keyQuery={["units"]}
                          onEdit={setData}
                          addButton={
                            permission?.includes("CDrug") ? true : false
                          }
                        >
                          <div className="mb-3">
                            <label
                              htmlFor="drugname"
                              className="col-form-label  text-dark"
                            >
                              Đơn vị
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="unitname"
                              name="unitname"
                              defaultValue={dialogState.data?.unitName ?? ""}
                              disabled={!dialogState.isEditable}
                            />
                          </div>
                        </MainDialog>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className=" w-100 h-100 overflow-hidden d-flex flex-column"
            style={{ padding: "0rem 1rem 1rem 1rem" }}
          >
            <TableHeader>
              <div className="text-start" style={{ width: "5%" }}>
                STT
              </div>
              <div className="text-start" style={{ width: "84%" }}>
                Đơn vị
              </div>
              <div className="text-end" style={{ width: "10%" }}>
                Thao tác
              </div>
              <div className="text-start" style={{ width: "1%" }}></div>
            </TableHeader>
            <TableBody>
              {listState && listState.length > 0 ? (
                listState.map((unit) => {
                  return (
                    <li
                      className=" dropdown-center list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                      key={unit.id}
                    >
                      <div
                        className="text-start"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{ width: "5%" }}
                      >
                        {listState.indexOf(unit) + 1}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "85%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {unit.unitName}
                      </div>

                      <div
                        className="text-end"
                        style={{ width: "10%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {/* <span
                          className="p-2"
                          onClick={() =>
                            editUnitHandler({ unit, action: "view" })
                          }
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
                        </span> */}
                        {permission?.includes("UDrug") && (
                          <span
                            className="p-2"
                            onClick={() =>
                              editUnitHandler({ unit, action: "edit" })
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#646565"
                              className="bi bi-pencil-square"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                            </svg>
                          </span>
                        )}
                        {/* {permission?.includes("DDrug") && (
                          <span
                            className="p-2"
                            onClick={() => deleteUnitHandnler(unit.id)}
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
                })
              ) : (
                <div className="position-relative w-100 h-100">
                  <h5 className="position-absolute top-50 start-50 translate-middle fw-bold text-dark">
                    Không có đơn vị
                  </h5>
                </div>
              )}
            </TableBody>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default UnitsTab;
