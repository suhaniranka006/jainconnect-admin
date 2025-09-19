import React, { useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import TithiList from './tithiList';
import TithiForm from './tithiForm';

function TithiListWrapper() {
  const [openForm, setOpenForm] = useState(false);
  const [editTithi, setEditTithi] = useState(null);

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => {
          setEditTithi(null);
          setOpenForm(true);
        }}
      >
        Add Tithi
      </Button>

      <TithiList
        onEdit={(tithi) => {
          setEditTithi(tithi);
          setOpenForm(true);
        }}
      />

      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <Box
          sx={{
            p: 4,
            backgroundColor: 'white',
            margin: 'auto',
            mt: 5,
            width: 400,
            borderRadius: 2,
          }}
        >
          <TithiForm
            editTithi={editTithi}
            onCancel={() => setOpenForm(false)}
            onAdd={() => setOpenForm(false)}
            onUpdate={() => setOpenForm(false)}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default TithiListWrapper;
