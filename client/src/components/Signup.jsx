import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Joi from 'joi-browser';
import { Form, FormGroup, Label, Input, FormText, Button } from 'reactstrap';
import { signup } from '../api';
import Menu from './Menu'

export const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCoach, setIsCoach] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const [signUpError, setSignUpError] = useState('');
  const [unknownError, setUnknownError] = useState('');
  
  const [success, setSuccess] = useState(false);

  const schema = Joi.object().keys({
    email: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  });

  const validate = () => {
    const result = Joi.validate({
      email: email,
      username: username,
      password: password,
      confirmPassword: confirmPassword
    }, schema, { 
      abortEarly: false
    });
    if(result.error) {
      for (const item of result.error.details) {
        switch(item.path[0]) {
          case 'email':
            setEmailError(item.message);
            break;
          case 'username':
            setUsernameError(item.message);
            break;
          case 'password':
            setPasswordError(item.message);
            break;
          case 'confirmPassword':
            setConfirmPasswordError(item.message);
            break;
          default:
            setUnknownError(item.message);
        }
      }
      return false;
    } else {
      return true;
    }
  }

  async function signUpUser(event) {
    event.preventDefault();

    if(validate()) {
      try {
        await signup({ email: email, username: username, password: password, isCoach: isCoach });
        setSuccess(true);
      } 
      catch(err) {
        setSignUpError('duplicate-email');
        console.log('Sign up error');
      }
    }
  }

  return (
    <>
    {success ? (
      <Navigate replace to='/login' />
    ) : (
      <>
      <Menu></Menu>
      <div className='container'>
    
        <h3>Új profil létrehozása.</h3>
        
        <div className='form-container'>
          <Form onSubmit={ signUpUser }>
            <FormGroup>
              <Label for='email-id'>Email cím</Label>
              <Input
                id='email-id'
                name='email'
                placeholder='email@email.hu'
                type='email'
                value={ email }
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
              />
              { emailError !== '' && <FormText>Kötelező megadnod az email címed.</FormText> }
              { signUpError === 'duplicate-email' && <FormText>Ehhez az email címhez már tartozik regisztráció. Jelentkezz be, vagy regisztrálj egy másik email címmel!</FormText> }
            </FormGroup>

            <FormGroup>
              <Label for='username-id'>Név</Label>
              <Input
                id='username-id'
                name='username'
                placeholder='Hogyan szólíthatunk?'
                type='text'
                value={ username }
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError('');
                }}
              />
              { usernameError !== '' && <FormText>Kötelező megadnod felhasználónevet.</FormText> }
            </FormGroup>

            <FormGroup>
              <Label for='password-id'>Jelszó</Label>
              <Input
                id='password-id'
                name='password'
                placeholder='******'
                type='password'
                value={ password }
                onChange={ (e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
              />
              { passwordError !== '' && <FormText>A jelszónak legalább 6 karakternek kell lennie.</FormText> }
            </FormGroup>

            <FormGroup>
              <Label for='confirm-password-id'>Jelszó megerősítése</Label>
              <Input
                id='confirm-password-id'
                name='confirm-password'
                placeholder='******'
                type='password'
                value={ confirmPassword }
                onChange={ (e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError('');
                }}
              />
              { confirmPasswordError !== '' && <FormText>A két jelszónak egyeznie kell.</FormText> }
            </FormGroup>

            <FormGroup>
              <Label for='isCoach-id'>Edzőként regisztrálsz?</Label>
              <Input
                id='isCoach-id'
                name='isCoach'
                type='checkbox'
                value={ isCoach }
                onChange={(e) => {
                  setIsCoach(e.target.checked);
                }}
              />
            </FormGroup>

            { unknownError !== '' && 
            <FormGroup>
              <FormText>{ unknownError }</FormText>
            </FormGroup>
            }

            <Button className='mt-3' id='btn-signup'>
              Regisztráció
            </Button>

          </Form>
        </div>
      </div>
      </>
    )}
    </>
  )
}

export default Signup;