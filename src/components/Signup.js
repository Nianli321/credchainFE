import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import ImageHeader from './Header'
import { db, auth} from '../firebase'
import { getAuth} from 'firebase/auth';

export default function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()
    const name = e.nativeEvent.submitter.name
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }
    const email = emailRef.current.value;
    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      if (name === "admin") {
        let ref = db.ref('/Roles');
        ref.child("admin").set({admin: email})
      }
      history.push("/")
    } catch {
      setError("Failed to create an account")
    }

    setLoading(false)
  }

  return (
    <>
      <Card>
        <Card.Body>
          <ImageHeader/>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button disabled={loading} name="user" className="w-50" type="submit">
              Sign Up As An Identity Holder
            </Button>
            <Button disabled={loading} name="admin" className="w-50" type="submit">
              Sign Up As An Issuer
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </>
  )
}
