import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../App";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import {
  createNewUsage,
  deleteUsage,
  fetchAllUsage,
} from "../../../services/usage";

function UsagesTab() {
  const usageQuery = useQuery({
    queryKey: ["usages"],
    queryFn: fetchAllUsage,
  });

  const [usageData, setUsageData] = useState(null);
  const [show, setShow] = useState(false);

  const usages = usageQuery.data;

  const addUnitMutate = useMutation({
    mutationFn: createNewUsage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usages"] });
      setShow(() => {
        setUsageData(() => {
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
    if (usageData !== null) data.id = usageData.id;
    addUnitMutate.mutate({ ...data });
  }

  function editUnitHandler(data) {
    setUsageData(() => {
      return { ...data };
    });
    setShow(true);
  }

  async function deleteUnitHandnler(id) {
    await deleteUsage({ id });
    queryClient.invalidateQueries({ queryKey: ["usages"] });
  }

  function closeHandler() {
    setShow(() => {
      setUsageData(() => {
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
          <Modal.Title>Add New Usage</Modal.Title>
        </Modal.Header>
        <div tabIndex="-1">
          <div className="modal-body">
            <form onSubmit={submitHandler}>
              <div className="mb-3">
                <label htmlFor="fullname" className="col-form-label">
                  Description
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="usagedes"
                  name="usagedes"
                  defaultValue={usageData?.usageDes ?? ""}
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
              Add Usage
            </button>
          </div>
        </div>

        <div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {usages &&
                usages.map((usage) => {
                  return (
                    <tr key={usage.id}>
                      <td> {usage.usageDes}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => editUnitHandler(usage)}
                        >
                          Edit
                        </button>
                        <button onClick={() => deleteUnitHandnler(usage.id)}>
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

export default UsagesTab;
