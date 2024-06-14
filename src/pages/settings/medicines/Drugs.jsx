import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import {
  fetchAllDrugs,
  deleteDrugById,
  createNewDrug,
  fetchDrugById,
} from "../../../services/drugs";

import TableHeader from "../../../components/TableHeader";
import TableBody from "../../../components/TableBody";
import Card from "../../../components/Card";
import MainDialog from "../../../components/MainDialog";
import { fetchAllUnit } from "../../../services/units";
import NotificationDialog, {
  DialogAction,
} from "../../../components/NotificationDialog";
import { formatNumber } from "../../../util/money";
import useAuth from "../../../hooks/useAuth";
import { queryClient } from "../../../main";
import { useRouteError } from "react-router";
import { normalizeString } from "../../../util/compare";

function DrugTab() {
  const { auth } = useAuth();
  const permission = auth?.permission || [];
  const dialogRef = useRef();
  const notiDialogRef = useRef();
  const formRef = useRef();
  const [searchState, setSearchState] = useState({
    state: "1",
    textSearch: "",
  });
  const [dialogState, setDialogState] = useState({
    data: null,
    isEditable: true,
  });

  const unitsQuery = useQuery({
    queryKey: ["units"],
    queryFn: fetchAllUnit,
  });

  const drugsQuery = useQuery({
    queryKey: ["drugs"],
    queryFn: async () => {
      const data = await fetchAllDrugs();
      const normalizedTextSearch = normalizeString(searchState.textSearch);
      const searchWords = normalizedTextSearch.split(" ");

      const searchData = data.filter(
        (item) =>
          searchWords.every((word) =>
            normalizeString(item?.drugName).includes(word)
          ) && checkSearchState({ state: searchState.state, drug: item })
      );

      return searchData;
    },
  });

  const drugs = drugsQuery.data;

  function checkSearchState({ state, drug }) {
    if (state === "1") {
      return drug.isActive === 1 ? true : false;
    } else if (state === "2") {
      return drug.isActive === 0 ? true : false;
    } else {
      return true;
    }
  }

  const unitState = unitsQuery.data;

  function getUnitName({ id }) {
    if (unitState) {
      const res = unitState.filter((unit) => unit.id === id)[0];
      return res?.unitName || "";
    }
    return "";
  }

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
    queryClient.invalidateQueries({
      queryKey: ["drugs"],
    });
  }, [searchState]);

  async function editDrugHandler({ id, action }) {
    await dialogRef.current.edit({ id, action });
  }

  async function deActivateDrugHandler({ id, isActive }) {
    notiDialogRef.current.setDialogData({
      action: DialogAction.DELETE,
      dispatchFn: () => deleteDrugById({ id }),
    });
    if (isActive === 1) {
      notiDialogRef.current.showDialogWarning({
        message: "Xác nhận lưu trữ thuốc?",
      });
    } else {
      notiDialogRef.current.showDialogWarning({
        message: "Xác nhận kích hoạt thuốc?",
      });
    }
  }

  function changeFormHandler() {
    const formData = new FormData(formRef.current);
    const searchData = Object.fromEntries(formData);
    const textSearch = searchData.name.trim();
    const state = searchData.state;
    setSearchState({
      textSearch: textSearch,
      state: state,
    });
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
      <NotificationDialog ref={notiDialogRef} keyQuery={["drugs"]} />
      <Card className="w-100 h-100  rounded-3 bg-white">
        <div className="w-100 h-100 d-flex flex-column gap-3">
          <div className=" w-100  d-flex flex-row justify-content-around">
            <div className=" w-100 d-flex flex-row">
              <div className="fw-bold fs-4 title-section">
                <label>Thuốc</label>
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
                      <form
                        className="col"
                        onChange={changeFormHandler}
                        ref={formRef}
                      >
                        <div
                          className="row gap-3"
                          style={{ width: "fit-content" }}
                        >
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
                              placeholder="Tên thuốc"
                              aria-describedby="addon-wrapping"
                            />
                          </div>
                          <div className="col input-group flex-nowrap">
                            <select
                              className="form-select"
                              name="state"
                              defaultValue={1}
                            >
                              <option value="1">Còn bán</option>
                              <option value="2">Ngưng bán</option>
                              <option value="3">Tất cả</option>
                            </select>
                          </div>
                        </div>
                      </form>
                      <div style={{ width: "fit-content" }}>
                        <MainDialog
                          ref={dialogRef}
                          addFn={createNewDrug}
                          editFn={fetchDrugById}
                          onEdit={setData}
                          keyQuery={["drugs"]}
                          addButton={
                            permission?.includes("CDrug") ? true : false
                          }
                        >
                          <div className="row gap-3">
                            <div className="col">
                              <label
                                htmlFor="drugname"
                                className="col-form-label  text-dark"
                              >
                                Tên thuốc
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="drugname"
                                name="drugname"
                                defaultValue={dialogState.data?.drugName ?? ""}
                                disabled={!dialogState.isEditable}
                                required
                              />
                            </div>
                            <div className="col">
                              <label
                                htmlFor="note"
                                className="col-form-label  text-dark"
                              >
                                Hoạt chất
                              </label>
                              <input
                                className="form-control"
                                id="note"
                                name="note"
                                defaultValue={dialogState.data?.note ?? ""}
                                disabled={!dialogState.isEditable}
                                required
                              ></input>
                            </div>
                          </div>
                          <div className="row gap-3">
                            <div className="col">
                              <label
                                htmlFor="count"
                                className="col-form-label  text-dark"
                              >
                                Số lượng
                              </label>
                              <input
                                className="form-control"
                                id="count"
                                name="count"
                                type="number"
                                step="1"
                                min="0"
                                defaultValue={dialogState.data?.count ?? ""}
                                disabled={!dialogState.isEditable}
                                required
                              ></input>
                            </div>
                            <div className="col">
                              <label
                                htmlFor="diagnostic"
                                className="col-form-label fw-bold  text-dark"
                              >
                                Đơn vị
                              </label>
                              <select
                                className="form-select"
                                name="unitid"
                                id="unitid"
                                required
                                disabled={!dialogState.isEditable}
                                defaultValue={dialogState.data?.unitId ?? ""}
                              >
                                {unitState &&
                                  unitState.map((unit) => {
                                    return (
                                      <option key={unit.id} value={unit.id}>
                                        {unit.unitName}
                                      </option>
                                    );
                                  })}
                              </select>
                            </div>
                            <div className="col">
                              <label
                                htmlFor="price"
                                className="col-form-label  text-dark"
                              >
                                Giá bán
                              </label>
                              <input
                                className="form-control"
                                id="price"
                                name="price"
                                type="number"
                                min="0"
                                defaultValue={dialogState.data?.price ?? ""}
                                disabled={!dialogState.isEditable}
                                required
                              ></input>
                            </div>
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
              <div className="text-start" style={{ width: "14%" }}>
                Tên
              </div>
              <div className="text-start" style={{ width: "15%" }}>
                Hoạt chất
              </div>
              <div className="text-start" style={{ width: "15%" }}>
                Số lượng
              </div>
              <div className="text-start" style={{ width: "15%" }}>
                Đơn vị
              </div>
              <div className="text-start" style={{ width: "15%" }}>
                Giá bán
              </div>
              <div className="text-start" style={{ width: "10%" }}>
                Trạng thái
              </div>
              <div className="text-end" style={{ width: "10%" }}>
                Thao tác
              </div>
              <div className="text-start" style={{ width: "1%" }}></div>
            </TableHeader>
            <TableBody>
              {drugs && drugs.length > 0 ? (
                drugs.map((drug, index) => {
                  return (
                    <li
                      className=" dropdown-center list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                      key={drug.id}
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
                        style={{ width: "15%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {drug.drugName}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "15%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {drug.note}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "15%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {drug.count}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "15%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {getUnitName({ id: drug.unitId })}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "15%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {formatNumber(drug.price)}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "10%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <span
                          className={
                            drug.isActive === 1
                              ? "badge bg-success"
                              : "badge bg-danger"
                          }
                        >
                          {drug.isActive === 1 ? "Còn bán" : "Ngưng bán"}
                        </span>
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
                            editDrugHandler({ id: drug.id, action: "view" })
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
                        {permission?.includes("UDrug") &&
                          drug.isActive === 1 && (
                            <span
                              className="p-2"
                              onClick={() =>
                                editDrugHandler({ id: drug.id, action: "edit" })
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
                        {permission?.includes("DDrug") && (
                          <span
                            className="p-2   action-red-btn"
                            onClick={() =>
                              deActivateDrugHandler({
                                id: drug.id,
                                isActive: drug.isActive,
                              })
                            }
                          >
                            {drug.isActive === 1 ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-arrow-down-short position-absolute top-50 translate-middle"
                                  style={{ marginTop: "-3px" }}
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4" />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  style={{ marginTop: "1px" }}
                                  className="bi bi-inbox-fill position-absolute top-50 translate-middle"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm-1.17-.437A1.5 1.5 0 0 1 4.98 3h6.04a1.5 1.5 0 0 1 1.17.563l3.7 4.625a.5.5 0 0 1 .106.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374z" />
                                </svg>
                              </>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-arrow-counterclockwise"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z" />
                                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
                              </svg>
                            )}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })
              ) : (
                <div className="position-relative w-100 h-100">
                  <h5 className="position-absolute top-50 start-50 translate-middle fw-bold text-dark">
                    Không có thuốc
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

export default DrugTab;
