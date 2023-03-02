import * as React from "react";

import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";

import MultiFilePlayer from "../MultiFilePlayer";

const MESSAGES = {
  label: "Label your recording",
  begin: "Click on the microphone to begin recording",
  recording: "Click on the microphone again to stop recording",
  stopped: "Recording is being processed, hang tight...",
};

export default function RecordForm({
  selectedFiles,
  projectId,
  userId,
  newFileName,
  setNewFileName,
  setRecorded,
  displayRecorder,
  useMetronome,
  metronomeTempo,
}) {
  const [files, setFiles] = React.useState([]);
  React.useEffect(() => {
    const _files = [];
    for (const fileName in selectedFiles) {
      if (selectedFiles[fileName]) {
        _files.push({ name: fileName });
      }
    }
    setFiles(_files);
  }, [selectedFiles]);

  const handleNameChange = (event) => {
    setNewFileName(event.target.value);
  };

  const smallPlayer = true;
  const [msgKey, setMsgKey] = React.useState("label");

  React.useEffect(() => {
    if (newFileName && (newFileName.length > 0) & (msgKey === "label")) {
      setMsgKey("begin");
    } else if ((newFileName === "") & (msgKey === "begin")) {
      setMsgKey("label");
    }
  }, [newFileName, msgKey]);

  return (
    <React.Fragment>
      <Box>
        {msgKey === "stopped" ? (
          <Alert severity="success">{MESSAGES[msgKey]}</Alert>
        ) : (
          <Alert severity="info">{MESSAGES[msgKey]}</Alert>
        )}
        <Box sx={{ display: "flex", alignItems: "center", margin: "10px" }}>
          <TextField
            label="Label"
            variant="outlined"
            value={newFileName}
            onChange={handleNameChange}
            sx={{ margin: "auto", width: "25%" }}
          />
        </Box>

        <Box sx={{ margin: "10px" }}>
          {displayRecorder ? (
            <MultiFilePlayer
              msgKey={msgKey}
              setMsgKey={setMsgKey}
              projectId={projectId}
              userId={userId}
              files={files}
              inSection={false}
              sectionNumber={null}
              setGPUconfig={null}
              renderGraphics={false}
              record={true}
              smallPlayer={smallPlayer}
              setRecorded={setRecorded}
              newFileName={newFileName}
              useMetronome={useMetronome}
              metronomeTempo={metronomeTempo}
            />
          ) : null}
        </Box>
      </Box>
    </React.Fragment>
  );
}
