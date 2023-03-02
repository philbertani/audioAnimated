import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { Button, Box, Input, Typography } from "@mui/material";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import CloseIcon from "@mui/icons-material/Close";

import { addFileAsync, writeFileAsync, getFileAsync } from "../../features";

const FileUploadForm = (props) => {
  const { projectId, userId, handleClose } = props;

  const [name, setName] = useState("");
  const [file, setFile] = useState({});

  const dispatch = useDispatch();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name,
      filePath: file.name,
      type: file.name.slice(-3),
      userId,
      projectId,
    };

    await dispatch(addFileAsync(formData));
    await dispatch(writeFileAsync({ projectId, filePath: file.name, file }));
    await dispatch(
      getFileAsync({ fileLabel: name, projectId, filePath: file.name })
    );

    setName("");
    setFile({});
    handleClose();
  };

  return (
    <form onSubmit={handleFormSubmit}>
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
        <div>Choose a file and give it a label</div>
        <Box>
          <label htmlFor="name">File Label: </label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button
            color={file && file.name ? "success" : "error"}
            sx={{ margin: "5px" }}
          >
            <label htmlFor="filePath">
              <DriveFolderUploadIcon fontSize="large" />
            </label>
          </Button>
          {file && file.name ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {file.name}
            </Box>
          ) : null}
          <Input
            id="filePath"
            type="file"
            accept=".ogg, .mp3"
            name="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
            sx={{ display: "none" }}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          sx={{ alignSelf: "flex-end" }}
        >
          <Typography>Submit</Typography>
        </Button>
      </Box>
    </form>
  );
};

export default FileUploadForm;
