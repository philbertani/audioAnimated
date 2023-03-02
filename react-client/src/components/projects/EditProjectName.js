import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Alert, Button, Box, Input } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { updateProjectAsync } from "../../features";

const EditProjectName = ({ handleClose }) => {
  const { name, id } = useSelector((state) => state.singleProject);
  const projects = useSelector((state) => state.allProjects);
  const [newName, setNewName] = useState(name);
  const [showUniqueErrorMessage, setShowUniqueErrorMessage] = useState(false);

  let nameIsUnique = true;
  const dispatch = useDispatch();
  const handleSubmit = (event) => {
    event.preventDefault();

    for (let project of projects) {
      if (newName === project.name) {
        nameIsUnique = false;
        setShowUniqueErrorMessage(true);
      }
    }

    const projectId = id;
    const updateData = { name: newName };

    if (nameIsUnique) {
      dispatch(updateProjectAsync({ projectId, updateData }));
      handleClose();
    }
  };

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
      {showUniqueErrorMessage && (
        <Box sx={{ textAlign: "center" }}>
          <Alert severity="error">Please use a unique name</Alert>
        </Box>
      )}
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", margin: "10px" }}>
          <div>
            <label htmlFor="projectName">Edit Project Name: </label>
            <Input
              name="projectName"
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setShowUniqueErrorMessage(false);
              }}
              required
            />
          </div>
          <Button
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

export default EditProjectName;
