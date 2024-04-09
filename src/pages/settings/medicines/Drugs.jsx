import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchAllDrugs,
  createNewDrug,
  fetchDrugById,
  deleteDrugById,
} from "../../../services/drugs";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { queryClient } from "../../../App";

function DrugTab() {
  const [drugData, setDrugData] = useState(null);
  const [show, setShow] = useState(false);
  const [modalState, setModalState] = useState({
    header: "",
    isEditable: true,
  });

  const drugsQuery = useQuery({
    queryKey: ["drugs"],
    queryFn: fetchAllDrugs,
  });

  const addDrugMutate = useMutation({
    mutationFn: createNewDrug,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drugs"] });
      setShow(() => {
        setDrugData(() => {
          return null;
        });
        return false;
      });
    },
  });

  const drugs = drugsQuery.data;

  function submitHandler(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    console.log("this is all data", data);
    if (drugData !== null) {
      data.id = drugData.id;
    }
    addDrugMutate.mutate({ ...data });
  }

  async function editDrugHandler({ id, action }) {
    const data = await fetchDrugById({ id });
    setDrugData(() => {
      return { ...data };
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

  async function deleteDrugHandler(id) {
    await deleteDrugById({ id });
    queryClient.invalidateQueries({ queryKey: ["drugs"] });
  }

  function closeHandler() {
    setShow(() => {
      setDrugData(() => {
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
      <Modal show={show} onHide={closeHandler}>
        <Modal.Header closeButton style={{ height: "50px" }}>
          <Modal.Title>{modalState.header}</Modal.Title>
        </Modal.Header>
        <div tabIndex="-1">
          <div className="modal-body fw-bold">
            <form onSubmit={submitHandler}>
              <div className="mb-3">
                <label htmlFor="drugname" className="col-form-label">
                  Tên thuốc
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="drugname"
                  name="drugname"
                  defaultValue={drugData?.drugName ?? ""}
                  disabled={!modalState.isEditable}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="col-form-label">
                  Giá bán
                </label>
                <input
                  className="form-control"
                  id="price"
                  name="price"
                  defaultValue={drugData?.price ?? ""}
                  disabled={!modalState.isEditable}
                ></input>
              </div>
              <div className="mb-3">
                <label htmlFor="count" className="col-form-label">
                  Số lượng
                </label>
                <input
                  className="form-control"
                  id="count"
                  name="count"
                  defaultValue={drugData?.count ?? ""}
                  disabled={!modalState.isEditable}
                ></input>
              </div>
              <div className="mb-3">
                <label htmlFor="unitid" className="col-form-label">
                  Đơn vị
                </label>
                <input
                  className="form-control"
                  id="unitid"
                  name="unitid"
                  defaultValue={drugData?.unitId ?? ""}
                  disabled={!modalState.isEditable}
                ></input>
              </div>
              <div className="modal-footer jus">
                <button
                  type="button"
                  className="btn btn-secondary fw-bold"
                  data-bs-dismiss="modal"
                  onClick={closeHandler}
                >
                  Đóng
                </button>
                {modalState.isEditable && (
                  <button type="submit" className="btn btn-primary fw-bold">
                    Lưu
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </Modal>

      <div className="w-100 h-100 d-flex  flex-column">
        <div className=" w-100 d-flex flex-row justify-content-around my-4">
          <div className="col fw-bold fs-4">
            <label>Thuốc</label>
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
          <div className="w-100 h-100 overflow-y-scroll">
            <table className="table table-hover w-100 h-100">
              <thead className="w-100">
                <tr>
                  <th
                    style={{
                      width: "25%",
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
                  >
                    Đơn vị
                  </th>
                  <th
                    className="text-center"
                    style={{
                      width: "20%",
                      color: "#1B59F8",
                      backgroundColor: "#E8EEFE",
                    }}
                  >
                    Giá bán
                  </th>
                  <th
                    className="text-center"
                    style={{
                      width: "20%",
                      color: "#1B59F8",
                      backgroundColor: "#E8EEFE",
                    }}
                  >
                    Số lượng
                  </th>
                  <th
                    className="text-end"
                    style={{ width: "15%", backgroundColor: "#E8EEFE" }}
                  ></th>
                </tr>
              </thead>
              <tbody>
                {drugs &&
                  drugs.map((drug) => {
                    return (
                      <tr key={drug.id}>
                        <td className="text-left fw-bold">{drug.drugName}</td>
                        <td className="text-center"> {drug.unitId}</td>
                        <td className="text-center">{drug.price}</td>
                        <td className="text-center">{drug.count}</td>
                        <td className="text-end">
                          <span
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
                          </span>
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
                            onClick={() => deleteDrugHandler(drug.id)}
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

export default DrugTab;
