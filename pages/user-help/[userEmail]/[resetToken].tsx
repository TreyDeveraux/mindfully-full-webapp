import Image from 'next/image'
import { Box, Flex, useMediaQuery } from '@chakra-ui/react'
//need to upload this to a cloud eventually
import backgroundImage from '../../../public/yoga-mat.jpeg'
import { ResetPasswordForm } from '../../../components/resetPasswordForm'

const ResetPasswordPage = () => {
  const [isMobile] = useMediaQuery('(max-width: 600px)')
  return (
    <Flex
      className="signin-wrapper"
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
      <ResetPasswordForm />
      <Image
        className="signin-background-image"
        src={backgroundImage}
        layout="fill"
        objectPosition={isMobile ? '95%' : '50%'}
        objectFit="cover"
      />
    </Flex>
  )
}

ResetPasswordPage.authPage = true

export default ResetPasswordPage
