import * as React from "react";
import { useDispatch } from "react-redux";

import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import DeleteIcon from "@mui/icons-material/Delete";
import SelectTracksForm from "./SelectTracksForm";
import RecordForm from "./RecordForm";
import PlaybackForm from "./PlaybackForm";

import { deleteFileAsync } from "../../../features";

const steps = ["Select Backing", "Record", "Listen Back"];

function getStepContent(
  step,
  userId,
  projectId,
  selectedFiles,
  setSelectedFiles,
  availableFiles,
  newFileName,
  setNewFileName,
  setRecorded,
  displayRecorder,
  error,
  setError,
  useMetronome,
  setUseMetronome,
  metronomeTempo,
  setMetronomeTempo
) {
  switch (step) {
    case 0:
      return (
        <SelectTracksForm
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          availableFiles={availableFiles}
          error={error}
          setError={setError}
          useMetronome={useMetronome}
          setUseMetronome={setUseMetronome}
          metronomeTempo={metronomeTempo}
          setMetronomeTempo={setMetronomeTempo}
        />
      );
    case 1:
      return (
        <RecordForm
          selectedFiles={selectedFiles}
          userId={userId}
          projectId={projectId}
          newFileName={newFileName}
          setNewFileName={setNewFileName}
          setRecorded={setRecorded}
          displayRecorder={displayRecorder}
          useMetronome={useMetronome}
          metronomeTempo={metronomeTempo}
        />
      );
    case 2:
      return <PlaybackForm selectedFiles={selectedFiles} />;
    default:
      throw new Error("Unknown step");
  }
}

export default function Record({ availableFiles, userId, projectId }) {
  const [error, setError] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState({});
  const [displayRecorder, setDisplayRecorder] = React.useState({});
  const [activeStep, setActiveStep] = React.useState(0);
  const [newFileName, setNewFileName] = React.useState("");
  const [recorded, setRecorded] = React.useState(false);
  const [deleted, setDeleted] = React.useState(false);
  const [useMetronome, setUseMetronome] = React.useState(false);
  const [metronomeTempo, setMetronomeTempo] = React.useState(120);

  const dispatch = useDispatch();

  const handleDelete = async (fileName) => {
    dispatch(deleteFileAsync({ deleteParam: fileName, type: "byName" }));
    setActiveStep(activeStep + 1);
    setDeleted(true);
  };

  React.useEffect(() => {
    if (availableFiles && Object.keys(availableFiles).length) {
      const fileObj = {};
      Object.keys(availableFiles).forEach((name) => {
        fileObj[name] = true;
      });
      setSelectedFiles(fileObj);
    }
  }, [availableFiles]);

  React.useEffect(() => {
    if (recorded) {
      setDisplayRecorder(false);
    } else if (newFileName && newFileName.length > 0) {
      setDisplayRecorder(true);
    } else {
      setDisplayRecorder(false);
    }
  }, [newFileName, recorded]);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    if (activeStep === 2) {
      window.location.reload();
    }
  };

  React.useEffect(() => {
    if ((activeStep === 1) & recorded) setActiveStep(activeStep + 1);
  }, [activeStep, recorded]);

  function disableButton() {
    if ((activeStep === 0) & error) return true;
    else if ((activeStep === 1) & ((newFileName === "") | (recorded === false)))
      return true;
    else return false;
  }

  return (
    <div>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Typography component="h1" variant="h4" align="center">
          Record
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            {!deleted ? (
              <div>
                <Typography variant="h5" gutterBottom>
                  Your track has been saved!
                </Typography>
                <Typography variant="subtitle1">
                  Use the Project editor to drop your track into a section!
                </Typography>
              </div>
            ) : (
              <div>
                <Typography variant="h5" gutterBottom>
                  Your recording was deleted.
                </Typography>
                <Typography variant="subtitle1">
                  Hit the record button to start again
                </Typography>
              </div>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {getStepContent(
              activeStep,
              userId,
              projectId,
              selectedFiles,
              setSelectedFiles,
              availableFiles,
              newFileName,
              setNewFileName,
              setRecorded,
              displayRecorder,
              error,
              setError,
              useMetronome,
              setUseMetronome,
              metronomeTempo,
              setMetronomeTempo
            )}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {activeStep === steps.length - 1 ? (
                <Button onClick={() => handleDelete(newFileName)}>
                  <DeleteIcon fontSize="large" />
                </Button>
              ) : (
                <div></div>
              )}

              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ mt: 3, ml: 1 }}
                disabled={disableButton()}
              >
                {activeStep === 0 ? "Next" : "Done"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Container>
    </div>
  );
}
