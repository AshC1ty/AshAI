import './register.css'
import { SignUp } from '@clerk/clerk-react'

const Register = () => {
  return (
    <div className='register'>
      <SignUp path='/register' signInUrl='/login'/>
    </div>
  )
}

export default Register