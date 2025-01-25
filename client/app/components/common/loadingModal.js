import { Modal } from "@mui/material";
import LoadingPage from "./loadingPage";

const LoadingModal = ({ loading }) => {
  return (
    <Modal 
      open={loading}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LoadingPage />
    </Modal>
  )
}

export default LoadingModal;