import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  Grid,
  responsiveFontSizes,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const theme = responsiveFontSizes(createTheme());

export const IntroModal = ({ isModalOpen, onClose }) => {
  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={isModalOpen}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "1rem",
            backgroundColor: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            overflowY: "auto",
          },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: {
                xs: "1rem",
                sm: "2rem",
              },
              backgroundColor: "#ffffff",
              borderRadius: "1rem",
              textAlign: "center",
              boxShadow:
                "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Typography variant="h6" gutterBottom>
              It seems you like don't have any pieces right now.
            </Typography>
            <Typography gutterBottom>
              You can add pieces through a program
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href="/program/create"
              fullWidth
              sx={{ marginBottom: "1rem",padding: ".5rem .25rem", width: "60%", textAlign: "center" }}
            >
              Add a program
            </Button>
            <Typography gutterBottom>
              Or you can also add detailed info for each piece individually
              (like places to practice and tempos)
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              href="/piece/create"
              fullWidth
              sx={{ marginBottom: "1rem", padding: ".5rem .25rem", width: "60%", textAlign: "center" }}
            >
              Add a piece
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};
