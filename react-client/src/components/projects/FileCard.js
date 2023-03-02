import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import { Box } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import { useDispatch } from "react-redux";
import { deleteFileAsync } from "../../features";

export default function FileCard({
  file,
  changeVolume,
  inSection,
  smallPlayer,
}) {
  const dispatch = useDispatch();
  const handleDelete = (sectionNumber) => {
    dispatch(
      deleteFileAsync({ deleteParam: Number(sectionNumber), type: "byId" })
    );
  };

  const [onOff, setOnOff] = React.useState(true);

  const [volume, setVolume] = React.useState(50);
  const _changeVolume = (value) => {
    setVolume(value);
    changeVolume(value / 30, file.name);
  };

  const togglerOnOff = (value) => {
    if (value) _changeVolume(50);
    else _changeVolume(0);
    setOnOff(value);
  };
  return (
    <Box sx={{ minWidth: 210 }}>
      {smallPlayer ? (
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {file.name}
          </Typography>
          <Box sx={{ flexGrow: 8, display: "flex", flexDirection: "row" }}>
            <VolumeDown />
            <Slider
              aria-label="Volume"
              value={volume}
              onChange={(_, value) => _changeVolume(value)}
            />
            <VolumeUp />
          </Box>
        </Box>
      ) : (
        <Accordion expanded={onOff}>
          <AccordionSummary>
            <Switch
              checked={onOff}
              onChange={(_, value) => togglerOnOff(value)}
              inputProps={{ "aria-label": "controlled" }}
            />
            <Typography variant="h6" component="div">
              {file.name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack
              spacing={2}
              direction="row"
              sx={{ mb: 1 }}
              alignItems="center"
            >
              <VolumeDown />
              <Slider
                aria-label="Volume"
                value={volume}
                onChange={(_, value) => _changeVolume(value)}
              />
              <VolumeUp />
            </Stack>
            {inSection ? (
              <Button
                type="button"
                size="small"
                onClick={() => handleDelete(file.id)}
              >
                Remove From Section
              </Button>
            ) : null}
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
}
