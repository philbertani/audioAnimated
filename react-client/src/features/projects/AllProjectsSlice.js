import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getWithToken,
  postWithToken,
  deleteWithToken,
} from "../requestWithToken";
export const fetchAllProjectsByUserIdAsync = createAsyncThunk(
  "allProjectsByUserId",
  async (userId) => {
    return await getWithToken("/api/projects/", [], { userId });
  }
);

export const createProjectAsync = createAsyncThunk(
  "createProject",
  async (payload) => {
    return await postWithToken("/api/projects/", {}, payload);
  }
);

export const deleteProjectAsync = createAsyncThunk(
  "deleteProject",
  async (projectId) => {
    return await deleteWithToken(`/api/projects/${projectId}`, null);
  }
);

export const allProjectsSlice = createSlice({
  name: "allProjects",
  initialState: [],
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProjectsByUserIdAsync.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(createProjectAsync.fulfilled, (state, action) => {
        const stateCopy = [...state];
        stateCopy.push(action.payload);
        return stateCopy;
      })
      .addCase(deleteProjectAsync.fulfilled, (state, action) => {
        const stateCopy = [...state];
        const projectToDeleteId = action.payload;
        for (let [i, project] of stateCopy.entries()) {
          project.id === projectToDeleteId && stateCopy.splice(i, 1);
        }
        return stateCopy;
      });
  },
});
export default allProjectsSlice.reducer;
