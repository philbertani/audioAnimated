import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";

import { addFileAsync } from "../../features";

const AssignFileToSection = ({ setAssignSectionFormActive, section }) => {
  const { availableFiles, id } = useSelector((state) => state.singleProject);
  const fileNames = [];

  const dispatch = useDispatch();

  section.files && section.files.forEach((file) => fileNames.push(file.name));

  const unassignedFiles = Object.values(availableFiles).filter(
    (file) => !fileNames.includes(file.name)
  );

  const filesToAssign = [];
  const handleCheckBox = (fileName, checked) => {
    if (!filesToAssign.includes(fileName) && checked) {
      filesToAssign.push(fileName);
    } else {
      const spliceIndex = filesToAssign.indexOf(fileName);
      filesToAssign.splice(spliceIndex, 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    for (let fileName of filesToAssign) {
      const { name, filePath, type, userId } = availableFiles[fileName];
      const data = {
        name,
        filePath,
        type,
        userId,
        sectionNumber: section.sectionNumber,
        projectId: id,
      };
      dispatch(addFileAsync(data));
    }

    setAssignSectionFormActive(null);
  };

  return unassignedFiles && unassignedFiles.length ? (
    <form onSubmit={handleSubmit}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "10px",
        }}
      >
        <Typography variant="h6">Select file(s) to add</Typography>
        {unassignedFiles.map(
          (file) =>
            !fileNames.includes(file.name) && (
              <FormControlLabel
                key={file.id}
                control={<Checkbox />}
                label={file.name}
                name={file.name}
                onChange={(_, value) => handleCheckBox(file.name, value)}
              />
            )
        )}
        <Button type="submit" size="small" variant="contained">
          Add File(s)
        </Button>
      </Box>
    </form>
  ) : (
    <div>No files to add</div>
  );
};

export default AssignFileToSection;
