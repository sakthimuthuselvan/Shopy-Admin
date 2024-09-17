


import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import "./AlertComponent.css"

const MySnackbar = ({ open, type, handleClose, variant, message, duration }) => {
  return (
    <div className={`alert`} >
      <Snackbar
        open={open}
        autoHideDuration={duration ? duration : 6000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }} variant={variant ? variant : "standard"}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MySnackbar;
