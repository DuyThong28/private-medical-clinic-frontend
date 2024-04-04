import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createNewDisease,
  deleteDisease,
  fetchAllDisease,
} from "../../../services/diseases";
import { queryClient } from "../../../App";
import { useState } from "react";
import { Modal } from "react-bootstrap";

function DiseasesTab() {
  const diseasesQuery = useQuery({
    queryKey: ["diseases"],
    queryFn: fetchAllDisease,
  });

  const [diseaseData, setDiseaseData] = useState(null);
  const [show, setShow] = useState(false);

  const diseases = diseasesQuery.data;

  const addDiseaseMutate = useMutation({
    mutationFn: createNewDisease,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diseases"] });
      setShow(() => {
        setDiseaseData(() => {
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
    if (diseaseData !== null) data.id = diseaseData.id;
    addDiseaseMutate.mutate({ ...data });
  }

  function editDiseaseHandler(data) {
    setDiseaseData(() => {
      return { ...data };
    });
    setShow(true);
  }

  async function deleteDiseaseHandnler(id) {
    await deleteDisease({ id });
    queryClient.invalidateQueries({ queryKey: ["diseases"] });
  }

  function closeHandler() {
    setShow(() => {
      setDiseaseData(() => {
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
          <Modal.Title>Add New Disease</Modal.Title>
        </Modal.Header>
        <div tabIndex="-1">
          <div className="modal-body">
            <form onSubmit={submitHandler}>
              <div className="mb-3">
                <label htmlFor="diseasename" className="col-form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="diseasename"
                  name="diseasename"
                  defaultValue={diseaseData?.diseaseName ?? ""}
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
              Add Disease
            </button>
          </div>
        </div>

        <div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {diseases &&
                diseases.map((disease) => {
                  return (
                    <tr key={disease.id}>
                      <td> {disease.diseaseName}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => editDiseaseHandler(disease)}
                        >
                          Edit
                        </button>
                        <button onClick={() => deleteDiseaseHandnler(disease.id)}>
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

export default DiseasesTab;
