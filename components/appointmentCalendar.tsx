import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Box,
  Flex,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormLabel,
  FormControl,
  Input,
  Select,
  Textarea,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Text,
  Heading,
} from '@chakra-ui/react'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useProfile } from '../lib/hooks'
import durationObject from '../lib/durationObject'

const IndexCalendar = () => {
  const [date, setDate] = useState(new Date())
  const [appointmentLoading, setAppointmentLoading] = useState(false)
  const [client, setClient] = useState('')
  const [appDesc, setAppDesc] = useState('')
  const [appTitle, setAppTitle] = useState('')
  const [appDuration, setAppDuration] = useState(0)
  const [type, setType] = useState('')
  const [clientName, setClientName] = useState('')
  const [time, setTime] = useState(0)
  const [clientInfo, setClientInfo] = useState('')

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, isLoading } = useProfile()

  const handleSubmit = (e) => {
    e.preventDefault()
    setAppointmentLoading(true)

    const formData = {
      trainerID: user?.id,
      clientID: client,
      clientName,
      appPlanTitle: appTitle,
      appPlanDesc: appDesc,
      appDuration,
      type,
      date,
      time,
    }
    fetch(`${window.location.origin}/api/appointment`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        console.log('request processed successfully')
        setAppointmentLoading(false)
        onClose()

        return console.log(res.json())
      })
      .catch((error) => error)
  }

  function isSameDay(a, b) {
    return differenceInCalendarDays(a, b) === 0
  }

  function tileContentFunction({ date, view }) {
    if (view === 'month') {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      const filteredAppointments = user?.appointments?.filter((appointment) =>
        isSameDay(parseISO(date.toISOString()), parseISO(appointment.date))
      )

      if (!appointmentLoading) {
        return filteredAppointments?.map((appointment) => (
          <>
            <Popover placement="right">
              <PopoverTrigger>
                <Badge
                  color="black"
                  p="1px 7px 1px 7px"
                  mt="10px"
                  borderRadius="5px"
                  fontSize="text.xxxs"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  key={appointment.id}
                  zIndex={1}
                  className="react-calendar-tile-badge"
                  aria-label={appointment.clientName}
                >
                  {appointment.clientName.length > 16
                    ? appointment.clientName.slice(0, 16) + '...' + ' - '
                    : appointment.clientName + ' - '}
                  {appointment.time > 1200
                    ? String(appointment.time - 1200).replace(/(.{2})$/, ':$1')
                    : String(appointment.time).replace(/(.{2})$/, ':$1')}
                  {appointment.time > 1200 ? 'PM' : 'AM'}
                </Badge>
              </PopoverTrigger>
              <PopoverContent
                color="black"
                minWidth="550px"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>
                  <Heading as="h3" fontSize="text.md" fontWeight="normal">
                    {appointment.clientName.toUpperCase() + ' - '}
                    {appointment.time > 1200
                      ? String(appointment.time - 1200).replace(
                          /(.{2})$/,
                          ':$1'
                        )
                      : String(appointment.time).replace(/(.{2})$/, ':$1')}
                    {appointment.time > 1200 ? ' PM' : ' AM'}
                  </Heading>
                </PopoverHeader>
                <PopoverBody>
                  <Flex flexDirection="column" justifyContent="space-between">
                    <Heading as="h4" fontSize="text.sm" mb="15px">
                      {appointment.appointmentPlanTitle + ' - '}
                      {Math.floor(appointment.appointmentDuration / 60) +
                        ' minutes'}
                    </Heading>
                    <Heading as="h5" fontSize="text.xs" mb="15px">
                      {appointment.type}
                    </Heading>
                    <Text fontSize="text.sm" mb="15px">
                      {appointment.appointmentPlanDescription}
                    </Text>

                    <Link
                      href={`http://localhost:3000/userAppointments/${appointment.id}`}
                    >
                      <Button>View Appointment</Button>
                    </Link>
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </>
        ))
      }
    }
  }

  return (
    <>
      {/* // The styling for this component is done with css. You can find this in
      global.css */}

      <Flex>
        <Box className="calendar-container">
          <Calendar
            value={date}
            onChange={setDate}
            onClickDay={onOpen}
            tileContent={tileContentFunction}
          />
        </Box>
      </Flex>
      {/* <Box
        display={active ? 'block' : 'none'}
        position="initial"
        top="0"
        left="0"
      >
        {clientInfo}
      </Box> */}

      <Modal
        closeOnOverlayClick={true}
        isOpen={isOpen}
        onClose={onClose}
        size={'xl'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Set Appointment for {date.toUTCString().substring(0, 16)}
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <FormControl>
              <ModalBody pb={6}>
                <FormLabel>Appointment Title</FormLabel>
                <Input
                  mb="10px"
                  type="text"
                  onChange={(e) => setAppTitle(e.target.value)}
                />
                {/* <FormLabel>Trainer</FormLabel>
          <Select
            placeholder="Select Trainer"
            onChange={(e) => setTrainer(e.target.value)}
          >
            <option value={user?.id}>
              {user?.firstName.slice(0, 1).toUpperCase() +
                user?.firstName.slice(1) +
                ' ' +
                user?.lastName.slice(0, 1).toUpperCase() +
                user?.lastName.slice(1)}
            </option>
          </Select> */}
                <FormLabel>Client</FormLabel>
                <Select
                  mb="10px"
                  placeholder="Select Client"
                  onChange={(e) => {
                    setClient(e.target.value.slice(0, 24))
                    setClientName(e.target.value.slice(24))
                  }}
                >
                  {user &&
                    user?.clients?.map((client) => (
                      <option
                        key={client.id}
                        value={client.id + ' ' + client.fullName}
                      >
                        {client.firstName.substring(0, 1).toUpperCase() +
                          client.firstName.substring(1) +
                          ' ' +
                          client.lastName.substring(0, 1).toUpperCase() +
                          client.lastName.substring(1)}
                      </option>
                    ))}
                </Select>
                <FormLabel>Appointment Type</FormLabel>
                <Input
                  mb="10px"
                  type="text"
                  onChange={(e) => setType(e.target.value)}
                />
                <Flex justifyContent="space-between" mb="10px">
                  <Box w="50%" mr="10px">
                    <FormLabel>Time</FormLabel>
                    <Input
                      onChange={(e) =>
                        setTime(Number(e.target.value.replace(':', '')))
                      }
                      type="time"
                    />
                  </Box>
                  <Box w="50%" ml="10px">
                    <FormLabel>Duration</FormLabel>
                    <Select
                      placeholder="Select Appointment Duration"
                      onChange={(e) => setAppDuration(Number(e.target.value))}
                    >
                      {durationObject.map((duration) => (
                        <option key={duration.seconds} value={duration.seconds}>
                          {duration.hour != '0'
                            ? duration.hour +
                              ' ' +
                              'hours' +
                              ' ' +
                              duration.minutes +
                              ' ' +
                              'minutes'
                            : duration.minutes + ' ' + 'minutes'}
                        </option>
                      ))}
                    </Select>
                  </Box>
                </Flex>
                <FormLabel>Appointment Description</FormLabel>
                <Textarea
                  mb="10px"
                  onChange={(e) => setAppDesc(e.target.value)}
                ></Textarea>

                {/* <CreateAppointmentForm date={date} /> */}
              </ModalBody>

              <ModalFooter>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" onClick={onClose} ml="20px">
                  Create Appointment
                </Button>
              </ModalFooter>
            </FormControl>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default IndexCalendar
