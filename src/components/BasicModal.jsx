import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import React from 'react';

export default function BasicModal(props) {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 50,
        p: 4,
    };
    const handleClose = () => setOpen(false);
    const {open, setOpen, title, children} = props;

    return (
        <div>
            <Modal  open={open}  onClose={handleClose} sx={{ bgcolor: 'rgba(0, 0, 0, 0.7)', padding: 10}} >
                <Box sx={style}>
                <h2 id="child-modal-title" className="text-center">{title}</h2>
                <div id="child-modal-description" sx={{ mt: 2 }}>
                    {children}
                </div>
                </Box>
            </Modal>
        </div>
    );
};
