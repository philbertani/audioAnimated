import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  Box,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { updateProjectAsync } from "../../features";

const ShareSettings = ({ handleClose, projectId }) => {
  const [shareable, setShareable] = useState(false);
  const project = useSelector((state) => state.singleProject);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const updateData = { shareable };
    dispatch(updateProjectAsync({ projectId, updateData }));

    navigate(`/share/${projectId}`);
  };

  const handleRadio = (e) => {
    if (e.target.value === "true") {
      setShareable(true);
    } else {
      setShareable(false);
    }
  };

  const defaultValue = project.shareable ? "true" : "false";

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Button
        type="button"
        size="small"
        color="error"
        onClick={handleClose}
        sx={{ alignSelf: "flex-end" }}
      >
        <CloseIcon />
      </Button>
      <Typography variant="h6">
        Would you like to make your Project public?
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <RadioGroup
            aria-labelledby="radio-buttons-group-label"
            defaultValue={defaultValue}
            name="radio-buttons-group"
            onChange={handleRadio}
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
          <Button type="submit" variant="contained">
            Continue
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ShareSettings;
