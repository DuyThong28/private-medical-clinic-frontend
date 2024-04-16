import { createSlice } from "@reduxjs/toolkit";
import { fetchAllDrugs } from "../services/drugs";

// const initialState = localStorage.getItem("refreshToken")
//   ? await fetchAllDrugs()
//   : [];

const drugSlice = createSlice({
  name: "drug",
  initialState: [],
  reducers: {
    async loadData(){
      const data = await fetchAllDrugs() ?? [];
      return data;
    },
    remove(){
      return [];
    }
  },
});

export default drugSlice.reducer;

export const drugAction = drugSlice.actions;
