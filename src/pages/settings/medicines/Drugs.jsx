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

  async function editDrugHandler(id) {
    const data = await fetchDrugById({ id });
    console.log("this is drug by id", data);
    setDrugData(() => {
      return { ...data };
    });
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
    setShow(true);
  }

  return (
    <>
      <Modal show={show} onHide={closeHandler}>
        <Modal.Header closeButton style={{ height: "50px" }}>
          <Modal.Title>Add New Drug</Modal.Title>
        </Modal.Header>
        <div tabIndex="-1">
          <div className="modal-body">
            <form onSubmit={submitHandler}>
              <div className="mb-3">
                <label htmlFor="drugname" className="col-form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="drugname"
                  name="drugname"
                  defaultValue={drugData?.drugName ?? ""}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="col-form-label">
                  Price
                </label>
                <input
                  className="form-control"
                  id="price"
                  name="price"
                  defaultValue={drugData?.price ?? ""}
                ></input>
              </div>
              <div className="mb-3">
                <label htmlFor="count" className="col-form-label">
                  Count
                </label>
                <input
                  className="form-control"
                  id="count"
                  name="count"
                  defaultValue={drugData?.count ?? ""}
                ></input>
              </div>
              <div className="mb-3">
                <label htmlFor="unitid" className="col-form-label">
                  Unit Id
                </label>
                <input
                  className="form-control"
                  id="unitid"
                  name="unitid"
                  defaultValue={drugData?.unitId ?? ""}
                ></input>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={closeHandler}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      <div className="d-flex flex-row">
        <div style={{ height: "100px" }}>
          <div className="row g-3">
            <div
              className="col d-flex flex-column"
              style={{
                display: "flex",
                "flex-direction": "column",
                height: "fit-content",
              }}
            >
              <label htmlFor="drugname" className="form-label">
                Drug name
              </label>
              <input
                type="text"
                className="form-control"
                id="drugname"
                name="drugname"
              />
            </div>
            <div className="col d-flex flex-column input">
              <button
                type="button"
                className="btn btn-primary"
                onClick={showHandler}
              >
                Add Drug
              </button>
            </div>
          </div>

          <div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Unit id</th>
                  <th scope="col">Price</th>
                  <th scope="col">Count</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {drugs &&
                  drugs.map((drug) => {
                    return (
                      <tr key={drug.id}>
                        <td>{drug.drugName}</td>
                        <td> {drug.unitId}</td>
                        <td>{drug.price}</td>
                        <td>{drug.count}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => editDrugHandler(drug.id)}
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => editDrugHandler(drug.id)}
                          >
                            Edit
                          </button>
                          <button onClick={() => deleteDrugHandler(drug.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default DrugTab;
