import { createSlice } from "@reduxjs/toolkit";

const slidesSlice = createSlice({
  name: "slides",
  initialState: {
    list: [{ id: 1, lines: [] }],
    activeIndex: 0,
  },
  reducers: {
    addSlide(state) {
      state.list.push({
        id: state.list.length + 1,
        lines: [],
      });
      state.activeIndex = state.list.length - 1;
    },
    setActiveSlide(state, action) {
      state.activeIndex = action.payload;
    },
    updateLines(state, action) {
      state.list[state.activeIndex].lines = action.payload;
    },
  },
});

export const { addSlide, setActiveSlide, updateLines } =
  slidesSlice.actions;

export default slidesSlice.reducer;
