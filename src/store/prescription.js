import { createSlice } from "@reduxjs/toolkit";

const prescriptionSlice = createSlice({
  name: "presctiption",
  initialState: [],
  reducers: {
    addDrug(state, action) {
      const drug = action.payload.drug;
      const existingDrug = state.filter((item) => {
        return item.id === drug.id;
      });
      if (existingDrug.length !== 0) return state;
      const newDrug = {
        ...drug,
        amount: 1,
      };
      const newPrescriptionData = [newDrug, ...state];
      return newPrescriptionData;
    },
    removeDrug(state, action) {
      const id = action.payload.id;
      const newPrescriptionData = state.filter((drug) => {
        return drug.id !== id;
      });
      return newPrescriptionData;
    },
    removeAll() {
      return [];
    },
    updateDrug(state, action) {
      const { type, id, value } = action.payload;
      if (type === "amount") {
        const newAmount = value;
        const newPrescriptionData = state.map((drug) => {
          if (drug.id === id) {
            return { ...drug, amount: newAmount };
          }
          return drug;
        });
        return newPrescriptionData;
      }

      if (type === "usage") {
        const newUsageId = value;
        const newPrescriptionData = state.map((drug) => {
          if (drug.id === id) {
            return { ...drug, usageId: newUsageId };
          }
          return drug;
        });
        return newPrescriptionData;
      }
      return state;
    },
  },
});

export default prescriptionSlice.reducer;

export const prescriptionAction = prescriptionSlice.actions;
