import Image from 'next/image'
import { Box, Flex, useMediaQuery } from '@chakra-ui/react'
//need to upload this to a cloud eventually
import backgroundImage from '../public/yoga-mat.jpeg'
import SignupForm from '../components/signupForm'

//Im using classnames to make it easier to read. We can access these through css if needed but I'm going to try and avoid that
const Signup = () => {
  const [isMobile] = useMediaQuery('(max-width: 600px)')
  return (
    <Flex
      className="signup-wrapper"
      width="100vw"
      height="100vh"
      position="relative"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        className="overlay"
        width="100%"
        height="100%"
        position="absolute"
        backgroundColor="brand.overlay"
        top="0"
        left="0"
        zIndex="1"
      ></Box>
      <SignupForm mode="signup" />
      {/* <Image
        className="signin-background-image"
        src={testBackground}
        layout="fill"
        objectPosition={isMobile ? '95%' : '50%'}
        objectFit="cover"
      /> */}
      <Image
        className="signup-background-image"
        src={backgroundImage}
        layout="fill"
        objectPosition={isMobile ? '95%' : '50%'}
        objectFit="cover"
      />
    </Flex>
  )
}

Signup.authPage = true

export default Signup
