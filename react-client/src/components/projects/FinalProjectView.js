import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import { Box, Link } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import Sections from "./Sections";
import { fetchSingleProjectAsync, getFilesAsync } from "../../features";
import { setPlayAllStarted, setPlayAllPlayPause } from "../../features";
import { setGlobalGraphics } from "../../features";
import { setGraphicFN } from "../../features";
import { NotFound } from "../";

const FinalProjectView = () => {
  const { projectId } = useParams();

  const dispatch = useDispatch();
  useEffect(() => {
    const checkIfShareable = true;
    dispatch(fetchSingleProjectAsync({ projectId, checkIfShareable }));
  }, [dispatch, projectId]);

  const { playAllStarted, playAllPlayPause } = useSelector(
    (state) => state.playAll
  );
  const project = useSelector((state) => state.singleProject);
  const { sections, graphicsFn } = project;
  const { availableFiles } = project;

  useEffect(() => {
    if (graphicsFn) {
      dispatch(setGraphicFN(graphicsFn));
      dispatch(setGlobalGraphics(graphicsFn));
    }
  }, [dispatch, graphicsFn]);

  useEffect(() => {
    if (Object.keys(availableFiles).length) {
      const checkIfShareable = true;
      dispatch(getFilesAsync({ projectId, availableFiles, checkIfShareable }));
    }
  }, [dispatch, projectId, availableFiles]);

  const [showCopiedMsg, setShowCopiedMsg] = useState(false);
  const shareUrl = window.location.href;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareUrl}`);

    setShowCopiedMsg(true);
  };

  return project.id ? (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Sections
        sections={sections}
        projectId={projectId}
        graphicsFn={graphicsFn}
        final={true}
      />
      <PlayerButton
        isPlaying={playAllPlayPause}
        playAllStarted={playAllStarted}
        onClick={() => {
          if (!playAllStarted) {
            dispatch(setPlayAllStarted(true));
            dispatch(setPlayAllPlayPause(true));
          } else if (playAllPlayPause) {
            dispatch(setPlayAllPlayPause(false));
          } else {
            dispatch(setPlayAllPlayPause(true));
          }
        }}
      />

      <div>Share using this link!</div>
      {showCopiedMsg ? <small>Copied to clipboard</small> : null}
      <Link
        component="button"
        underline="none"
        sx={{ display: "flex", alignItems: "center" }}
        onClick={copyToClipboard}
      >
        <div>{shareUrl}</div>
        <ContentCopyIcon sx={{ marginLeft: "5px" }} />
      </Link>
    </Box>
  ) : (
    <NotFound />
  );
};

function PlayerButton({ isPlaying, onClick, disabled }) {
  return (
    <div>
      <IconButton aria-label="play/pause" onClick={onClick} disabled={disabled}>
        {isPlaying ? (
          <PauseIcon sx={{ height: 38, width: 38 }} />
        ) : (
          <PlayArrowIcon sx={{ height: 38, width: 38 }} />
        )}
      </IconButton>
    </div>
  );
}

export default FinalProjectView;
