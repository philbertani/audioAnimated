import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import TextField from "@mui/material/TextField";
import { Button, Box, Input } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { updateProjectAsync } from "../../features";

const EditProjectLatencyFix = ({ handleClose }) => {
  const { recordLatencyAdjustment, id } = useSelector(
    (state) => state.singleProject
  );
  const [error, setError] = React.useState(false);
  const [newLatencyFix, setNewLatencyFix] = useState(recordLatencyAdjustment);

  const dispatch = useDispatch();
  const handleSubmit = (event) => {
    event.preventDefault();
    const projectId = id;
    const updateData = { recordLatencyAdjustment: newLatencyFix };
    dispatch(updateProjectAsync({ projectId, updateData }));
    handleClose();
  };

  const changeLatencyFix = (e) => {
    const value = e.target.value;
    const num = Number(value);
    if (num) {
      setNewLatencyFix(num);
    }
    setNewLatencyFix(value);
  };

  React.useEffect(() => {
    if ((newLatencyFix >= 0) & (newLatencyFix <= 1.5)) {
      setError(false);
    } else {
      setError(true);
    }
  }, [newLatencyFix, setError]);
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Button
        color="error"
        size="small"
        onClick={handleClose}
        sx={{ alignSelf: "flex-end" }}
      >
        <CloseIcon />
      </Button>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", margin: "10px" }}>
          <div>
            <label htmlFor="projectName">
              Edit Latency Adjustment (seconds ) :{" "}
            </label>
            <TextField
              name="projectLatency"
              type="text"
              value={newLatencyFix}
              onChange={changeLatencyFix}
              error={error}
              helperText={
                error ? "Adjustment should be between 0 and 1.5" : null
              }
            />
          </div>
          <Button
            disabled={error}
            variant="contained"
            size="small"
            type="submit"
            sx={{ alignSelf: "flex-end", marginTop: "10px" }}
          >
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditProjectLatencyFix;
