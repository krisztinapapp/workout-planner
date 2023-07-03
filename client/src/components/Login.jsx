import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Joi from 'joi-browser';
import { Form, FormGroup, Label, Input, FormText, Button } from 'reactstrap';
import { login } from '../api'
import Menu from './Menu';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = () => {
    try {
      Joi.assert(email, Joi.string().required());
      return true;
    } catch(err) {
      setEmailError('username-required');
      return false;
    }
  }

  const validatePassword = () => {
    try {
      Joi.assert(password, Joi.string().required());
      return true;
    } catch(err) {
      setPasswordError('password-required');
      return false;
    }
  }

  async function logInUser(e) {
    e.preventDefault();

    let validInput = validateEmail();
    validInput = validatePassword() && validInput;

    if(validInput) {
      try {
        const res = await login({ email, password });
        localStorage.setItem('token', res.token);
        localStorage.setItem('isCoach', res.isCoach.toString());
        setSuccess(true);
      } catch (err) {
          setServerError('wrong-credentials');
      }
    }
  }

  return (
    <>
    { (localStorage.getItem('token') != null && localStorage.getItem('token') !== 'undefined')
      || success ? (
      <Navigate replace to='/user' />
    ) : ( 
    <> 
    <Menu></Menu>
    <div className='container'>
      <h3>Jelentkezz be a fiókodba.</h3>
      
      <div className='form-container'>
        <Form onSubmit={ logInUser }>
          <FormGroup>
            <Label for='email-id'>
              Email cím
            </Label>
            <Input
              id='email-id'
              name='email'
              placeholder='email@email.hu'
              type='email'
              onChange={ (e) => {
                setEmail(e.target.value);
                setEmailError('');
                setServerError('');
              }}
            />
            { emailError === 'email-required' && <FormText>Az email cím megadása kötelező.</FormText> }
          </FormGroup>

          <FormGroup>
            <Label for='password-id'>
                Jelszó
              </Label>
              <Input
                id='password-id'
                name='password'
                placeholder='******'
                type='password'
                onChange={ (e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                  setServerError('');
                }}
              />
              { passwordError === 'password-required' && <FormText>A jelszó megadása kötelező.</FormText> }
          </FormGroup>
          
          { serverError === 'wrong-credentials' && <p>Helytelen felhasználónév vagy jelszó.</p> }
          <Button className='mt-3' id='btn-login'>
            Bejelentkezés
          </Button>
        </Form>
      </div>
      <br/>
      <p>
          Nincs még fiókod? <Link to='/signup'>Regisztráció</Link>
      </p>
    </div>
    </>
    )}
    </>
  )
}

export default Login;