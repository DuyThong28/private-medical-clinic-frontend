export async function createAppointmentRecord({
  patientId,
  appointmentListId,
  symptoms,
  diseaseId,
}) {
  const response = await fetch(
    "http://localhost:8080/api/v1/appointmentrecords",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
      body: JSON.stringify({
        patientId,
        appointmentListId,
        symptoms,
        diseaseId,
      }),
    }
  );

  if (!response.ok) {
    const error = new Error(
      "An error occurred while create appointment record"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function fetchAllAppointmentRecords() {
    const response = await fetch(
        "http://localhost:8080/api/v1/appointmentrecords"
      );
      if (!response.ok) {
        const error = new Error(
          "An error occurred while fetching  all appointment records"
        );
        error.code = response.status;
        error.info = await response.json();
        throw error;
      }
    
      const resData = await response.json();
      const data = resData.data;
      return data;
}
