import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { AddNewProject, DeleteConfirmation } from "../";
import { deleteProjectAsync } from "../../features";
import { graphicsOptions } from "./GPU/graphicsOptions";

export default function AllProjects() {
  const navigate = useNavigate();
  const projects = useSelector((state) => state.allProjects);

  const dispatch = useDispatch();
  const handleDelete = (id) => {
    dispatch(deleteProjectAsync(id));

    navigate("/projects");
  };

  return (
    <Container sx={{ marginTop: "30px", minHeight: "100vh" }}>
      <CssBaseline />
      {/* Hero unit */}
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Your Projects
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
          >
            Start here and watch your music come to life!
          </Typography>
          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <AddNewProject />
          </Stack>
        </Container>
      </Box>
      <Box sx={{ py: 8 }}>
        {/* End hero unit */}
        <Grid container spacing={4}>
          {projects && projects.length
            ? projects.map((project) => (
                <Grid item key={project.id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        16: 9,
                        // pt: "56.25%",
                      }}
                      image={graphicsOptions[project.graphicsFn].imgUrl}
                      alt="random"
                    />
                    <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                      <Typography variant="h5" component="h2">
                        {project.name}
                      </Typography>
                      <small>
                        {project.shareable
                          ? "Public"
                          : "Private"}
                      </small>
                    </CardContent>
                    <CardActions
                      sx={{ display: "flex", justifyContent: "space-evenly" }}
                    >
                      <Button
                        size="small"
                        onClick={() => {
                          navigate(`/share/${project.id}`);
                        }}
                      >
                        View Final
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          navigate(`/projects/${project.id}`);
                        }}
                      >
                        Edit
                      </Button>
                      <DeleteConfirmation
                        handleDelete={handleDelete}
                        deleteParam={project.id}
                        origin={"AllProjects"}
                      />
                    </CardActions>
                  </Card>
                </Grid>
              ))
            : null}
        </Grid>
      </Box>
    </Container>
  );
}
