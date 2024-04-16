import { createSlice } from "@reduxjs/toolkit";
import { fetchAllUnit } from "../services/units";

// const initialState = localStorage.getItem("refreshToken")? (await fetchAllUnit()) : [];

const unitSlice = createSlice({
  name: "unit",
  initialState: [],
  reducers: {
    async loadData(){
      const data = await fetchAllUnit() ?? [];
      return data;
    },
    remove(){
      return [];
    }
  },
});

export default unitSlice.reducer;

export const unitAction = unitSlice.actions;
