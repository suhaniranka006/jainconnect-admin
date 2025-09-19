import React, { useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import EventList from './eventList';
import EventForm from './eventForm';

function EventListWrapper() {
  const [openForm, setOpenForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => {
          setEditEvent(null);
          setOpenForm(true);
        }}
      >
        Add Event
      </Button>

      <EventList
        onEdit={(event) => {
          setEditEvent(event);
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
          <EventForm
            editEvent={editEvent}
            onCancel={() => setOpenForm(false)}
            onAdd={() => setOpenForm(false)}
            onUpdate={() => setOpenForm(false)}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default EventListWrapper;
