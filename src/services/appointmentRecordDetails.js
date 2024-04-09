export async function createAppointmentRecordDetail({
  appointmentRecordId,
  drugId,
  count,
  usageId,
}) {
  console.log(
    "This is data i neww to create record",
    appointmentRecordId,
    drugId,
    count,
    usageId
  );
  const response = await fetch(
    "http://localhost:8080/api/v1/appointmentrecorddetails",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
      body: JSON.stringify({
        appointmentRecordId,
        drugId,
        count,
        usageId,
      }),
    }
  );

  if (!response.ok) {
    const error = new Error(
      "An error occurred while create appointment record detail"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}
