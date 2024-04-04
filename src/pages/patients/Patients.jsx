import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchAllPatients,
  addPatient,
  fetchPatientById,
  deletePatientById,
} from "../../services/patients";
import { Link } from "react-router-dom";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { queryClient } from "../../App";

function PatientsPage() {
  const [patientData, setPatientData] = useState(null);
  const [show, setShow] = useState(false);

  const patientsQuery = useQuery({
    queryKey: ["patients"],
    queryFn: fetchAllPatients,
  });

  const addPatientMutate = useMutation({
    mutationFn: addPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      setShow(() => {
        setPatientData(() => {
          return null;
        });
        return false;
      });
    },
  });

  const patients = patientsQuery.data;

  function submitHandler(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    if (patientData !== null) {
      data.id = patientData.id;
    }
    addPatientMutate.mutate({ ...data });
  }

  async function editPatientHandler(id) {
    const data = await fetchPatientById({ id });
    setPatientData(() => {
      return { ...data };
    });
    setShow(true);
  }

  async function deletePatientHandler(id) {
    await deletePatientById({ id });
    queryClient.invalidateQueries({ queryKey: ["patients"] });
  }

  function closeHandler() {
    setShow(() => {
      setPatientData(() => {
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
          <Modal.Title>Add New Patient</Modal.Title>
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
                  id="fullname"
                  name="fullname"
                  defaultValue={patientData?.fullName ?? ""}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="gender" className="col-form-label">
                  Gender
                </label>
                <input
                  className="form-control"
                  id="gender"
                  name="gender"
                  defaultValue={patientData?.gender ?? ""}
                ></input>
              </div>
              <div className="mb-3">
                <label htmlFor="birthyear" className="col-form-label">
                  Birth Year
                </label>
                <input
                  className="form-control"
                  id="birthyear"
                  name="birthyear"
                  defaultValue={patientData?.birthYear ?? ""}
                ></input>
              </div>
              <div className="mb-3">
                <label htmlFor="phonenumber" className="col-form-label">
                  Phone Number
                </label>
                <input
                  className="form-control"
                  id="phonenumber"
                  name="phonenumber"
                  defaultValue={patientData?.phoneNumber ?? ""}
                ></input>
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="col-form-label">
                  Address
                </label>
                <input
                  className="form-control"
                  id="address"
                  name="address"
                  defaultValue={patientData?.address ?? ""}
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
              <label htmlFor="patientname" className="form-label">
                Patient name
              </label>
              <input
                type="text"
                className="form-control"
                id="patientname"
                name="patientname"
              />
            </div>
            <div
              className="col d-flex flex-column"
              style={{
                display: "flex",
                "flex-direction": "column",
                height: "fit-content",
              }}
            >
              <label htmlFor="phonenumber" className="form-label">
                Phone number
              </label>
              <input
                type="text"
                className="form-control"
                id="phonenumber"
                name="phonenumber"
              />
            </div>
            <div
              className="col d-flex flex-column"
              style={{
                display: "flex",
                "flex-direction": "column",
                height: "fit-content",
              }}
            >
              <button
                type="button"
                className="btn btn-primary"
                onClick={showHandler}
              >
                Add Patient
              </button>
            </div>
          </div>

          <div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Patient name</th>
                  <th scope="col">phone number</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Birth Year</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {patients &&
                  patients.map((patient) => {
                    return (
                      <tr key={patient.id}>
                        <td>{patient.fullName}</td>
                        <td> {patient.phoneNumber}</td>
                        <td>{patient.gender}</td>
                        <td>{patient.birthYear}</td>
                        <td>
                          <Link to={`${patient.id}`}>View</Link>
                          <button
                            type="button"
                            onClick={() => editPatientHandler(patient.id)}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deletePatientHandler(patient.id)}
                          >
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

export default PatientsPage;
