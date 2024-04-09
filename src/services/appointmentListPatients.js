import { createAppointmentList } from "./appointmentList";
import { addPatient } from "./patients";

export async function fetchAllAppointmentListPatients() {
  const response = await fetch(
    "http://localhost:8080/api/v1/appointmentlistpatients"
  );
  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching  all appointment list patients"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function createAppointmentPatientList({
  scheduledate,
  patientInfo,
}) {
  const appointmentListData = await createAppointmentList({
    scheduledate,
  });
  console.log("This is appointmnetdata", appointmentListData);
  const patientData = await addPatient(patientInfo);
  console.log("this is paitent data", patientData);

  const patientId = patientData.id;
  const appointmentListId = appointmentListData.id;
  console.log("This is all data", patientId, appointmentListId);
  const response = await fetch(
    "http://localhost:8080/api/v1/appointmentlistpatients",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
      body: JSON.stringify({ patientId, appointmentListId }),
    }
  );

  if (!response.ok) {
    const error = new Error(
      "An error occurred while create appointment patient list"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function fetchAppointentListPatientById({ id }) {
  const response = await fetch(
    `http://localhost:8080/api/v1/appointmentlistpatients/${id}`
  );
  if (!response.ok) {
    if (!response.ok) {
      throw new Error("can not fetch appointment list patient");
    }
  }
  const resData = await response.json();
  const data = resData.data;
  return data;
}
