import { useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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
import { AuthContext } from '../../context/auth/auth-context';
import { loginSchema, type LoginFormData } from '../../schema/login-schema';

const LoginPage = () => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      await login(data.email, data.password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      component='main'
      maxWidth='sm'
      sx={{ pt: 8 }}
    >
      <Box
        sx={{
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
            Sign In
          </Typography>

          {error && (
            <Alert
              severity='error'
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 1 }}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ width: '100%' }}
            >
              <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email Address'
                autoComplete='email'
                autoFocus
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
                autoComplete='current-password'
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password')}
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <Box textAlign='center'>
              <Link
                component={RouterLink}
                to='/signup'
                variant='body2'
              >
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
