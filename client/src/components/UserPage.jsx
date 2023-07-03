import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Form, Input, Button } from 'reactstrap';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

import { getUserInfo, uploadPicture, getPictures, deletePicture, getCurrentPlans } from '../api';
import path from '../config/config.js';
import Menu from './Menu';
import PlansList from './PlansList';
import Milestone from './Milestone';
import AddMilestoneDialog from './AddMilestoneDialog';
import ShowMilestonesDialog from './ShowMilestonesDialog';

const UserPage = () => {
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [currentPlans, setCurrentPlans] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pictureForDelete, setPictureForDelete] = useState(null);

  useEffect(() => {
      const asyncGetPictures = async () => {
          const pictures = await getPictures();
          setPictures(pictures);
      }
      asyncGetPictures();
  }, [])

  useEffect(() => {
    const asyncGetCurrentPlans = async () => {
        const plans = await getCurrentPlans();
        setCurrentPlans(plans);
    }
    asyncGetCurrentPlans();
}, [])

  useEffect(() => {
    const asyncGetUserInfo = async () => {
      const user = await getUserInfo();
      setUser(user);
    }
    asyncGetUserInfo();
  }, []);

  const handlePictureUpload = async (e) => {
    e.preventDefault();
    await uploadPicture(selectedFile);
    window.location.reload();
  }

  const handlePictureDelete = async () => {
    await deletePicture(pictureForDelete);
    window.location.reload();
  }

  const openPictureDialog = async (id) => {
    setPictureForDelete(id);
    setOpen(true);
  }
  
  return (
    <>
    { localStorage.getItem('token') == null || localStorage.getItem('token') === 'undefined' ? (
      <Navigate replace to='/login' />
    ) : (
    <>
    <Menu></Menu>
    <div className='container'>
      <h3>Hello, { user.username }!</h3>

      <div className='section'>  
        <h5>Fejlődésed számokban</h5>
        { user.milestones?.length ?
        <>
          <p>Legutóbbi mérésed alapján:</p>
          <Milestone data={user.milestones[user.milestones.length-1]}></Milestone>
          <ShowMilestonesDialog data={user.milestones}></ShowMilestonesDialog>
        </> : <></>
        }
        <AddMilestoneDialog></AddMilestoneDialog>
      </div>

      <div className='section'>      
        <h5>Képek</h5>
        { pictures?.map((pic, i) => {
          return (
            <img key={i} style={{width: `200px`}} alt='' src={`${path}/api/pictures/${pic._id}?token=${localStorage.getItem('token')}`} onClick={() => openPictureDialog(pic._id)}/>           
          )
        })}
        <Form onSubmit={handlePictureUpload}>
          <Input
            name='upload-file'
            id='upload-file' 
            type='file' 
            onChange={(e) => { setSelectedFile(e.target.files[0]) }}
            accept='image/png, image/jpg, image/gif, image/jpeg'
          />
          <Button type='file'>Feltöltés</Button>
        </Form>
      </div>

      <div className='section'>  
        <h5>Aktuális edzésterved</h5>
        <PlansList plans={currentPlans} current={true} public={false}></PlansList>
      </div>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar />
      </LocalizationProvider>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Kép törlése</DialogTitle>
        <DialogContent>
          Szeretnéd törölni a képet?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handlePictureDelete(pictureForDelete)}>Törlés</Button>
          <Button onClick={() => setOpen(false)}>Mégsem</Button>
        </DialogActions>
      </Dialog>

    </div>    
  </>
  )}
  </>
  )
}

export default UserPage;