import { createSlice } from "@reduxjs/toolkit";

const toolSlice = createSlice({
  name: "tools",
  initialState: {
    strokeColor: "#000000",
    strokeWidth: 2,
    bgColor: "#ffffff",
  },
  reducers: {
    setStrokeColor(state, action) {
      state.strokeColor = action.payload;
    },
    setStrokeWidth(state, action) {
      state.strokeWidth = action.payload;
    },
    setBgColor(state, action) {
      state.bgColor = action.payload;
    },
  },
});

export const {
  setStrokeColor,
  setStrokeWidth,
  setBgColor,
} = toolSlice.actions;

export default toolSlice.reducer;
