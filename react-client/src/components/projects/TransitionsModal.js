import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

import FileUploadForm from "./FileUploadForm";
import {
  FileOptions,
  EditProjectName,
  EditProjectLatencyFix,
  ShareSettings,
} from "../";
import Record from "./recordForm/Record";
import PlayAll from "./PlayAll";
import GraphicsOptions from "./GPU/graphicsOptions";

export const style = {
  position: "absolute",
  top: "55%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

function SwitchComponent({
  projectId,
  userId,
  handleClose,
  type,
  clickedFile,
  availableFiles,
}) {
  switch (type) {
    case "uploadFile":
      return (
        <FileUploadForm
          projectId={projectId}
          userId={userId}
          handleClose={handleClose}
        />
      );

    case "changeGraphicsFn":
      return <GraphicsOptions handleClose={handleClose} />;

    case "fileOptions":
      return (
        <FileOptions handleClose={handleClose} clickedFile={clickedFile} />
      );

    case "record":
      return (
        <Record
          availableFiles={availableFiles}
          userId={userId}
          projectId={projectId}
        />
      );

    case "playAll":
      return (
        <PlayAll
          sx={{ backgroundColor: "transparent" }}
          closeModal={handleClose}
        />
      );

    case "editProjectName":
      return <EditProjectName handleClose={handleClose} />;

    case "editProjectLatencyFix":
      return <EditProjectLatencyFix handleClose={handleClose} />;

    case "shareSettings":
      return <ShareSettings handleClose={handleClose} projectId={projectId} />;
    default:
      return null;
  }
}

export default function TransitionsModal({
  projectId,
  userId,
  open,
  handleClose,
  type,
  clickedFile,
  availableFiles,
}) {
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <SwitchComponent
              projectId={projectId}
              userId={userId}
              handleClose={handleClose}
              type={type}
              clickedFile={clickedFile}
              availableFiles={availableFiles}
            />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
