import { configureStore } from "@reduxjs/toolkit";
import diseaseSlice from "./diseases";
import unitSlice from "./units";
import usageSlice from "./usage";
import drugSlice from "./drug";
import prescriptionSlice from "./prescription";
import userSlice from "./user";

const store = configureStore({
  reducer: {
    unit: unitSlice,
    usage: usageSlice,
    disease: diseaseSlice,
    drug: drugSlice,
    prescription: prescriptionSlice,
    user: userSlice,
  },
});

export default store;
