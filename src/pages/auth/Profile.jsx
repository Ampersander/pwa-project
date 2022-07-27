import React, { useEffect, useRef, useState } from 'react';
import {Link, useHistory} from 'react-router-dom';

import {
	Avatar,
	Button,
	ButtonGroup,
	Code,
	Container,
	Editable,
	EditableInput,
	EditablePreview,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	IconButton,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Tooltip,
	useColorModeValue,
	useDisclosure,
	useEditableControls,
	useToast
} from '@chakra-ui/react';
import {FaCheck, FaGoogle, FaMinus, FaPlus, FaTimes, FaTrash} from 'react-icons/fa';

import DividerWithText from '../../components/DividerWithText';
import { Layout } from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import useMounted from '../../hooks/useMounted';

const toastDefaults = { duration: 5000, isClosable: true };

export default function Profile() {
	const { currentUser, destroy, signInWithGoogle, update, writeUserData } = useAuth();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const history = useHistory();
	const mounted = useMounted();
	const initialRef = useRef(null);
	const [inputs, setInputs] = useState({ photoUrl: currentUser.photoURL, displayName: currentUser.displayName, email: currentUser.email, password: '' });
	const avatarRef = useRef();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const toast = useToast();

	const [doc, setDoc] = useState( {
		title: 'Files',
		pres: [
			{ id_pres: 1, content: 'Document', src: null},
			{ id_pres: 2, content: 'Document', src: null}
		],
		author: currentUser.displayName ?? currentUser.email,
		path: '',
		description: '',
		createdAt: new Date().toLocaleString(),
		updatedAt: new Date().toLocaleString(),
		options: {
			mode: 'xml',
			theme: 'material',
			lineNumbers: false,
			lineWrapping: true,
			readOnly: false
		}
	})

	const addPresentation = (index) => {
		console.log(index);
		if (index == doc.pres.length){
			setDoc({ ...doc, pres: [...doc.pres, { id_pres: doc.pres.length + 1, content: '', src: null}] });
		} else {
			const newPres = [...doc.pres.slice(0, index), { id_pres: doc.pres[index].id_pres + 1, content: '', src: null}, ...doc.pres.slice(index)];
			setDoc({ ...doc, pres: newPres });
		}
	}

	const EditableControls = ({ target }) => {
		const { isEditing, getSubmitButtonProps, getCancelButtonProps } = useEditableControls();

		return (<>
			{target === 'photoUrl' && (<Input hidden={!isEditing} py={2} px={4} ref={avatarRef} name='photoUrl' type='url' autoFocus onBlur={handleFormSubmit} />)}

			{isEditing && (
				<ButtonGroup justifyContent="end" size="sm" spacing={2} mt={2}>
					<IconButton icon={<FaTimes />} {...getCancelButtonProps()} />
					<IconButton type='submit' icon={<FaCheck />} {...getSubmitButtonProps()} />
				</ButtonGroup>
			)}
		</>)
	};

	const EditableAvatar = () => {
		return (<Avatar
			name={inputs.displayName}
			// as={Image}
			loading='lazy'
			src={inputs.photoUrl}
			fallback={<Avatar boxSize='100px' />}
			boxSize='100px'
			borderRadius='full'
		/>);
	};
	
	const handleGoogleSignIn = () => {
		setIsSubmitting(true);

		signInWithGoogle()
			.then(res => toast({ title: `Connected with Google!`, description: 'Refresh to update your profile!', status: 'success', ...toastDefaults }))
			.catch(e => toast({ description: 'Could not connect with Google.', status: 'error', ...toastDefaults }))
			.finally(() => mounted.current && setIsSubmitting(false))
		;
	};

	const handleFormSubmit = async e => {
		const { name, value } = e.target ?? e;

		setIsSubmitting(true);

		if (currentUser[name] === value) {
			mounted.current && setIsSubmitting(false);
			return;
		}

		setInputs(values => ({ ...values, [name]: value }));

		switch (name) {
			case 'photoUrl':
			case 'displayName':
				update(currentUser, 'profile', { [name]: value })
					.then(res => toast({ description: `${name.replace(/^\w/, (c) => c.toUpperCase())} updated successfully!`, status: 'success', ...toastDefaults }))
					.catch(e => toast({ description: `Invalid ${name}.`, status: 'error', ...toastDefaults }))
				;
				break;
			case 'email':
			case 'password':
				if (!isDeleting) {
					update(currentUser, 'email', inputs.email, value)
						.then(res => toast({ description: `Email address updated successfully!`, status: 'success', ...toastDefaults }))
						.catch(e => toast({ description: `Invalid ${name}.`, status: 'error', ...toastDefaults }))
					;
				} else {
					destroy(value)
						.then(() => toast({ description: 'Account deleted successfully!', status: 'success', ...toastDefaults }))
						.catch(e => toast({ description: `Invalid ${name}.`, status: 'error', ...toastDefaults }))
					;
				}

				onClose();
				mounted.current && setIsDeleting(false);
				break;
			default:
				update(currentUser)
					.then(res => toast({ description: `Profile updated successfully!`, status: 'success', ...toastDefaults }))
					.catch(e => toast({ description: `Invalid ${name}.`, status: 'error', ...toastDefaults }))
				;
				break;
		}

		writeUserData({ user: currentUser, isOnline: true });
		mounted.current && setIsSubmitting(false);
	};

	useEffect(() => {
		setInputs({ photoUrl: currentUser.photoURL, displayName: currentUser.displayName, email: currentUser.email });
	}, [currentUser]);
	
	return (
		<Layout>
			<Heading>Profile</Heading>

			<Container maxW='container.lg' overflowX='auto' py={4}>
				<HStack spacing='6'>
					<FormControl>
						{/* <FormLabel htmlFor='avatar'>Avatar</FormLabel> */}

						<Editable isDisabled defaultValue={<EditableAvatar />} onClick={() => avatarRef.current.click()}>
							<Tooltip label="Read Only">
								<EditablePreview py={2} px={4} _hover={{ background: useColorModeValue("gray.100", "gray.700") }} />
							</Tooltip>

							<HStack justifyContent='space-between'>
								<EditableControls target="photoUrl" />
							</HStack>
						</Editable>
					</FormControl>

					<FormControl>
						<FormLabel htmlFor='name'>Display Name</FormLabel>

						<Editable defaultValue={inputs.displayName ?? inputs.email}>
							<Tooltip label="Click to edit">
								<EditablePreview py={2} px={4} _hover={{ background: useColorModeValue("gray.100", "gray.700") }} />
							</Tooltip>

							<HStack justifyContent='space-between'>
								<Input py={2} px={4} as={EditableInput} name='displayName' type='text' autoComplete='name' autoFocus value={inputs.displayName} required onBlur={handleFormSubmit} />
								<EditableControls target='displayName' />
							</HStack>
						</Editable>
					</FormControl>

					<FormControl>
						<FormLabel htmlFor='email'>Email Address</FormLabel>

						<Editable defaultValue={inputs.email}>
							<Tooltip label="Click to edit">
								<EditablePreview py={2} px={4} _hover={{ background: useColorModeValue("gray.100", "gray.700") }} />
							</Tooltip>

							<HStack justifyContent='space-between'>
								<Input py={2} px={4} as={EditableInput} name='email' type='email' autoComplete='email' autoFocus value={inputs.email} required onBlur={(e) => { if (currentUser.email !== e.target.value) { setInputs(values => ({ ...values, email: e.target.value })); onOpen(); } }} />
								<EditableControls target="email" />
							</HStack>
						</Editable>
					</FormControl>

					<FormControl>
						<FormLabel>Password</FormLabel>
						<Button variant='outline' onClick={() => history.push('/reset-password')} colorScheme='pink' size='lg' fontSize='md'>Reset Password</Button>
					</FormControl>
				</HStack>

				<DividerWithText my={6}>LIST OF FILES</DividerWithText>
				<Link to={'editor/{id}'}>
					<Image className='image' loading='lazy' src={'https://fakeimg.pl/152x106/000/FFF/?font=lobster&text=Slide%20'} />
				</Link>

				{doc.pres.sort().map((pres, index) => (

				<Container key={index} m={0} p={0} maxW='initial'>
					{index == 0  && (
						<DividerWithText hasComponents my={6}>
							<Link to={'editor'}>
								<IconButton icon={<FaPlus />} onClick={() => addPresentation(index)} />
							</Link>
						</DividerWithText>
					)}
				</Container>
				))}

				<DividerWithText my={6}>CONNECTIONS</DividerWithText>

				<Text fontSize='sm' mb={4} fontWeight='bold'>Last logged in with <Code>{currentUser.providerData[0].providerId}</Code>.</Text>

				<ButtonGroup spacing={2}>
					<Tooltip label="Click to link">
						<Button variant='outline' colorScheme='pink' leftIcon={<FaGoogle />} onClick={handleGoogleSignIn} isLoading={isSubmitting}>Google</Button>
					</Tooltip>
				</ButtonGroup>

				<DividerWithText my={6} textColor="red">DANGER ZONE</DividerWithText>

				<Tooltip label="Irreversible">
					<Button variant='outline' colorScheme='red' leftIcon={<FaTrash />} onClick={() => { setIsDeleting(true); onOpen(); }} isLoading={isSubmitting}>Delete Account</Button>
				</Tooltip>

				{/* <chakra.pre p={4}>
					{currentUser && (<pre>{JSON.stringify(currentUser, null, 4)}</pre>)}
				</chakra.pre> */}
			</Container>

			<Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />

				<ModalContent>
					<ModalHeader>{isDeleting ? 'Deleting Account' : 'Updating Email'}</ModalHeader>

					<ModalCloseButton />

					<ModalBody pb={6}>
						<Text fontSize='sm'>This action is irreversible.</Text>

						<FormControl hidden={currentUser.providerData[0].providerId !== 'password'} id='password' mt={4}>
							<FormLabel>Password</FormLabel>
							<Input ref={initialRef} name='password' type='password' autoComplete='password' required />
						</FormControl>

						<Text hidden={currentUser.providerData[0].providerId === 'password'} fontSize='sm' mt={4}>You will need to reauthenticate with your provider first.</Text>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='blue' mr={3} onClick={(e) => handleFormSubmit(initialRef.current)} isLoading={isSubmitting}>Confirm</Button>
						<Button onClick={onClose}>Cancel</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Layout>
	);
}
