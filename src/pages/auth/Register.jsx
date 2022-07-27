import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Button, FormHelperText, FormErrorMessage, Center, chakra, FormControl, FormLabel, Heading, Input, Stack, useToast } from '@chakra-ui/react';
import { FaGoogle } from 'react-icons/fa';

import { Card } from '../../components/Card';
import DividerWithText from '../../components/DividerWithText';
import { Layout } from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { useDB } from '../../contexts/DatabaseContext';
import useMounted from '../../hooks/useMounted';

export default function Register() {
	const { signInWithGoogle, register, update, pushUserData, updateUserData } = useAuth();
	const { database, child, push, ref, onValue } = useDB();
	const history = useHistory();
	const location = useLocation();
	const mounted = useMounted();
	const [inputs, setInputs] = useState({ name: '', email: '', password: '' });
	const [errors, setErrors] = useState(inputs);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const toast = useToast({ isClosable: true, status: 'success' });

	const handleChange = e => {
		const { name, value } = e.target;
		setInputs(values => ({ ...values, [name]: value }))
		setErrors(values => ({ ...values, [name]: value === '' ? true : false }))
	};

	const handleRedirectToOrBack = obj => {
		update(obj.user, 'profile', { displayName: inputs.name ?? inputs.email });
		
		// onValue(ref(database, 'users/' + obj.user.uid), snapshot => {
		// 	if (snapshot.exists()) {
		// 		updateUserData({ user: obj.user, isOnline: true });
		// 	} else {
		// 		pushUserData({ user: obj.user, isOnline: true });
		// 	}
		// });

		// push(ref(database, 'users'), {
		// 	displayName: obj.user.displayName,
		// 	email: obj.user.email,
		// 	photoUrl: obj.user.photoUrl ?? null,
		// 	isOnline: true
		// });

		history.replace(location.state?.from ?? '/profile');
		toast({ title: `Registered as ${inputs.name}.`, description: 'Refresh to update your display name!' });
	};

	const handleFormSubmit = async e => {
		e.preventDefault();

		if (!inputs.email || !inputs.password) {
			toast({ description: 'Missing email or password.', status: 'error' });
			return;
		}

		setIsSubmitting(true);

		register(...Object.values(inputs).slice(1))
			.then(res => handleRedirectToOrBack(res))
			.catch(e => toast({ description: 'Invalid email or password.', status: 'error' }))
			.finally(() => mounted.current && setIsSubmitting(false))
		;
	};
	
	const handleGoogleSignIn = () => {
		setIsSubmitting(true);

		signInWithGoogle()
			.then(res => {})
			.catch(e => toast({ description: 'Invalid email or password.', status: 'error' }))
			.finally(() => mounted.current && setIsSubmitting(false))
		;
	};

	return (
		<Layout>
			<Heading textAlign='center' my={12}>Register</Heading>

			<Card maxW='md' mx='auto' mt={4}>
				<chakra.form onSubmit={handleFormSubmit}>
					<Stack spacing='6'>
						<FormControl id='name'>
							<FormLabel>Display Name</FormLabel>
							<Input name='name' type='text' autoComplete='name' autoFocus value={inputs.name} onBlur={handleChange} onChange={handleChange} />

							{!errors.name
								? (<FormHelperText>If empty, your email will be used.</FormHelperText>)
								: (<FormHelperText>Your email will be used as your display name.</FormHelperText>)
							}
						</FormControl>

						<FormControl id='email' isRequired isInvalid={errors.email}>
							<FormLabel>Email Address</FormLabel>
							<Input name='email' type='email' autoComplete='email' value={inputs.email} required onBlur={handleChange} onChange={handleChange} />

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

						<Button type='submit' colorScheme='pink' size='lg' fontSize='md' isLoading={isSubmitting}>Register</Button>
					</Stack>
				</chakra.form>

				<Center my={4}>
					<Button variant='link' onClick={() => history.push('/login')}>Already have an account?</Button>
				</Center>

				<DividerWithText my={6}>OR</DividerWithText>

				<Button variant='outline' isFullWidth colorScheme='red' leftIcon={<FaGoogle />} onClick={handleGoogleSignIn}>Sign In with Google</Button>
			</Card>
		</Layout>
	);
}