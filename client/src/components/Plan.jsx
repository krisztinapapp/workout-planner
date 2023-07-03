import { Button } from 'reactstrap';
import { buyPlan, selectCurrentPlan, removeCurrentPlan, deletePlan, changePlanPublicity } from '../api';

const Plan = (props) => {
  const handlePurchase = async () => {
    await buyPlan({ plan: props.plan })
      .then((res) => { if (res.ok) window.location.reload(); })
      .catch(err => console.log(err));
  };

  const handleSelectCurrentPlan = async () => {
    await selectCurrentPlan(props.plan._id).catch(err => console.log(err));
    window.location.reload();
  };

  const handleRemoveCurrentPlan = async () => {
    await removeCurrentPlan(props.plan._id).catch(err => console.log(err));
    window.location.reload();
  };
  
  const handleDelete = async () => {
    const response = await deletePlan(props.plan._id).catch(err => console.log(err));
    if (response.status === 422) {
      alert("Nem tudod törölni ezt a tervet, mert valaki már megvásárolta. Ha nem szeretnéd, hogy elérhető legyen a publikus edzéstervek között, akkor a megfelelő gombbal állítsd privátra.");
    } else {
      window.location.reload();
    }
  };

  const handlePublicityChange = async (publicity) => {
    await changePlanPublicity({ public: publicity, planId: props.plan._id }).catch(err => console.log(err));
    window.location.reload();
  };

  const getDayOfTheWeek = (day) => {
    switch (day) {
      case 'monday': return 'hétfő';
      case 'tuesday': return 'kedd';
      case 'wednesday': return 'szerda';
      case 'thursday': return 'csütörtök';
      case 'friday': return 'péntek';
      case 'saturday': return 'szombat';
      case 'sunday': return 'vasárnap';
      default: return 'nincs nap hozzárendelve';
    }
  }

  return (
    <>
      <p>Időtartam: {props.plan.durationInWeeks} hét</p>
      <p>Edzések:</p>
      
      { props.plan.workouts.map((wo, wi) => (
        <div key={wi}>
          <p>{ wo.workoutName } { wo.dayOfTheWeek ? "(" + getDayOfTheWeek(wo.dayOfTheWeek) + ")" : "" }</p>
          <ul>
            { wo.exercises.map((ex, ei) => (
              <li key={ei}>
                { ex.exerciseName }
                { ex.sets || ex.reps || ex.weight || ex.ditance || ex.duration || ex.note ? ": " : <></>}
                { ex.sets ? (ex.sets + "x" + ( ex.reps ? ex.reps : "" )) : ( ex.reps ? ex.reps + "x" : "" ) } 
                { ex.weight ? " " + ex.weight + "kg" : "" }
                { ex.distance ? " " + ex.distance : "" }
                { ex.duration ? " " + ex.duration : "" }
                { ex.note ? " (" + ex.note + ")" : "" }
              </li>
            ))}
          </ul>
        </div>
      ))}
      { props.public ? <p>Ár: { props.plan.price ?? 0 } Ft</p> : <></> }
      { props.public ? (
        <><Button size='sm' onClick={() => handlePurchase()}>Vásárlás</Button>{' '}</>
      ) : ( !props.current ?
      <>
        <Button size='sm' onClick={() => handleSelectCurrentPlan()}>Kiválasztás</Button>{' '}
        <Button size='sm' onClick={() => handleDelete()}>Törlés</Button>{' '}
      </> :
        <Button size='sm' onClick={() => handleRemoveCurrentPlan()}>Befejezés</Button>
      )}
      { (localStorage.getItem('isCoach') === 'true' && !props.public && !props.current && !props.plan.public) ?
        <Button size='sm' onClick={() => handlePublicityChange(true)}>Publikálás</Button> : <></>
      }
      { (localStorage.getItem('isCoach') === 'true' && !props.public && !props.current && props.plan.public) ?
        <Button size='sm' onClick={() => handlePublicityChange(false)}>Legyen privát</Button> : <></>
      }
    </>
  )
}

export default Plan;