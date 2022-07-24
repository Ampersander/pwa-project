import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import { Button, chakra, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, HStack, Input, Stack, useToast } from '@chakra-ui/react';
import { FaGoogle } from 'react-icons/fa';

import { Card } from '../../components/Card';
import DividerWithText from '../../components/DividerWithText';
import { Layout } from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import useMounted from '../../hooks/useMounted';

const toastDefaults = { duration: 5000, isClosable: true };

export default function Login() {
	const { login, signInWithGoogle } = useAuth();
	const history = useHistory();
	const location = useLocation();
	const mounted = useMounted();
	const [inputs, setInputs] = useState({ email: '', password: '' });
	const [errors, setErrors] = useState(inputs);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const toast = useToast();

	const handleChange = e => {
		const { name, value } = e.target;
		setInputs(values => ({ ...values, [name]: value }))
		setErrors(values => ({ ...values, [name]: value === '' ? true : false }))
		console.log(errors);
	};

	const handleRedirectToOrBack = obj => {
		history.replace(location.state?.from ?? '/profile');
		toast({ description: `Logged in as ${obj.user.displayName}.`, status: 'success', ...toastDefaults });
	};
	
	const handleFormSubmit = async e => {
		e.preventDefault();

		if (!inputs.email || !inputs.password) {
			toast({ description: 'Missing email or password.', status: 'error', ...toastDefaults });
			return;
		}

		setIsSubmitting(true);

		login(...Object.values(inputs))
			.then(res => handleRedirectToOrBack(res))
			.catch(e => toast({ description: 'Invalid email or password.', status: 'error', ...toastDefaults }))
			.finally(() => mounted.current && setIsSubmitting(false))
		;
	};
	
	const handleGoogleSignIn = () => {
		signInWithGoogle()
			.then(res => handleRedirectToOrBack(res))
			.catch(e => toast({ description: 'Could not sign in with Google.', status: 'error', ...toastDefaults }))
			;
	};

	return (
		<Layout>
			<Heading textAlign='center' my={12}>Login</Heading>

			<Card maxW='md' mx='auto' mt={4}>
				<chakra.form onSubmit={handleFormSubmit}>
					<Stack spacing='6'>
						<FormControl id='email' isRequired isInvalid={errors.email}>
							<FormLabel>Email Address</FormLabel>
							<Input name='email' type='email' autoComplete='email' autoFocus value={inputs.email} required onBlur={handleChange} onChange={handleChange} />

							{!errors.email
								? (<FormHelperText>Enter a valid email address.</FormHelperText>)
								: (<FormErrorMessage>Email address is required.</FormErrorMessage>)
							}
						</FormControl>

						<FormControl id='password' isRequired isInvalid={errors.password}>
							<FormLabel>Password</FormLabel>
							<Input name='password' type='password' autoComplete='password' value={inputs.password} required onBlur={handleChange} onChange={handleChange} />

							{!errors.password
								? (<FormHelperText>Enter a valid password.</FormHelperText>)
								: (<FormErrorMessage>Password is required.</FormErrorMessage>)
							}
						</FormControl>

						<Button type='submit' colorScheme='pink' size='lg' fontSize='md' isLoading={isSubmitting}>Sign In</Button>
					</Stack>
				</chakra.form>

				<HStack justifyContent='space-between' my={4}>
					<Button variant='link'>
						<Link to='/forgot-password'>Forgot password?</Link>
					</Button>

					<Button variant='link' onClick={() => history.push('/register')}>Not registered yet?</Button>
				</HStack>

				<DividerWithText my={6}>OR</DividerWithText>

				<Button variant='outline' isFullWidth colorScheme='red' leftIcon={<FaGoogle />} onClick={handleGoogleSignIn}>Sign In with Google</Button>
			</Card>
		</Layout>
	);
}