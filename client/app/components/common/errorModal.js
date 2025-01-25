import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ErrorPage from "./errorPage";

const ErrorModal = ({ error, setError }) => {
  return (
    <Modal 
      open={error}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <IconButton
          sx={{
            position: "absolute",
            top: 5,
            right: 5,
            zIndex: 2
          }}
          onClick={() => setError(false)}
        >
          <CloseIcon />
        </IconButton>
        <ErrorPage disableButton/>
      </Box>
    </Modal>
  )
}

export default ErrorModal;