import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Card, Input, Button, Grid } from "@mui/material";
import { authenticate } from "../../features";

/**
  The AuthForm component can be used for Login or Sign Up.
  Props for Login: name="login", displayName="Login"
  Props for Sign up: name="signup", displayName="Sign Up"
**/

const AuthForm = ({ name, displayName }) => {
  const { error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const formName = evt.target.name;
    const username = evt.target.username.value;
    const password = evt.target.password.value;
    await dispatch(authenticate({ username, password, method: formName }));
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "100vh",
        alignItems: "center",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>{displayName}</h2>
        {error && <div> {error} </div>}
        <form onSubmit={handleSubmit} name={name}>
          <Grid container sx={{ margin: "10px" }}>
            <Grid item xs={4}>
              <label htmlFor="username">Username: </label>
            </Grid>
            <Grid item xs={8}>
              <Input name="username" type="text" />
            </Grid>
            <Grid item xs={4}>
              <label htmlFor="password">Password: </label>
            </Grid>
            <Grid item xs={8}>
              <Input name="password" type="password" />
            </Grid>
            <Grid
              item
              xs={11}
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
                margin: "5px",
              }}
            >
              <Button variant="contained" type="submit">
                {displayName}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Container>
  );
};

export default AuthForm;
