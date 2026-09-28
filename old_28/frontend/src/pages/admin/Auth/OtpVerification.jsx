import { useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import Button from '../../../components/admin/common/Button'

export default function OtpVerification() {
  const navigate = useNavigate()
  const [values, setValues] = useState(Array(6).fill(''))
  const refs = useRef([])

  const handleChange = (i, val) => {
    if (!/^[0-9]?$/.test(val)) return
    const next = [...values]
    next[i] = val
    setValues(next)
    if (val && i < 5) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !values[i] && i > 0) refs.current[i - 1]?.focus()
  }

  return (
    <AuthLayout title="Verify your email" subtitle="Enter the 6-digit code we sent to your inbox.">
      <div className="flex gap-2 justify-between">
        {values.map((v, i) => (
          <input
            key={i}
            ref={el => (refs.current[i] = el)}
            value={v}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            maxLength={1}
            inputMode="numeric"
            className="h-14 w-12 text-center text-lg font-semibold rounded-xl border border-slate-200 focus:border-indigo-400 focus-ring"
          />
        ))}
      </div>
      <Button onClick={() => navigate('/reset-password')} className="w-full justify-center mt-6">
        Verify code
      </Button>
      <p className="text-sm text-slate-500 mt-6 text-center">
        Didn't get a code? <button className="text-indigo-600 font-medium hover:underline">Resend</button>
      </p>
      <p className="text-sm text-slate-500 mt-2 text-center">
        <Link to="/login" className="text-slate-400 hover:underline">Back to sign in</Link>
      </p>
    </AuthLayout>
  )
}
