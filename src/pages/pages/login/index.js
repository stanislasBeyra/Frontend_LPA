

// ** React Imports
import { useState, useContext } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import MyButton from 'src/utils/CustomButton'
import { teelColor } from 'src/utils/config'

// ** Toast Notifications
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// ** Context
import { UserContext } from 'src/@core/Provider/UserContext'
import LoginController from 'src/controllers/LoginController'
import UserModel from 'src/Models/UserModel'
import CustomTextField from 'src/utils/CustomTextField'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState({ email: '', password: '', showPassword: false })
  const [error, setError] = useState({ email: '', password: '' })
  const { setUserInfo } = useContext(UserContext)
  const router = useRouter()

  // ** Hook
  const theme = useTheme()

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues((prevValues) => ({ ...prevValues, showPassword: !prevValues.showPassword }))
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const validate = () => {
    let isValid = true
    const errors = { email: '', password: '' }

    if (!values.email) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid'
      isValid = false
    }

    if (!values.password) {
      errors.password = 'Password is required'
      isValid = false
    }

    setError(errors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validate()) {
      try {
        const response = await LoginController.login({ email: values.email, password: values.password });
        console.log(response);
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token)
          const profile = await LoginController.getProfile()
          const user = new UserModel(profile.data.user);
          console.log(user),
          setUserInfo(user);
          toast.success('Connexion réussie !')
          setTimeout(() => {
            router.push('/')
          }, 1000)
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Erreur de connexion, veuillez réessayer.'
        toast.error(errorMessage)

        // if(error.response.status===401){
        //   router.push('/401')
        // }else if(error.response.status===500){
        //   router.push('/500')
        // }
        setError({ email: '', password: 'Invalid credentials' })
      }
    }
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: (theme) => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Welcome to {themeConfig.templateName}! 👋🏻
            </Typography>
            <Typography variant='body2'>Please sign in to your account and start the adventure</Typography>
          </Box>
          <Divider sx={{ my: 5 }}>FORM</Divider>
          <form noValidate autoComplete='off' onSubmit={handleSubmit}>
            <CustomTextField
              autoFocus
              fullWidth
              id='email'
              label='Email'
              sx={{ marginBottom: 4 }}
              value={values.email}
              onChange={handleChange('email')}
              error={Boolean(error.email)}
              helperText={error.email}
            />
            <FormControl fullWidth error={Boolean(error.password)}>
              <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                value={values.password}
                id='auth-login-password'
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <Typography variant='body2' color='error'>
                {error.password}
              </Typography>
            </FormControl>
            <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              <FormControlLabel control={<Checkbox />} label='Remember Me' />
              <Link passHref href='/'>
                <LinkStyled sx={{ color: teelColor }}>Forgot Password?</LinkStyled>
              </Link>
            </Box>
            <MyButton fullWidth size='large' variant='contained' sx={{ marginBottom: 7 }} type='submit'>
              Login
            </MyButton>
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                New on our platform?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/pages/register'>
                  <LinkStyled sx={{ color: teelColor }}>Create an account</LinkStyled>
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
      {/* <FooterIllustrationsV1 /> */}
    </Box>
  )
}

LoginPage.getLayout = (page) => <BlankLayout>{page}</BlankLayout>

export default LoginPage

