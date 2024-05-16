export async function createGroup({ groupName, allAllowedPermissions, id }) {
  let response;

  if (id) {
    response = await fetch(`http://localhost:8080/api/v1/usergroups/${id}`, {
      credentials: "include",
      method: "PUT",
      body: JSON.stringify({ groupName, allAllowedPermissions }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    });

    if (!response.ok) {
      const error = new Error("Cập nhật thất bại");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
    const resData = await response.json();
    const finalData = { ...resData.data };
    finalData.message = "Cập nhật thành công";
    return finalData;
  } else {
    response = await fetch(`http://localhost:8080/api/v1/usergroups`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ groupName, allAllowedPermissions }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    });

    if (!response.ok) {
      const error = new Error("Thêm vai trò thất bại");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
    const resData = await response.json();
    const finalData = { ...resData.data };
    finalData.message = "Thêm vai trò thành công";
    return finalData;
  }
}

export async function fetchAllGroups() {
  const response = await fetch("http://localhost:8080/api/v1/usergroups", {
    credentials: "include",
    headers: {
      authorization: "Bearer",
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const error = new Error("An error occurred while fetching  all Groups");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function fetchGroupById({ id }) {
  const response = await fetch(
    `http://localhost:8080/api/v1/usergroups/${id}`,
    {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    }
  );
  if (!response.ok) {
    const error = new Error("An error occurred while fetching  Group");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function deleteGroupById({ id }) {
  const response = await fetch(
    `http://localhost:8080/api/v1/usergroups/${id}`,
    {
      credentials: "include",
      method: "DELETE",
      headers: {
        authorization: "Bearer",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = new Error("Xóa vai trò thất bại");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = { ...resData.data };
  data.message = "Xóa vai trò thành công";
  return data;
}
