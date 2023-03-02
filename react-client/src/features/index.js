export {
  default as authReducer,
  me,
  authenticate,
  logout,
  setGlobalGraphics,
} from "./auth/authSlice";

export {
  default as singleProjectReducer,
  createSectionAsync,
  deleteSectionAsync,
  getFilesAsync,
  getFileAsync,
  fetchSingleProjectAsync,
  addFileAsync,
  deleteFileAsync,
  writeFileAsync,
  updateProjectAsync,
} from "./projects/SingleProjectSlice";

export {
  default as allProjectsReducer,
  createProjectAsync,
  fetchAllProjectsByUserIdAsync,
  deleteProjectAsync,
} from "./projects/AllProjectsSlice";

export {
  default as playAllReducer,
  setSectionToPlay,
  setTryToStart,
  setPlayAllStarted,
  alreadyPlaying,
  setFinished,
  setGraphicFN,
  setPlayAllPlayPause,
  setPlayAllActuallyStarted
} from "./projects/playAllSlice";
