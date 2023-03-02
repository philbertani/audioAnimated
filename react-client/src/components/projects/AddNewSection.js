import * as React from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CardContent from "@mui/material/CardContent";
import { createSectionAsync } from "../../features";
import { SectionButtons } from "./SectionButtons";

export default function AddNewSection({ projectId }) {
  const dispatch = useDispatch();

  const addNewSection = () => {
    dispatch(createSectionAsync({ projectId }));
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1vh" }}>
      <SectionButtons
        togglePreviewOnClick={() => {}}
        previewTitle={""}
        handleDeleteSection={() => {}}
        disabled={true}
      />
      <Box>
        <Card
          sx={{
            minWidth: 210,
            minHeight: 180,
          }}
        >
          <CardActionArea onClick={addNewSection}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography component="div" variant="h5">
                {"Add Section"}
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center">
                <AddRoundedIcon
                  sx={{
                    fontSize: "6.0em",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                />
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </Box>
  );
}
