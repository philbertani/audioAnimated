import React from "react";

import { Box } from "@mui/material";

const NotFound = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>ERROR: Page not found</h1>
      <img
        src="https://media.istockphoto.com/id/1278808623/vector/cat-sits-in-a-box-with-a-404-sign-page-or-file-not-found-connection-error.jpg?s=612x612&w=0&k=20&c=oQLypQ5q2p6-5o3-jvZzbPMxS2XPVt8_dCCnvBVL8R4="
        alt="cat with 404 error sign"
      />
    </Box>
  );
};

export default NotFound;
