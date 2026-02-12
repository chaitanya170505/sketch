import { configureStore } from "@reduxjs/toolkit";
import slidesReducer from "./slidesSlice";
import toolReducer from "./toolSlice";

export const store = configureStore({
  reducer: {
    slides: slidesReducer,
    tools: toolReducer,
  },
});
