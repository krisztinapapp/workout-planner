import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Form, Label, Input, Button, ListGroup, ListGroupItem, Badge } from 'reactstrap';
import { getUserInfo, addChallenge, getChallenges, updateRanking, finishChallenge, getRankings } from '../api';
import Menu from './Menu';

const Challenges = () => {
  const [user, setUser] = useState({});
  const [fields, setFields] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [healthRankings, setHealthRankings] = useState([]);
  const [strengthRankings, setStrengthRankings] = useState([]);
  const [cardioRankings, setCardioRankings] = useState([]);

  useEffect(() => {
    const asyncGetUserInfo = async () => {
      const user = await getUserInfo();
      setUser(user);
    }
    asyncGetUserInfo();
  }, []);

  useEffect(() => {
    const asyncGetChallenges = async () => {
      const challenges = await getChallenges();
      setChallenges(challenges);
    }
    asyncGetChallenges();
  }, []);

  useEffect(() => {
    const asyncGetRankings = async () => {
      const rankings = await getRankings();
      rankings.map((data) => {
        switch (data.category) {
          case "health": setHealthRankings(data.ranking.sort((a,b) => b.points - a.points)); break;
          case "strength": setStrengthRankings(data.ranking.sort((a,b) => b.points - a.points)); break;
          case "cardio": setCardioRankings(data.ranking.sort((a,b) => b.points - a.points)); break;
          default: break;
        }
      });
    }
    asyncGetRankings();
  }, []);

  const handleFieldsChange = (e) => {
    let data = [...fields];
    data[0][e.target.name] = e.target.value;
    setFields(data);
  }

  const submit = () => {
    const asyncAddChallenge = async () => {
      try {
        console.log(fields[0]);
        await addChallenge({user: user._id, challenge: fields[0]});
      } catch(err) {
        console.log('Save error');
      }
    }
    asyncAddChallenge();
  };

  const asyncUpdateRanking = async (type, points) => {
    const res = await updateRanking({username: user.username, category: type, userPoints: points});
    return res;
  }

  const handleFinishChallenge = async (challenge) => {
    const type = challenge.type;
    const rankings = user.rankings;
    const newPoints = rankings[type] + challenge.points;
    const newRankings = 
      type === 'strength' ? { 'strength': newPoints, 'health': rankings.health, 'cardio': rankings.cardio} :
      type === 'health' ? { 'strength': rankings.strength, 'health': newPoints, 'cardio': rankings.cardio} :
      type === 'cardio' ? { 'strength': rankings.strength, 'health': rankings.health, 'cardio': newPoints} :
      null;
    await finishChallenge({challenge: challenge, rankings: newRankings})
      .then((res) => {
        if(res[type] === newPoints)
          asyncUpdateRanking(type, newPoints);
    })
      .catch((err) =>
      console.log('Error saving finished challenge')
    )

    window.location.reload();
  };
  
  return (
    <>
    { localStorage.getItem('token') == null || localStorage.getItem('token') === 'undefined' ? (
      <Navigate replace to='/login' />
    ) : (
    <>
      <Menu></Menu>
      <div className='container'>
        <h3>Kihívások</h3>
        <ListGroup>
          { challenges?.map((challenge, i) => {
            return (
              <ListGroupItem key={i}>
                {challenge.name} | {
                challenge.type === 'strength' ? (<> erő </>) :
                challenge.type === 'cardio' ? (<> cardio </>) :
                challenge.type === 'health' ? (<> egészség </>) : (<></>)
              } 
                <Badge className='badge' pill>{challenge.points + ' pont'}</Badge>{' '}
              { !user.challenges.includes(challenge._id) ?
                <Badge className='badge' style={{ cursor: 'pointer' }} onClick={() => { 
                  handleFinishChallenge(challenge); 
                }}>Sikerült!</Badge> : <></>
              }
              </ListGroupItem>
            )
          })}
        </ListGroup>

        { localStorage.getItem('isCoach') === 'true' ? (
            fields.length ? (
              <>
              <h5>Új kihívás létrehozása</h5>
              <Form onSubmit={submit}>
                <Label for='name'>Kihívás neve</Label>
                <Input
                name='name'
                id='name'
                onChange={(e) => handleFieldsChange(e)}
                value={fields[0].name}
                />

                <Label for="type">
                  Kihívás típusa
                </Label>
                <Input
                  id="type"
                  name="type"
                  type="select"
                  onChange={(e) => handleFieldsChange(e)}
                  value={fields[0].type}
                >
                  <option value='health'>
                    egészség
                  </option>
                  <option value='strength'>
                    erő
                  </option>
                  <option value='cardio'>
                    cardio
                  </option>
                </Input>

                <Label for='points'>Pontszám</Label>
                <Input
                name='points'
                id='points'
                type='number'
                min={1}
                onChange={(e) => handleFieldsChange(e)}
                value={fields[0].points}
                />
              </Form>
              
              <Button className='mt-3' onClick={() => { submit(); window.location.reload(); }}>Mentés</Button>{' '}
              <Button className='mt-3' onClick={() => setFields([])}>Mégsem</Button>
              </>
            ) : (
              <Button className='mt-3' onClick={() => setFields([{name : '', type: undefined, points: ''}])}>Új kihívás</Button>
            )
          ) : (<></>)
        }
        
        <h3>Ranglisták</h3>
        <div className='ranking-grid-container'>
          <ListGroup className='ranking-grid'>
          <h5>Egészség</h5>
          { healthRankings?.map((data, i) => {
            return (
              <ListGroupItem key={i}>
                {data.username} <Badge pill>{data.points + " pont"}</Badge>
              </ListGroupItem>
            )
          })}
          </ListGroup>

          <ListGroup className='ranking-grid'>
          <h5>Erő</h5>
          { strengthRankings?.map((data, i) => {
            return (
              <ListGroupItem key={i}>
                {data.username}    <Badge pill>{data.points + " pont"}</Badge>
              </ListGroupItem>
            )
          })}
          </ListGroup>

          <ListGroup className='ranking-grid'>
          <h5>Kardio</h5>
          { cardioRankings?.map((data, i) => {
            return (
              <ListGroupItem key={i}>
                {data.username}    <Badge pill>{data.points + " pont"}</Badge>
              </ListGroupItem>
            )
          })}
          </ListGroup>
        </div>
      </div>
    </>
    )}
    </>
  )
}

export default Challenges;