import { Box, Flex, FormLabel, Input } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import logo from '../public/placeholderLogo.png'
import Link from 'next/link'
import { OutlineButton } from './buttons'
import { useRouter } from 'next/router'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  ScaleFade,
} from '@chakra-ui/react'

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const mailObj = {
      email,
    }

    await fetch('/api/mail', {
      method: 'POST',
      body: JSON.stringify(mailObj),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res.status === 401) {
        setError(true)
        setSuccess(false)
        console.log(error)
      } else {
        setEmail('')
        setSuccess(true)
        setError(false)
        setTimeout(() => {
          router.push('/signin')
        }, 3000)
      }
    })
  }

  useEffect(() => {
    onOpen()
  })

  //Responsivness here is bit buggy on my computer, may or may not actually be weird on the phone
  return (
    <Flex
      className="forgot-pass-form-wrapper"
      alignItems="center"
      direction="column"
      position="absolute"
      zIndex="5"
    >
      <Box className="form-image-container" marginBottom="35px">
        <Image src={logo} priority={true} layout="fixed" />
      </Box>
      <Flex
        className="forgot-pass-form-container"
        justifyContent="center"
        width="500px"
        height="auto"
        backgroundColor={['transparent', 'transparent', '#fff']}
        borderRadius="13px"
        padding="30px"
      >
        <Box className="forgot-pass-form-container" width="100%">
          {!error && !success && (
            <ScaleFade initialScale={0.9} in={isOpen}>
              <Box mb="20px">
                <Alert status="info">
                  <AlertIcon />
                  Enter Email Address
                </Alert>
              </Box>
            </ScaleFade>
          )}
          {error && (
            <ScaleFade initialScale={0.9} in={isOpen}>
              <Box mb="20px">
                <Alert status="error">
                  <AlertIcon />
                  User does not exist!
                </Alert>
              </Box>
            </ScaleFade>
          )}
          {success && (
            <ScaleFade initialScale={0.9} in={isOpen}>
              <Box mb="20px">
                <Alert status="success">
                  <AlertIcon />
                  Success! Check your email!
                </Alert>
              </Box>
            </ScaleFade>
          )}
          <form onSubmit={handleSubmit}>
            <Flex
              className="forgot-pass-form-content"
              direction="column"
              alignItems="center"
              justifyContent="space-around"
              padding={['10px', '10px', '0']}
            >
              <Box className="forgot-pass-input" width="100%" pb="5">
                <FormLabel htmlFor="email" color={['#fff', '#fff', '#000']}>
                  Email
                </FormLabel>
                <Input
                  id="email"
                  type="email"
                  height="48px"
                  borderStyle="solid"
                  borderWidth={1}
                  borderColor="#CCC"
                  borderRadius={4}
                  backgroundColor={['#fff', '#fff', 'transparent']}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError(false)
                    onOpen()
                    onClose()
                  }}
                />
              </Box>
              <Box className="forgot-pass-button">
                <OutlineButton
                  text={'Submit'}
                  type={'submit'}
                  loading={isLoading}
                  backgroundColor="transparent"
                  border="1px solid #ccc"
                  borderRadius={4}
                  disabled={false}
                />
              </Box>
            </Flex>
          </form>
        </Box>
      </Flex>
      <Flex
        justifyContent="center"
        height="100px"
        mt="5px"
        color="white"
        fontSize="text.xs"
      >
        <Link href="/signin">Back to Sign In</Link>
      </Flex>
    </Flex>
  )
}
