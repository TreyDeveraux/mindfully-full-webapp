import { Box, Button, Input, FormLabel } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const router = useRouter()

  const handleResetPassword = async (e) => {
    e.preventDefault()
    const userInformation = {
      email,
      password: newPassword,
    }
    await fetch('/api/resetPassword', {
      method: 'POST',
      body: JSON.stringify(userInformation),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    router.push('/')
  }

  useEffect(() => {
    const userEmail = router.asPath.split('/')[2]
    setEmail(userEmail)
  })

  return (
    <Box>
      <form onSubmit={handleResetPassword}>
        <FormLabel>New Password</FormLabel>
        <Input type="email" value={email} readOnly />
        <Input
          type="password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button type="submit">Change Password</Button>
      </form>
    </Box>
  )
}

export default ForgotPassword