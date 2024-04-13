export async function fetchAllPatients() {
  const response = await fetch("http://localhost:8080/api/v1/patients", {
    credentials: "include",
    headers: {
      authorization: "Bearer ",
    },
  });

  if (!response.ok) {
    throw new Error("can not fetch all patients");
  }

  const resData = await response.json();
  const patients = resData.data;
  return patients;
}

export async function addPatient(patientData) {
  const fullName = patientData.fullname;
  const address = patientData.address;
  const birthYear = patientData.birthyear;
  const gender = patientData.gender;
  const phoneNumber = patientData.phonenumber;
  const patientID = patientData?.id ?? null;
  let response;

  if (patientID) {
    response = await fetch(
      "http://localhost:8080/api/v1/patients/" + patientID,
      {
        method: "PUT",
        headers: {
          authorization: "Bearer",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          address,
          birthYear,
          gender,
          phoneNumber,
        }),
      }
    );
  } else {
    response = await fetch("http://localhost:8080/api/v1/patients", {
      method: "POST",
      headers: {
        authorization: "Bearer",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        address,
        birthYear,
        gender,
        phoneNumber,
      }),
    });
  }

  if (!response.ok) {
    throw new Error("can not fetch all patients");
  }

  const resData = await response.json();
  return resData;
}

export async function fetchPatientById({ id }) {
  const response = await fetch(`http://localhost:8080/api/v1/patients/${id}`);
  if (!response.ok) {
    if (!response.ok) {
      throw new Error("can not fetch all patients");
    }
  }
  const resData = await response.json();
  const patientData = resData.data;
  console.log("This is http id patient data", patientData);
  return patientData;
}

export async function deletePatientById({ id }) {
  const response = await fetch(`http://localhost:8080/api/v1/patients/${id}`, {
    method: "DELETE",
    headers: {
      authorization: "Bearer",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("can not delete patient");
  }

  return response.json();
}
