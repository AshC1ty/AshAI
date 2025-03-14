import './login.css'
import { SignIn } from '@clerk/clerk-react'

const Login = () => {
  return (
    <div className='login'>
      <SignIn path='/login' signUpUrl='/register' forceRedirectUrl="/dashboard" />
    </div>
  )
}

export default Login