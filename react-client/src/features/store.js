import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { authReducer, singleProjectReducer, allProjectsReducer, playAllReducer } from "./";

const store = configureStore({
  reducer: {
    auth: authReducer,
    singleProject: singleProjectReducer,
    allProjects: allProjectsReducer,
    playAll: playAllReducer,
  },
  //middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
