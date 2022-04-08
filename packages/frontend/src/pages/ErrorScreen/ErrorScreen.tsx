import { Box, Button } from "@mui/material";
import React from "react";

type Props = {};

const ErrorScreen = ({ error, resetErrorBoundary }: any) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Button variant="contained" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </Box>
  );
};

export default ErrorScreen;
