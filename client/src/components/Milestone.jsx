import { Button } from 'reactstrap';
import { deleteMilestone } from '../api';

const Milestone = (props) => { 
  const handleDelete = async () => {
    await deleteMilestone(props.data._id).catch(err => console.log(err));
    window.location.reload();
  }

  return (
    <>
    <div className='grid-container'>
        <div className='grid-item'>{props.data.date}</div>
        <div className='grid-item'>Súly: {props.data.weight ? props.data.weight + ' kg' : '-'}</div>
        <div className='grid-item'><Button size="sm" onClick={() => handleDelete()}>Törlés</Button></div>
        <div className='grid-item'>Mellkas: {props.data.bust ? props.data.bust + ' cm' : '-'}</div>
        <div className='grid-item'>Derék: {props.data.waist ? props.data.waist + ' cm' : '-'}</div>
        <div className='grid-item'>Csípő: {props.data.hips ? props.data.hips + ' cm' : '-'}</div>
        <div className='grid-item'>Comb: {props.data.thighs ? props.data.thighs + ' cm' : '-'}</div>
        <div className='grid-item'>Vádli: {props.data.calves ? props.data.calves + ' cm' : '-'}</div>
        <div className='grid-item'>Kar: {props.data.arms ? props.data.arms + ' cm' : '-'}</div>
    </div>
    </>
    )
}

export default Milestone;