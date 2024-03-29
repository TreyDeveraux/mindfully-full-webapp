import {
  Box,
  Flex,
  Input,
  Textarea,
  FormLabel,
  FormControl,
  NumberInput,
  NumberInputField,
  NumberIncrementStepper,
  NumberInputStepper,
  NumberDecrementStepper,
  InputGroup,
  InputLeftElement,
  DrawerFooter,
  Button,
} from '@chakra-ui/react'
import Script from 'next/script'
import { CldImage, CldUploadWidget } from 'next-cloudinary'
import { PhoneIcon } from '@chakra-ui/icons'
import ImageUploader from './imageUploader'
import { useState } from 'react'
import { useProfile } from '../lib/hooks'

//Will eventually use some context here. Will try and stick to just the built in context for most of it

const CreateClientForm = ({ onClose }) => {
  const { user } = useProfile()
  const [previewImg, setPreviewImg] = useState('')
  const [imgUrl, setImgUrl] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState(0)
  const [phone, setPhone] = useState(0)
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = {
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      age,
      phone,
      email: email.toLowerCase(),
      about: bio.toLowerCase(),
      trainerID: user.id,
      fullName: firstName.toLowerCase() + ' ' + lastName.toLowerCase(),
      imageUrl: imgUrl,
    }
    fetch(`${window.location.origin}/api/clientCRUD`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        console.log('Client Created!')
        return res.json()
      })
      .catch((error) => error)
  }

  return (
    <>
      <FormControl position="relative" h="100%" overflow="hidden">
        <form onSubmit={handleSubmit}>
          <Box>
            <FormLabel>Profile Image</FormLabel>
            <Script
              src="https://upload-widget.cloudinary.com/global/all.js"
              type="text/javascript"
            />
            <CldUploadWidget
              signatureEndpoint="/api/cldSig"
              onUpload={(result, widget) => {
                setPreviewImg(result.info.public_id)
                setImgUrl(result.info.secure_url)
              }}
            >
              {({ open }) => {
                function handleOnClick(e) {
                  e.preventDefault()
                  open()
                }
                return (
                  <>
                    {previewImg.length > 0 ? (
                      <CldImage
                        width="100"
                        height="100"
                        src={previewImg}
                        alt="Profile image for new client"
                      />
                    ) : (
                      <Button onClick={handleOnClick}>Upload an Image</Button>
                    )}
                  </>
                )
              }}
            </CldUploadWidget>
            {/* <ImageUploader /> */}
          </Box>
          <Box margin="12px 0 12px 0">
            <FormLabel>First Name</FormLabel>
            <Input onChange={(e) => setFirstName(e.target.value)} />
          </Box>
          <Box marginBottom="12px">
            <FormLabel>Last Name</FormLabel>
            <Input onChange={(e) => setLastName(e.target.value)} />
          </Box>

          <Box>
            <FormLabel>Age</FormLabel>
            <NumberInput marginBottom="12px">
              <NumberInputField
                onChange={(e) => setAge(Number(e.target.value))}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Box>
          <Box marginBottom="12px">
            <FormLabel>Phone Number</FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<PhoneIcon color="gray.300" />}
              />
              <Input
                type="tel"
                placeholder="phone number"
                onChange={(e) => setPhone(Number(e.target.value))}
              />
            </InputGroup>
          </Box>
          <Box marginBottom="12px">
            <FormLabel>Email</FormLabel>
            <Input onChange={(e) => setEmail(e.target.value)} />
          </Box>
          <Box>
            <FormLabel>Bio</FormLabel>
            <Textarea onChange={(e) => setBio(e.target.value)}></Textarea>
          </Box>

          <Flex justifyContent="left" position="absolute" bottom="2%" left="0">
            <Button
              variant="outline"
              mr={3}
              w="125px"
              h="40px"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              w="125px"
              h="40px"
              onClick={onClose}
              type="submit"
            >
              Save
            </Button>
          </Flex>
        </form>
      </FormControl>
    </>
  )
}
export default CreateClientForm
