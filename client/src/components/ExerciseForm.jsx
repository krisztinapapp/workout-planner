import React from 'react';
import {FormGroup, Label, Input} from 'reactstrap';

export const ExerciseForm = (props) => {
    return (
    <>
        <Label>Gyakorlat neve</Label>
        <Input
        name='exerciseName'
        onChange={(e) => props.handleExerciseChange(e, props.wi, props.ei)}
        value={props.exerciseData.exerciseName}
        />
        <Label>Kör</Label>
        <Input
        name='sets'
        type='number' min='1'
        onChange={(e) => props.handleExerciseChange(e, props.wi, props.ei)}
        value={props.exerciseData.sets}
        />
        <Label>Ismétlés</Label>
        <Input
        name='reps'
        type='number' min='1'
        onChange={(e) => props.handleExerciseChange(e, props.wi, props.ei)}
        value={props.exerciseData.reps}
        />
        <Label>Súly (kg)</Label>
        <Input
        name='weight'
        type='number' min='1'
        onChange={(e) => props.handleExerciseChange(e, props.wi, props.ei)}
        value={props.exerciseData.weight}
        />
        <Label>Távolság</Label>
        <Input
        name='distance'
        onChange={(e) => props.handleExerciseChange(e, props.wi, props.ei)}
        value={props.exerciseData.distance}
        />
        <Label>Idő</Label>
        <Input
        name='duration'
        onChange={(e) => props.handleExerciseChange(e, props.wi, props.ei)}
        value={props.exerciseData.duration}
        />
        <Label>Jegyzet</Label>
        <Input
        name='note'
        onChange={(e) => props.handleExerciseChange(e, props.wi, props.ei)}
        value={props.exerciseData.note}
        />
    </>
    );
}

export default ExerciseForm;