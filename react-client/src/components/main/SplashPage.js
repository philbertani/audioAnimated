import React from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Container,
  Grid,
  Button,
  Card,
  CardMedia,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

/**
 * COMPONENT
 */
const SplashPage = (props) => {
  const isLoggedIn = useSelector((state) => !!state.auth.me.id);

  return (
    <Box sx={{ marginTop: "75px" }}>
      <Grid container>
        <Grid item sm={12} md={6} lg={8}>
          <Card sx={{ height: "80vh" }}>
            <iframe
              width="100%"
              height="100%"
              src={"https://www.youtube-nocookie.com/embed/h_EGWJua-0w"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube demo"
            />
          </Card>
        </Grid>
        <Grid
          item
          sm={12}
          md={6}
          lg={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Container
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Typography variant="h3">
              Your music, in a whole new dimension
            </Typography>
            <br />
            <Typography variant="h6">
              Watch this demo to see what you can create with the Playr app!
            </Typography>
            <br />
            {!isLoggedIn && (
              <Box>
                <Button variant="contained" href="/signup">
                  Get started for free
                </Button>
                <p>
                  Already have an account? Login
                  <Button variant="text" href="/login">
                    here
                  </Button>
                </p>
              </Box>
            )}
          </Container>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "10vh",
          }}
        >
          <Button
            variant="text"
            color="info"
            onClick={() => {
              const el = document.getElementById("splash-studio");

              el.scrollIntoView({
                top: true,
                behavior: "smooth",
              });
            }}
          >
            <Typography variant="h6">Learn More</Typography>
            <KeyboardArrowDownIcon />
          </Button>
        </Grid>
        <Grid
          id="splash-studio"
          item
          xs={12}
          sm={6}
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Container sx={{ textAlign: "center" }}>
            <Typography variant="h3">Get in the studio</Typography>
            <br />
            <Typography variant="h6">
              Record with our in-app recording software, or upload existing
              files into your project editor. Create music by layering and
              connecting tracks together.
            </Typography>
            <br />
            <Button
              variant="text"
              color="info"
              onClick={() => {
                const el = document.getElementById("splash-graphics");
                el.scrollIntoView({
                  top: true,
                  behavior: "smooth",
                });
              }}
            >
              <Typography variant="h6">See our Graphics</Typography>
              <KeyboardArrowDownIcon />
            </Button>
          </Container>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardMedia
              component="img"
              image="https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
              sx={{ height: "100vh" }}
            />
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: { xs: "flex", sm: "none" },
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Container sx={{ textAlign: "center" }}>
            <Typography variant="h3">Get in the studio</Typography>
            <br />
            <Typography variant="h6">
              Record with our in-app recording software, or upload existing
              files into your project editor. Create music by layering and
              connecting tracks together.
            </Typography>
            <br />
            <KeyboardArrowDownIcon />
          </Container>
        </Grid>
        <Grid id="splash-graphics" item xs={12} sm={6}>
          <Card>
            <CardMedia
              component="img"
              image="graphicsOptionsCollage.jpg"
              sx={{ height: "100vh" }}
            />
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Container sx={{ textAlign: "center" }}>
            <Typography variant="h3">Watch your music come to life</Typography>
            <br />
            <Typography variant="h6">
              Choose a base graphic for your project, and watch the animation
              move and breathe with your song. Share your project with others
              with the generated shareable link.
            </Typography>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SplashPage;
