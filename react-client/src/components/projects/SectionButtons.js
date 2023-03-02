import { Box, IconButton } from "@mui/material";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import Tooltip from "@mui/material/Tooltip";

import { DeleteConfirmation } from "..";

export function SectionButtons({
  singleSection,
  togglePreviewOnClick,
  previewTitle,
  handleDeleteSection,
  sectionId,
  disabled,
}) {
  let sx;
  if (singleSection) {
    sx = { color: "green" };
  }
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Tooltip title={previewTitle}>
        <span>
          <IconButton
            type="button"
            onClick={() => togglePreviewOnClick(singleSection, sectionId)}
            sx={sx}
            disabled={disabled}
          >
            <BubbleChartIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Remove Section">
        <span>
            <DeleteConfirmation
              handleDelete={handleDeleteSection}
              deleteParam={sectionId}
              origin={"SectionButtons"}
            />
        </span>
      </Tooltip>
    </Box>
  );
}
