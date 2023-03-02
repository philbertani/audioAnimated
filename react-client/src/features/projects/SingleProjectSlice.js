import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TOKEN } from "../auth/authSlice";

import {
  get,
  getNoCatch,
  getWithTokenNoCatch,
  getWithToken,
  putWithToken,
  postWithToken,
  deleteWithToken,
} from "../requestWithToken";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const getFilesAsync = createAsyncThunk(
  "getFiles",
  async ({ projectId, availableFiles, checkIfShareable }) => {
    try {
      const rawData = {};
      for (const name in availableFiles) {
        const file = availableFiles[name];
        const filePath = file.filePath;

        let seconds = 0;
        const maxWait = 10;
        let response;
        while (true) {
          try {
            const token = window.localStorage.getItem(TOKEN);
            if (token) {
              response = await getWithTokenNoCatch("/api/audiofiles/", "", {
                projectId,
                filePath,
              });
            } else if (checkIfShareable) {
              response = await getNoCatch("/api/audiofiles/", {
                projectId,
                filePath,
              });
            } else {
              response = { status: null };
            }
            if (response.status === 200) break;
          } catch (error) {
            await delay(1000);
            seconds++;
            if (seconds === maxWait) break;
          }
        }
        rawData[name] = response.data;
      }
      return rawData;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getFileAsync = createAsyncThunk(
  "getFile",
  async ({ fileLabel, projectId, filePath }) => {
    const data = await getWithToken("/api/audiofiles/", "", {
      projectId,
      filePath,
    });
    return [fileLabel, data];
  }
);

export const writeFileAsync = createAsyncThunk(
  "writeFile",
  async ({ projectId, filePath, file }) => {
    try {
      const formData = new FormData();
      formData.append("audiofile", file);

      const additionalHeaders = {
        "Content-Type": "multipart/form-data",
      };
      return await postWithToken(
        "/api/audiofiles/",
        "",
        formData,
        {
          projectId,
          filePath,
        },
        additionalHeaders
      );
    } catch (error) {
      console.error(error);
    }
  }
);

export const addFileAsync = createAsyncThunk("addFile", async (formData) => {
  return await postWithToken("/api/files/", {}, formData);
});

export const deleteFileAsync = createAsyncThunk(
  "deleteFile",
  async ({ deleteParam, type }) => {
    await deleteWithToken("/api/files/", null, { deleteParam, type });
    return { deleteParam, type };
  }
);

export const fetchSingleProjectAsync = createAsyncThunk(
  "singleProject",
  async ({ projectId, checkIfShareable }) => {
    const token = window.localStorage.getItem(TOKEN);
    if (token) return await getWithToken(`/api/projects/${projectId}`, {});
    if (checkIfShareable) return await get(`/api/projects/${projectId}`);
    return {};
  }
);

export const updateProjectAsync = createAsyncThunk(
  "updateProject",
  async ({ projectId, updateData }) => {
    return await putWithToken(`/api/projects/${projectId}`, {}, updateData);
  }
);

export const createSectionAsync = createAsyncThunk(
  "createSection",
  async (payload) => {
    return await postWithToken("/api/sections/", {}, payload);
  }
);

export const deleteSectionAsync = createAsyncThunk(
  "deleteSection",
  async (sectionId) => {
    await deleteWithToken(`/api/sections/${sectionId}`, null);
    return sectionId;
  }
);

export const singleProjectSlice = createSlice({
  name: "singleProject",
  initialState: {
    id: null,
    name: null,
    type: null,
    recordLatencyAdjustment: null,
    sectionDuration: null,
    graphicsFn: null,
    shareable: false,
    sections: [],
    availableFiles: {}, // de-duped, key is file.name
    audioRawFiles: {}, // de-duped, key is file.name
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSingleProjectAsync.fulfilled, (state, action) => {
      const {
        id,
        name,
        recordLatencyAdjustment,
        type,
        sections,
        sectionDuration,
        graphicsFn,
        shareable,
      } = action.payload;
      const availableFiles = {};
      sections.forEach((section) => {
        section.files.forEach((file) => {
          if (!Object.keys(availableFiles).includes(file.name)) {
            availableFiles[file.name] = file;
          }
        });
      });

      state.id = id;
      state.name = name;
      state.recordLatencyAdjustment = recordLatencyAdjustment;
      state.type = type;
      state.sections = sections
        .filter((x) => x.sectionNumber !== 0)
        .sort((a, b) => a.sectionNumber - b.sectionNumber);
      state.sectionDuration = sectionDuration;
      state.availableFiles = availableFiles;
      state.graphicsFn = graphicsFn;
      state.shareable = shareable;
    });
    builder.addCase(getFilesAsync.fulfilled, (state, action) => {
      state.audioRawFiles = action.payload;
    });
    builder.addCase(getFileAsync.fulfilled, (state, action) => {
      state.audioRawFiles[action.payload[0]] = action.payload[1];
    });
    builder.addCase(createSectionAsync.fulfilled, (state, action) => {
      state.sections.push(action.payload);
    });
    builder.addCase(addFileAsync.fulfilled, (state, action) => {
      const newFile = action.payload;
      if (!state.availableFiles[newFile.name])
        state.availableFiles[newFile.name] = newFile;
      for (let section of state.sections) {
        if (section.id === newFile.sectionId) {
          if (!section.files) section.files = [];
          section.files.push(newFile);
          break;
        }
      }
    });
    builder.addCase(deleteFileAsync.fulfilled, (state, action) => {
      const { deleteParam, type } = action.payload;
      if (type === "byName") {
        const fileName = deleteParam;
        delete state.availableFiles[fileName];
        delete state.audioRawFiles[fileName];
        for (let section of state.sections) {
          for (let [i, file] of section.files.entries()) {
            if (file.name === fileName) {
              section.files.splice(i, 1);
            }
          }
        }
      } else if (type === "byId") {
        const fileId = deleteParam;
        for (let section of state.sections) {
          for (let [i, file] of section.files.entries()) {
            if (file.id === fileId) {
              section.files.splice(i, 1);
            }
          }
        }
      }
    });
    builder.addCase(deleteSectionAsync.fulfilled, (state, action) => {
      const sectionId = action.payload;
      for (let [i, section] of state.sections.entries()) {
        if (section.id === sectionId) {
          state.sections.splice(i, 1);
          break;
        }
      }
    });
    builder.addCase(updateProjectAsync.fulfilled, (state, action) => {
      const { name, recordLatencyAdjustment, graphicsFn } = action.payload;
      if (name !== state.name) {
        state.name = name;
      }
      if (graphicsFn !== state.graphicsFn) {
        state.graphicsFn = graphicsFn;
      }
      if (recordLatencyAdjustment !== state.recordLatencyAdjustment) {
        state.recordLatencyAdjustment = recordLatencyAdjustment;
      }
    });
  },
});

export default singleProjectSlice.reducer;
