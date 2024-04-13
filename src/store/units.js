import { createSlice } from "@reduxjs/toolkit";
import { fetchAllUnit } from "../services/units";

const initialState = (await fetchAllUnit()) || [];

const unitSlice = createSlice({
  name: "unit",
  initialState: initialState,
  reducers: {},
});

export default unitSlice.reducer;

export const unitAction = unitSlice.actions;
