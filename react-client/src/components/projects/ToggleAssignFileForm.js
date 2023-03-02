import * as React from "react";
import { Box, Button, Card } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { AssignFileToSection } from "../";

export function ToggleAssignFileForm({
  section,
  sectionId,
  assignSectionFormActive,
  setAssignSectionFormActive,
}) {
  const toggle = (onOff, sectionId) => {
    if (onOff) setAssignSectionFormActive(sectionId);
    else setAssignSectionFormActive(false);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {assignSectionFormActive === sectionId ? (
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            size="small"
            color="error"
            onClick={() => toggle(false, sectionId)}
            sx={{ alignSelf: "flex-end" }}
          >
            <CloseIcon />
          </Button>
          <AssignFileToSection
            section={section}
            setAssignSectionFormActive={setAssignSectionFormActive}
          />
        </Card>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button type="button" onClick={() => toggle(true, sectionId)}>
            Add a file
          </Button>
        </Box>
      )}
    </Box>
  );
}
