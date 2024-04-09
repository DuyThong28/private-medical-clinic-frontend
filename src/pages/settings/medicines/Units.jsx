import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createNewUnit,
  deleteUnit,
  fetchAllUnit,
} from "../../../services/units";
import { queryClient } from "../../../App";
import { useState } from "react";
import { Modal } from "react-bootstrap";

function UnitsTab() {
  const unitsQuery = useQuery({
    queryKey: ["units"],
    queryFn: fetchAllUnit,
  });

  const [unitData, setUnitData] = useState(null);
  const [show, setShow] = useState(false);
  const [modalState, setModalState] = useState({
    header: "",
    isEditable: true,
  });

  const units = unitsQuery.data;

  const addUnitMutate = useMutation({
    mutationFn: createNewUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      setShow(() => {
        setUnitData(() => {
          return null;
        });
        return false;
      });
    },
  });

  function submitHandler(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    if (unitData !== null) data.id = unitData.id;
    addUnitMutate.mutate({ ...data });
  }

  function editUnitHandler({ unit, action }) {
    setUnitData(() => {
      return { ...unit };
    });
    if (action === "edit") {
      setModalState(() => {
        return { isEditable: true, header: "Chỉnh sửa thông tin" };
      });
    }
    if (action === "view") {
      setModalState(() => {
        return { isEditable: false, header: "Thông tin chi tiết" };
      });
    }
    setShow(true);
  }

  async function deleteUnitHandnler(id) {
    await deleteUnit({ id });
    queryClient.invalidateQueries({ queryKey: ["units"] });
  }

  function closeHandler() {
    setShow(() => {
      setUnitData(() => {
        return null;
      });
      return false;
    });
  }
  function showHandler() {
    setModalState(() => {
      return { isEditable: true, header: "Thêm mới" };
    });
    setShow(true);
  }

  return (
    <div className="h-100 w-100">
      <Modal
        show={show}
        onHide={closeHandler}
        style={{ height: "fit-content" }}
      >
        <Modal.Header closeButton style={{ height: "50px" }}>
          <Modal.Title>{modalState.header}</Modal.Title>
        </Modal.Header>
        <div tabIndex="-1">
          <div className="modal-body">
            <form onSubmit={submitHandler}>
              <div className="mb-3">
                <label htmlFor="fullname" className="col-form-label">
                  Tên đơn vị
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="unitname"
                  name="unitname"
                  defaultValue={unitData?.unitName ?? ""}
                  disabled={!modalState.isEditable}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={closeHandler}
                >
                  Đóng
                </button>
                {modalState.isEditable && (
                  <button type="submit" className="btn btn-primary">
                    Lưu
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </Modal>
      <div className="w-100 h-100 d-flex flex-column">
        <div className="w-100  d-flex flex-row justify-content-around my-4">
          <div className="col fw-bold fs-4">
            <label>Đơn vị</label>
          </div>
          <div className="col">
            <button
              className="col btn btn-primary float-end fw-bold"
              onClick={showHandler}
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
        </div>

        <div className=" w-100 h-100 shadow border rounded-4 p-3 bg-white">
          <div className="w-100 h-100 ">
            <table className="table table-hover w-100">
              <thead className="w-100">
                <tr>
                  <th
                    style={{
                      color: "#1B59F8",
                      backgroundColor: "#E8EEFE",
                    }}
                  >
                    Tên
                  </th>
                  <th
                    className="text-center"
                    style={{
                      width: "20%",
                      color: "#1B59F8",
                      backgroundColor: "#E8EEFE",
                    }}
                  ></th>
                </tr>
              </thead>
              <tbody>
                {units &&
                  units.map((unit) => {
                    return (
                      <tr key={unit.id}>
                        <td className="text-left fw-bold"> {unit.unitName}</td>
                        <td className="text-end">
                          <span
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
                          </span>
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
                              fill="#1B59F8"
                              className="bi bi-pencil-square"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                            </svg>
                          </span>
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
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnitsTab;
