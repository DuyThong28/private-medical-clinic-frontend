export async function fetchAllFeatures() {
    const response = await fetch("http://localhost:8080/api/v1/features", {
      credentials: "include",
      headers: {
        authorization: "Bearer",
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = new Error("An error occurred while fetching  all feature");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
  
    const resData = await response.json();
    const data = resData.data;
    return data;
  }