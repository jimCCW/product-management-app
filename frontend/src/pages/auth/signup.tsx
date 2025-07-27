import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { signupSchema, type SignupFormData } from '../../schema/signup-schema';
import { authAPI } from '../../services/api';
import { UserRole } from '../../types/user';

const SignUpPage = () => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError('');

    try {
      console.log('Register data:', data);
      const registerRes = await authAPI.register({
        ...data,
        role: UserRole.USER,
      });

      if (!registerRes.data || !registerRes.data.success) {
        throw new Error(registerRes.data?.message);
      }

      toast.success('Account created successfully!');
      navigate('/login');
    } catch (err: any) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach(
          (error: { field: keyof SignupFormData; message: string }) => {
            setFormError(error.field, {
              type: 'server',
              message: error.message,
            });
          }
        );
      } else {
        setError(err.response?.data?.message || 'Error creating account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      component='main'
      maxWidth='sm'
    >
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{ padding: 4, width: '100%' }}
        >
          <Typography
            component='h1'
            variant='h4'
            align='center'
            gutterBottom
          >
            Sign Up
          </Typography>

          {error && (
            <Alert
              severity='error'
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          <Box
            component='form'
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1 }}
          >
            <TextField
              margin='normal'
              required
              fullWidth
              id='name'
              label='Name'
              autoFocus
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register('name')}
            />

            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              autoComplete='email'
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email')}
            />

            <TextField
              margin='normal'
              required
              fullWidth
              label='Password'
              type='password'
              id='password'
              autoComplete='new-password'
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password')}
            />

            <TextField
              margin='normal'
              required
              fullWidth
              label='Confirm Password'
              type='password'
              id='confirmPassword'
              autoComplete='new-password'
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <Box textAlign='center'>
              <Link
                component={RouterLink}
                to='/login'
                variant='body2'
              >
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUpPage;
