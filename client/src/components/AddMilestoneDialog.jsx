import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Form, Label, Input, Button } from 'reactstrap';
import { addMilestone } from '../api';

const AddMilestoneDialog = () => {
  const [open, setOpen] = useState(false);
  const [milestone, setMilestone] = useState([{
    weight: '',
    arms: '',
    bust: '',
    waist: '',
    hips: '',
    thighs: '',
    calves: '',
  }]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMilestoneChange = (e) => {
    let data = [...milestone];
    data[0][e.target.name] = e.target.value;
    setMilestone(data);
  }

  const submit = () => {
    const asyncGetUserInfo = async () => {
      try {
        await addMilestone({milestone: milestone[0]});
      } catch(err) {
        console.log('Save error');
      }
    }
    asyncGetUserInfo();
    window.location.reload();
  };

  return (
    <div>
      <Button onClick={() => handleClickOpen()}>Új mérés felvétele</Button>
      <Dialog open={open} onClose={() => handleClose()}>
        <DialogTitle>Új mérés felvétele</DialogTitle>
        <DialogContent>
          <Form onSubmit={submit}>
            <Label for='weight'>Súly (kg)</Label>
            <Input
            name='weight'
            id='weight'
            type='number'
            min={1}
            onChange={(e) => handleMilestoneChange(e)}
            value={milestone[0].weight}
            />

            <Label for='bust'>Mellkas (cm)</Label>
            <Input
            name='bust'
            id='bust'
            type='number'
            min={1}
            onChange={(e) => handleMilestoneChange(e)}
            value={milestone[0].bust}
            />

            <Label for='waist'>Derék (cm)</Label>
            <Input
            name='waist'
            id='waist'
            type='number'
            min={1}
            onChange={(e) => handleMilestoneChange(e)}
            value={milestone[0].waist}
            />

            <Label for='hips'>Csípő (cm)</Label>
            <Input
            name='hips'
            id='hips'
            type='number'
            min={1}
            onChange={(e) => handleMilestoneChange(e)}
            value={milestone[0].hips}
            />

            <Label for='thighs'>Comb (cm)</Label>
            <Input
            name='thighs'
            id='thighs'
            type='number'
            min={1}
            onChange={(e) => handleMilestoneChange(e)}
            value={milestone[0].thighs}
            />

            <Label for='calves'>Vádli (cm)</Label>
            <Input
            name='calves'
            id='calves'
            type='number'
            min={1}
            onChange={(e) => handleMilestoneChange(e)}
            value={milestone[0].calves}
            />

            
            <Label for='arms'>Kar (cm)</Label>
            <Input
            name='arms'
            id='arms'
            type='number'
            min={1}
            onChange={(e) => handleMilestoneChange(e)}
            value={milestone[0].arms}
            />

          </Form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Bezárás</Button>
          <Button onClick={() => submit()}>Mentés</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddMilestoneDialog;