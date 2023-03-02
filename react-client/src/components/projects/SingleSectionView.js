import * as React from "react";
import { Box } from "@mui/material";

import { SectionButtons } from "./SectionButtons";
import MultiFilePlayer from "./MultiFilePlayer";
import { ToggleAssignFileForm } from "./ToggleAssignFileForm";

import { GPU } from "./GPU/GPU";
import { primaryColors } from "../app/App";

export default function SingleSectionView({
  singleSection,
  section,
  files,
  sectionNumber,
  sectionId,
  assignSectionFormActive,
  setAssignSectionFormActive,
  togglePreviewOnClick,
  handleDeleteSection,
  graphicsFn,
  acRefs,
}) {
  const [GPUconfig, setGPUconfig] = React.useState({});
  const [canvasInitialized, setCanvasInitialized] = React.useState(false);

  const sectionAnimationRef = React.useRef();

  GPU({
    GPUconfig,
    gpuDivRef: sectionAnimationRef.current,
    canvasInitialized,
    setCanvasInitialized,
  });

  return (
    <Box
      sx={{
        marginLeft: "max(16vw,152px)",
        display: "flex",
        flexDirection: "row",
        gap: "1vw",
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: "1vh", flex: 4 }}
      >
        <SectionButtons
          singleSection={singleSection}
          togglePreviewOnClick={togglePreviewOnClick}
          previewTitle={"Exit Graphics Preview"}
          handleDeleteSection={handleDeleteSection}
          sectionId={sectionId}
        />
        <MultiFilePlayer
          title={`Section ${sectionNumber}`}
          files={files}
          sectionNumber={sectionNumber}
          inSection={true}
          setGPUconfig={setGPUconfig}
          renderGraphics={true}
          acRefs={acRefs}
        />
        <ToggleAssignFileForm
          section={section}
          sectionId={sectionId}
          assignSectionFormActive={assignSectionFormActive}
          setAssignSectionFormActive={setAssignSectionFormActive}
        />
      </Box>
      <Box sx={{ flex: 5 }}>
        <div
          id="sectionAnimation"
          ref={sectionAnimationRef}
          style={{
            // marginTop: "36px",
            // marginRight: "4vw",
            // flexShrink: "0",
            width: 640,
            height: 480,
            backgroundColor: primaryColors[graphicsFn],
          }}
        ></div>
      </Box>
    </Box>
  );
}
