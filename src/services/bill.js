export async function createBill(data) {
  const bill = {
    patientId: data?.patientId,
    appointmentListId: data?.appointmentListId,
    drugExpense: data?.drugExpense,
  };

  const billId = data?.id ?? null;
  let response;

  if (billId) {
    response = await fetch(`http://localhost:8080/api/v1/bills/${billId}`, {
      Credentials: "include",
      method: "PUT",
      body: JSON.stringify({ bill }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    });
  } else {
    response = await fetch(
      `http://localhost:8080/http://localhost:8080/api/v1/bills`,
      {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({ bill }),
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer",
        },
      }
    );

    if (!response.ok) {
      const error = new Error("An error occurred while create bill");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const resData = await response.json();
    const data = resData.data;
    return data;
  }
}

export async function fetchAllBills() {
  const response = await fetch("http://localhost:8080/api/v1/bills", {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer",
    },
  });
  if (!response.ok) {
    const error = new Error("An error occurred while fetching  all bills");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function fetchBillById({ id }) {
  const response = await fetch(`http://localhost:8080/api/v1/bills/${id}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer",
    },
  });
  if (!response.ok) {
    const error = new Error("An error occurred while fetching  bill");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function deleteBillById({ id }) {
  const response = await fetch(`http://localhost:8080/api/v1/bills/${id}`, {
    credentials: "include",
    method: "DELETE",
    headers: {
      authorization: "Bearer",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while deleting bill");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}
