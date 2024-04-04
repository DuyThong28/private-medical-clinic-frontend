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

  function editUnitHandler(data) {
    setUnitData(() => {
      return { ...data };
    });
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
    setShow(true);
  }

  return (
    <>
      <Modal
        show={show}
        onHide={closeHandler}
        style={{ height: "fit-content" }}
      >
        <Modal.Header closeButton style={{ height: "50px" }}>
          <Modal.Title>Add New Unit</Modal.Title>
        </Modal.Header>
        <div tabIndex="-1">
          <div className="modal-body">
            <form onSubmit={submitHandler}>
              <div className="mb-3">
                <label htmlFor="fullname" className="col-form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="unitname"
                  name="unitname"
                  defaultValue={unitData?.unitName ?? ""}
                />
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
        <div className="list">
          <div className="col d-flex flex-column input">
            <button
              type="button"
              className="btn btn-primary"
              onClick={showHandler}
            >
              Add Uint
            </button>
          </div>
        </div>

        <div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Unit name</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {units &&
                units.map((unit) => {
                  return (
                    <tr key={unit.id}>
                      <td> {unit.unitName}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => editUnitHandler(unit)}
                        >
                          Edit
                        </button>
                        <button onClick={() => deleteUnitHandnler(unit.id)}>
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
    </>
  );
}

export default UnitsTab;
