import { createSlice } from "@reduxjs/toolkit";
import { fetchAllDisease } from "../services/diseases";

// const initialState = localStorage.getItem("refreshToken")
//   ? await fetchAllDisease()
//   : [];

const diseaseSlice = createSlice({
  name: "disease",
  initialState: [],
  reducers: {
    async loadData(){
      const data = await fetchAllDisease() ?? [];
      return data;
    },
    remove(){
      return [];
    }
  },
});

export default diseaseSlice.reducer;

export const diseaseAction = diseaseSlice.actions;
