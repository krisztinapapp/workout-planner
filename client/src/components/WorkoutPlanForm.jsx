import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Joi from 'joi-browser';
import { Form, FormGroup, FormText, Label, Input, Button } from 'reactstrap';
import { savePlan } from '../api';
import ExerciseForm from './ExerciseForm';
import Menu from './Menu';

export const WorkoutPlanForm = () => {
  const [isCoach, setIsCoach] = useState('');
  const [planName, setPlanName] = useState('');
  const [durationInWeeks, setDurationInWeeks] = useState('');
  const [price, setPrice] = useState('');
  const [publicity, setPublicity] = useState(false);
  const [workouts, setWorkouts] = useState([{
    workoutName: '',
    dayOfTheWeek: 'monday',
    exercises: [{
      exerciseName: '',
      sets: '',
      reps: '',
      weight: '',
      distance: '',
      duration: '',
      note: '',
    }],
  },]);

  const [planNameError, setPlanNameError] = useState('');
  const [durationInWeeksError, setDurationInWeeksError] = useState('');
  const [workoutNameError, setWorkoutNameError] = useState('');
  const [exerciseNameError, setExerciseNameError] = useState('');
  const [unknownError, setUnknownError] = useState('');
  const [success, setSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    setIsCoach(localStorage.getItem('isCoach') === 'true')
  }, []);

  const planSchema = Joi.object().keys({
    planName: Joi.string().required(),
    durationInWeeks: Joi.string().required(),
  });

  const workoutSchema = Joi.object().keys({
    workoutName: Joi.string().required(),
  });

  const exerciseSchema = Joi.object().keys({
    exerciseName: Joi.string().required(),
  });

  const validate = () => {
    let planErr = false;
    let woErr = false;
    let exErr = false;

    const planValidationResult = Joi.validate({
      planName: planName,
      durationInWeeks: durationInWeeks
    }, planSchema, { 
      abortEarly: false
    });
    if(planValidationResult.error) {
      planErr = true;
      for (const item of planValidationResult.error.details) {
        switch(item.path[0]) {
          case 'planName':
            setPlanNameError('Az edzésterv nevének kitöltése kötelező!');
            break;
          case 'durationInWeeks':
            setDurationInWeeksError('Az edzésterv időtartamának megadása kötelező!');
            break;
          default:
            setUnknownError('Hiba történt az űrlap ellenőrzésekor.');
        }
      }
    }

    workouts.map((wo) => {
      const woResult = Joi.validate({
        workoutName: wo.workoutName
      }, workoutSchema, { 
        abortEarly: false
      });
      if (woResult.error) {
        setWorkoutNameError('Minden edzés nevének kitöltése kötelező!');
        woErr = true;
      }
      wo.exercises.map((ex) => {
        const exResult = Joi.validate({
          exerciseName: ex.exerciseName,     
        }, exerciseSchema, { 
          abortEarly: false
        });
        if (exResult.error) {
          setExerciseNameError('Minden gyakorlat nevének kitöltése kötelező!');
          exErr = true;
        }
        return ex;
      })
      return wo;
    });
    if (!woErr) setWorkoutNameError('');
    if (!exErr) setExerciseNameError('');

    if (!planErr && !woErr && !exErr) return true;
    else return false;
  }

  const handleWorkoutChange = (e, i) => {
    let data = [...workouts];
    data[i][e.target.name] = e.target.value;
    setWorkouts(data);
  }

  const handleExerciseChange = (e, wi, ei) => {
    let data = [...workouts];
    data[wi]['exercises'][ei][e.target.name] = e.target.value;
    setWorkouts(data);
  }

  const addWorkout = () => {
    let object = {
        workoutName: '',
        dayOfTheWeek: '',
        exercises: [{
          exerciseName: '',
          sets: '',
          reps: '',
          weight: '',
          distance: '',
          duration: '',
          note: '',
        }]
    };

    setWorkouts([...workouts, object]);
  }

  const removeWorkout = (i) => {
      let data = [...workouts];
      data.splice(i, 1);
      setWorkouts(data);
  }

  const addExercise = (wi) => {
    let data = [...workouts];
    let exercises = data[wi]['exercises'];
    let object = {
        exerciseName: '',
        sets: '',
        reps: '',
        weight: '',
        distance: '',
        duration: '',
        note: ''
    }
    data[wi]['exercises'] = [...exercises, object];

    setWorkouts(data);
  }

  const removeExercise = (wi, ei) => {
      let data = [...workouts];
      data[wi]['exercises'].splice(ei, 1);

      setWorkouts(data);
  }

  async function submit(e) {
    e.preventDefault();
    
    if(validate()) {
      try {
        if(isCoach) {
          await savePlan({ plan: {
            planName: planName,
            durationInWeeks: durationInWeeks,
            workouts: workouts,
            price: price,
            public: publicity
          }});
        }
        else {
          await savePlan({ plan: {
            planName: planName,
            durationInWeeks: durationInWeeks,
            workouts: workouts
          }});
        }
        setSuccess(true);
      }
      catch(err) {
        setSaveError('Nem sikerült elmenteni az edzéstervedet.');
        console.log('Save error');
      }
    }
    else {
      window.scrollTo(0, 0);
    }
  }

  return (
    <>
    { localStorage.getItem('token') == null || localStorage.getItem('token') === 'undefined' ? (
      <Navigate replace to='/login' />
    ) : (
    <>
      <Menu></Menu>
      <div className="container form-container">
        <h3>Új edzésterv létrehozása</h3>
        { success ? <Navigate replace to='/my-plans' /> : <p>{saveError}</p> }
        { planNameError !== '' && <><FormText>{ planNameError }</FormText><br/></> }
        { durationInWeeksError !== '' && <><FormText>{ durationInWeeksError }</FormText><br/></> }
        { workoutNameError !== '' && <><FormText>{ workoutNameError }</FormText><br/></> }
        { exerciseNameError !== '' && <><FormText>{ exerciseNameError }</FormText><br/></> }
        { unknownError !== '' && <><FormText>{ unknownError }</FormText><br/></> }
        <Form onSubmit={submit}>
          <Label for='planName-id'>Edzésterv neve</Label>
          <Input
          name='planName'
          id='planName-id'
          onChange={(e) => {
            setPlanName(e.target.value);
            setPlanNameError('');
          }}
          value={planName}
          />
          <Label for='durationInWeeks-id'>Időtartam (hét)</Label>
          <Input
          name='durationInWeeks'
          id='durationInWeeks-id'
          type='number' min='1'
          onChange={(e) => {
            setDurationInWeeks(e.target.value);
            setDurationInWeeksError('');
          }}
          value={durationInWeeks}
          />
          { isCoach ? (
            <>
              <Label for='price-id'>Ár (Ft)</Label>
              <Input
              name='price'
              id='price-id'
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              />
              <Label for='publicity-id'>Publikus</Label>
              <Input
              name='publicity'
              id='publicity-id'
              type='checkbox'
              onChange={(e) => setPublicity(e.target.checked)}
              value={publicity}
              />
            </>
          ) : (<></>)}
          {workouts.map((workout, wi) => {
            return (
              <div key={wi}>
                <FormGroup className='square border border-2 mt-3 p-3'>
                  <Label>Edzés neve</Label>
                  <Input
                  name='workoutName'
                  onChange={(e) => handleWorkoutChange(e, wi)}
                  value={workout.workoutName}
                  />
                  <Label>Melyik napon?</Label>
                  <Input
                  name='dayOfTheWeek'
                  type='select'
                  onChange={(e) => handleWorkoutChange(e, wi)}
                  value={workout.dayOfTheWeek}
                  >
                    <option value='monday'>
                      hétfő
                    </option>
                    <option value='tuesday'>
                      kedd
                    </option>
                    <option value='wednesday'>
                      szerda
                    </option>
                    <option value='thursday'>
                      csütörtök
                    </option>
                    <option value='friday'>
                      péntek
                    </option>
                    <option value='saturday'>
                      szombat
                    </option>
                    <option value='sunday'>
                      vasárnap
                    </option>
                  </Input>

                  

                  { workout.exercises.map((exercise, ei) => {
                      return (
                        <FormGroup className='square border mt-3 p-3' key={ei}>
                          <ExerciseForm
                          handleExerciseChange={ handleExerciseChange }
                          exerciseData={exercise}
                          wi={wi}
                          ei={ei}
                          ></ExerciseForm>
                          { workout.exercises.length > 1 ? 
                            <Button className='m-2' onClick={() => removeExercise(wi, ei)}>Eltávolítás</Button> : <></> 
                          }
                      </FormGroup>
                      )
                  })}
                  <Button className='m-2' onClick={() => addExercise(wi)}>Új gyakorlat</Button>

                  { workouts.length > 1 ? <Button className='m-2' onClick={() => removeWorkout(wi)}>Eltávolítás</Button> : <></> }
                </FormGroup>
              </div>
            )
          })}
          <Button className='m-2' onClick={() => addWorkout()}>Új edzés</Button>
        </Form>
        <Button color='primary' className='m-2' onClick={submit}>Mentés</Button>
      </div>
    </>
  )}
  </>
  )
}

export default WorkoutPlanForm;