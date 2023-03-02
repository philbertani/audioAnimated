import * as React from "react";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Divider, Box, Container } from "@mui/material";

import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";

export default function SelectTracksForm({
  selectedFiles,
  setSelectedFiles,
  availableFiles,
  error,
  setError,
  useMetronome,
  setUseMetronome,
  metronomeTempo,
  setMetronomeTempo,
}) {
  const names = Object.keys(availableFiles);

  React.useEffect(() => {
    if (!metronomeTempo | (metronomeTempo <= 0)) {
      setError(true);
    } else setError(false);
  }, [metronomeTempo, setError]);

  const handleCheckMetronome = (checked) => {
    setUseMetronome(checked);
  };

  const changeMetronomeTempo = (e) => {
    const value = e.target.value;
    setMetronomeTempo(value);
  };

  const handleCheckBox = (name, checked) => {
    const fileObj = { ...selectedFiles };
    fileObj[name] = checked;
    setSelectedFiles(fileObj);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Select backing to play along with whilst you're recording:
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          marginTop: "30px",
          justifyContent: "center",
        }}
      >
        <Box>
          <Typography variant="p" gutterBottom>
            Presets:
          </Typography>
          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                label={"Metronome"}
                name={"metronome"}
                onChange={(_, value) => handleCheckMetronome(value)}
              />
              {useMetronome ? (
                <TextField
                  label="Set Metronome Tempo"
                  variant="outlined"
                  type="number"
                  value={metronomeTempo}
                  onChange={changeMetronomeTempo}
                  error={error}
                  helperText={error ? "Tempo must be greater than 0" : null}
                />
              ) : null}
            </FormGroup>
          </Container>
        </Box>
        {names && names.length ? (
          <Box>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ marginRight: "30px" }}
            ></Divider>
            <Box>
              <Typography variant="p" gutterBottom>
                Your Tracks
              </Typography>
              <Container
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <FormGroup>
                  {names.map((name) => (
                    <FormControlLabel
                      key={name}
                      control={<Checkbox defaultChecked />}
                      label={name}
                      name={name}
                      onChange={(_, value) => handleCheckBox(name, value)}
                    />
                  ))}
                </FormGroup>
              </Container>
            </Box>
          </Box>
        ) : null}
      </Box>
    </React.Fragment>
  );
}
