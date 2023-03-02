import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { DeleteConfirmation } from "../";
import { deleteFileAsync, addFileAsync } from "../../features";

const FileOptions = ({ handleClose, clickedFile }) => {
  const { sections, id } = useSelector((state) => state.singleProject);

  const dispatch = useDispatch();

  const sectionsCopy = [...sections];
  const spliceIndices = [];
  for (let [i, section] of sectionsCopy.entries()) {
    if (section.files && section.files.length) {
      for (let file of section.files) {
        if (file.name === clickedFile.name) {
          spliceIndices.unshift(i);
        }
      }
    }
  }
  for (let i of spliceIndices) {
    sectionsCopy.splice(i, 1);
  }

  const sectionsToAssign = [];
  const handleCheckBox = (sectionNumber, checked) => {
    if (!sectionsToAssign.includes(sectionNumber) && checked) {
      sectionsToAssign.push(sectionNumber);
    } else {
      const spliceIndex = sectionsToAssign.indexOf(sectionNumber);
      sectionsToAssign.splice(spliceIndex, 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    for (let sectionToAssign of sectionsToAssign) {
      const { name, filePath, type, userId } = clickedFile;
      const data = {
        name,
        filePath,
        type,
        userId,
        sectionNumber: sectionToAssign,
        projectId: id,
      };
      dispatch(addFileAsync(data));
    }

    handleClose();
  };

  const handleDelete = (fileName) => {
    dispatch(deleteFileAsync({ deleteParam: fileName, type: "byName" }));

    handleClose();
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            size="small"
            color="error"
            onClick={handleClose}
            sx={{ alignSelf: "flex-end" }}
          >
            <CloseIcon />
          </Button>
          <Typography variant="h3" sx={{ marginBottom: "10px" }}>
            {clickedFile.name}
          </Typography>
          {sectionsCopy && sectionsCopy.length ? (
            <Typography variant="h6">Select section(s)</Typography>
          ) : null}
          {sectionsCopy && sectionsCopy.length ? (
            sectionsCopy.map((section) => (
              <FormControlLabel
                key={section.id}
                control={<Checkbox />}
                label={`Section ${section.sectionNumber}`}
                name={String(section.sectionNumber)}
                onChange={(_, value) =>
                  handleCheckBox(section.sectionNumber, value)
                }
              />
            ))
          ) : (
            <div>Cannot be assigned to any sections</div>
          )}
          {sectionsCopy && sectionsCopy.length ? (
            <Button type="submit" variant="contained">
              Assign to Section(s)
            </Button>
          ) : null}
        </Box>
      </form>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <Typography>Delete File</Typography>
        <DeleteConfirmation
          handleDelete={handleDelete}
          deleteParam={clickedFile.name}
          origin={"FileOptions"}
        />
      </Box>
    </Box>
  );
};

export default FileOptions;
