export async function fetchAllUsage() {
  const response = await fetch("http://localhost:8080/api/v1/usage", {
    headers: {
      authorization: "Bearer",
    }
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching all the diseases"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const usages = resData.data;
  return usages;
}

export async function createNewUsage(data) {
  const usageDes = data.usagedes;
  const usageId = data?.id ?? null;
  let response;

  if (usageId) {
    response = await fetch(`http://localhost:8080/api/v1/usage/${usageId}`, {
      method: "PUT",
      body: JSON.stringify({ usageDes }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    });
  } else {
    response = await fetch(`http://localhost:8080/api/v1/usage`, {
      method: "POST",
      body: JSON.stringify({ usageDes }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    });
  }

  if (!response.ok) {
    const error = new Error("An error occurred while creating the usage");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const usages = resData.data;
  return usages;
}

export async function deleteUsage({ id }) {
  const response = await fetch(`http://localhost:8080/api/v1/usage/${id}`, {
    method: "DELETE",
    headers: {
      authorization: "Bearer",
    }
  });

  if (!response.ok) {
    const error = new Error("An error occurred while deleting the usage");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}
