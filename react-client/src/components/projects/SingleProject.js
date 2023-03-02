import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import PermanentDrawerLeft from "./PermanentDrawerLeft";

import { Box } from "@mui/material";

import { NotFound } from "../";
import {
  fetchSingleProjectAsync,
  getFilesAsync,
  setGlobalGraphics,
  setGraphicFN,
} from "../../features/";
import LooperProject from "./LooperProject";

const SingleProject = () => {
  const { projectId } = useParams();
  const userId = useSelector((state) => state.auth.me.id);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSingleProjectAsync({ projectId }));
  }, [dispatch, projectId]);

  const project = useSelector((state) => state.singleProject);
  const { availableFiles, graphicsFn } = project;

  useEffect(() => {
    if (graphicsFn) {
      dispatch(setGraphicFN(graphicsFn));
      dispatch(setGlobalGraphics(graphicsFn));
    }
  }, [dispatch, graphicsFn]);

  useEffect(() => {
    if (Object.keys(availableFiles).length) {
      dispatch(getFilesAsync({ projectId, availableFiles }));
    }
  }, [dispatch, projectId, availableFiles]);

  return project.id ? (
    <Box sx={{ minHeight: "100vh" }}>
      <PermanentDrawerLeft projectId={project.id} userId={userId} />
      <LooperProject project={project} userId={userId} projectId={projectId} />
    </Box>
  ) : (
    <NotFound />
  );
};

export default SingleProject;
