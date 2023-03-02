import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LoopIcon from "@mui/icons-material/Loop";
import MicIcon from "@mui/icons-material/Mic";

import { styled } from "@mui/material/styles";
const TinyText = styled(Typography)({
  fontSize: "1.0rem",
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

function formatDuration(value) {
  const minute = Math.floor(value / 60);
  const secondLeft = value - minute * 60;
  return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
}

export default function Player({
  title,
  currentTime,
  duration,
  playOnClick,
  recordStartStop,
  restartOnClick,
  isPlaying,
  disabled,
  toggleLoop,
  loop,
  record,
  isRecording,
  availableFiles,
  files,
}) {
  const noTimer = availableFiles && files && (files.length === 0) & record;

  const play = async () => {
    if ((Object.keys(availableFiles).length > 0) & (files.length > 0)) {
      await playOnClick();
    }
    if (record) {
      recordStartStop();
    }
  };

  return (
    <Card
      sx={{
        minWidth: 210,
        paddingLeft: "20px",
        paddingRight: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {title ? (
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              {title}
            </Typography>
          </CardContent>
        ) : null}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              borderRadius: "25px",
              border: "1px solid grey",
              paddingRight: "15px",
              margin: "5px",
              paddingLeft: noTimer ? "10px" : null,
            }}
          >
            <IconButton
              aria-label="play/pause"
              onClick={play}
              disabled={disabled}
            >
              {record ? (
                isRecording ? (
                  <MicIcon sx={{ height: 38, width: 38, color: "red" }} />
                ) : (
                  <MicIcon sx={{ height: 38, width: 38 }} />
                )
              ) : isPlaying ? (
                <PauseIcon sx={{ height: 38, width: 38 }} />
              ) : (
                <PlayArrowIcon sx={{ height: 38, width: 38 }} />
              )}
            </IconButton>
            {noTimer ? null : (
              <TinyText>{formatDuration(Math.round(currentTime))}</TinyText>
            )}
            {duration === 0 ? null : (
              <TinyText>{"/" + formatDuration(Math.round(duration))}</TinyText>
            )}
          </Box>
          {!record ? (
            <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
              <IconButton aria-label="restart" onClick={restartOnClick}>
                <RestartAltIcon />
              </IconButton>
              <IconButton aria-label="loop" onClick={toggleLoop}>
                {loop ? (
                  <LoopIcon sx={{ color: "lightgreen" }} />
                ) : (
                  <LoopIcon />
                )}
              </IconButton>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Card>
  );
}
