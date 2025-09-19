import React, { useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import MaharajList from './maharajList';
import MaharajForm from './maharajForm';

function MaharajListWrapper() {
  const [openForm, setOpenForm] = useState(false);
  const [editMaharaj, setEditMaharaj] = useState(null);

  return (
    <div>
      <Button onClick={() => { setEditMaharaj(null); setOpenForm(true); }}>
        Add Maharaj
      </Button>

      <MaharajList
        onEdit={(maharaj) => { setEditMaharaj(maharaj); setOpenForm(true); }}
      />

      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <Box sx={{ p: 4, backgroundColor: 'white', margin: 'auto', mt: 5, width: 400 }}>
          <MaharajForm
            editMaharaj={editMaharaj}
            onCancel={() => setOpenForm(false)}
            onAdd={() => setOpenForm(false)}
            onUpdate={() => setOpenForm(false)}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default MaharajListWrapper;
