import React, { useState } from 'react';
import { Button } from 'reactstrap';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { LineChart, Line, XAxis, YAxis, Legend } from 'recharts';
import Milestone from './Milestone';

const ShowMilestoneDialog = (props) => {
    const [open, setOpen] = useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div>
        <Button onClick={() => handleClickOpen()}>Statisztikák megtekintése</Button>
        <Dialog open={open} fullWidth maxWidth="m" onClose={() => handleClose()}>
          <DialogTitle>Mérföldkövek</DialogTitle>
          <DialogContent dividers={true}>
          <LineChart width={500} height={200} data={props.data.slice(-5)}>
              <Line type="monotone" name="súly" dataKey="weight" stroke="#8884d8" strokeWidth={2} connectNulls/>
              <XAxis dataKey="date" />
              <YAxis />
              <Legend />
            </LineChart>
            <LineChart width={500} height={300} data={props.data.slice(-5)}>
              <Legend />
              <Line type="monotone" name="kar" dataKey="arms" stroke="#8884d8" strokeWidth={2} connectNulls/>
              <Line type="monotone" name="mellkas" dataKey="bust" stroke="#4e1b56" strokeWidth={2} connectNulls/>
              <Line type="monotone" name="derék" dataKey="waist" stroke="#c71e59" strokeWidth={2} connectNulls/>
              <Line type="monotone" name="csípő" dataKey="hips" stroke="#ff2a2a" strokeWidth={2} connectNulls/>
              <Line type="monotone" name="comb" dataKey="thighs" stroke="#f77f00" strokeWidth={2} connectNulls/>
              <Line type="monotone" name="lábszár" dataKey="calves" stroke="#fadc5b" strokeWidth={2} connectNulls/>
              <XAxis dataKey="date" />
              <YAxis />
              
            </LineChart>
            <DialogContentText component={'div'}>
            { props.data?.map((milestone, i) => 
            <div  key={i}>
                <Milestone data={milestone}></Milestone>
            </div>
            ).reverse()}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose()}>Bezárás</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}

export default ShowMilestoneDialog;