import React, { createRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { useDimensions, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box, Button, ButtonGroup, Container, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Editable, EditableInput, EditablePreview, FormControl, FormLabel, Heading, HStack, IconButton, Input, InputGroup, InputLeftAddon, InputRightAddon, List, ListIcon, ListItem, Select, Stack, Textarea, Tooltip, useColorModeValue, useDisclosure, useEditableControls, Checkbox, CheckboxGroup, Text, Image, useBreakpointValue } from '@chakra-ui/react';
import { FaArrowDown, FaArrowUp, FaCheck, FaCog, FaPlus, FaTimes, FaUser, FaMinus } from 'react-icons/fa';
import CodeMirror from 'codemirror'; 
import { Controlled } from 'react-codemirror2-react-17';
// import { useScreenshot } from 'use-react-screenshot';

import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useDB } from '../contexts/DatabaseContext';
import useMounted from '../hooks/useMounted';
// import useScreenshots from '../hooks/useScreenshots';
import DividerWithText from '../components/DividerWithText';

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');

const _interopDefault = ex => { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const html2canvas = _interopDefault(require('html2canvas'));

export default function Editor() {
	const { currentUser } = useAuth();
	const { database, child, push, ref } = useDB();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const mounted = useMounted();
	const initialRef = useRef(null);
	const showUserList = useBreakpointValue({ base: 'none', md: 'block' })
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [presentation, setPresentation] = useState({
		title: 'Untitled',
		slides: [
			{ id: 1, content: 'Welcome to your own private pad! Share the URL below and collaborate with your friends.', src: null },
			{ id: 2, content: 'Welcome to your own private pad! Share the URL below and collaborate with your friends.', src: null },
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
	});

	const EditableControls = ({ target }) => {
		const { isEditing, getSubmitButtonProps, getCancelButtonProps } = useEditableControls();

		return isEditing && (
			<ButtonGroup justifyContent="end" size="sm" spacing={2} mt={2}>
				<IconButton icon={<FaTimes />} {...getCancelButtonProps()} />
				<IconButton type='submit' icon={<FaCheck />} {...getSubmitButtonProps()} />
			</ButtonGroup>
		);
	};

	const handleSlideChange = (index, value) => {
		const newSlide = { ...presentation.slides[index], content: value };
		console.log([...presentation.slides.slice(0, index), newSlide, ...presentation.slides.slice(index + 1)]);
		// set array and replace the old slide with the new one
		const newSlides = [...presentation.slides.slice(0, index), newSlide, ...presentation.slides.slice(index + 1)];
		setPresentation({ ...presentation, slides: newSlides });
	};

	const addSlide = (index) => {
		console.log(index);
		if(index == presentation.slides.length){
			setPresentation({ ...presentation, slides: [...presentation.slides, { id: presentation.slides.length + 1, content: '', src: null }] });
		}else{
			const newSlides = [...presentation.slides.slice(0, index), { id: presentation.slides[index].id + 1, content: '', src: null }, ...presentation.slides.slice(index)];
			setPresentation({ ...presentation, slides: newSlides });
		}
	};
	const deleteSlide = (index) => {
		console.log(index);
		if(index == 0){
			//remove the first slide
			setPresentation({ ...presentation, slides: presentation.slides.slice(1) });
			//setPresentation({ ...presentation, slides: [...presentation.slides.slice(1)] });
		}else{
			const newSlides = [...presentation.slides.slice(0, presentation.slides.length - 1)];
			setPresentation({ ...presentation, slides: newSlides });
		}
		console.log(presentation.slides.length);

	};
	

	const handleFormSubmit = async e => {
		const { checked, id, name, value } = e.target;			

		setIsSubmitting(true);

		// If name contains 'options', then we need to update the options
		if (id.includes('slide')) {
			const slideId = id.split('.')[1];
			const newSlide = { ...presentation.slides[slideId], content: value };
			const newSlides = { ...presentation.slides, [slideId]: newSlide };
			setPresentation({ ...presentation, slides: newSlides });
		} else if (name.includes('options')) {
			const optionName = name.split('.')[1];
			const optionValue = checked ?? value;
			const newOptions = { ...presentation.options, [optionName]: optionValue };
			setPresentation({ ...presentation, options: newOptions });
		} else {
			setPresentation(values => ({ ...values, [name]: value }));
		}

		mounted.current && setIsSubmitting(false);
	}

	const takeScreenshots = (type = null, quality = null) => {
		var slides = document.getElementsByClassName('slide');

		for (let i = 0; i < slides.length; i++) {
			const slide = slides[i];

			if (!slide) throw new Error('You should provide correct html node.');

			html2canvas(slide).then(function (canvas) {
				var croppedCanvas = document.createElement('canvas');
				var croppedCanvasContext = croppedCanvas.getContext('2d'); // init data
			
				var cropPositionTop = 0;
				var cropPositionLeft = 0;
				var cropWidth = canvas.width;
				var cropHeight = canvas.height;
				croppedCanvas.width = cropWidth;
				croppedCanvas.height = cropHeight;
				croppedCanvasContext.drawImage(canvas, cropPositionLeft, cropPositionTop);
				var base64Image = croppedCanvas.toDataURL(type, quality);

				document.getElementsByClassName('image')[i].src = base64Image;
			});
		}
	};

	useEffect(() => {
		takeScreenshots();
	}, []);

	getExampleRef();
	// var codeMirror = CodeMirror(document.getElementById('cm-container'), presentation.options);
	// var userId = Math.floor(Math.random() * 9999999999).toString();
	// var userId = currentUser.uid;

	function getExampleRef() {
		var reference = ref(database, 'presentations');
		var hash = window.location.hash.replace(/#/g, '');

		if (hash) {
			reference = child(reference, hash);
		} else {
			let random = Math.floor(Math.random() * 9999999999).toString();
			// reference = push(reference, presentation); // generate unique location.
			window.location = window.location + '#' + random; // add it as a hash to the URL.
			// window.location = window.location + '#' + reference.key; // add it as a hash to the URL.
		}

		// console.log('Firebase data: ', reference.toString());
		return reference;
	}

	return (
		<Layout>
			<Container maxW='container.lg' overflowX='auto' py={4}>
				<Drawer isOpen={isOpen} placement='right' initialFocusRef={initialRef} onClose={onClose}>
					<DrawerOverlay />

					<DrawerContent>
						<DrawerCloseButton />

						<DrawerHeader borderBottomWidth='1px'>Settings</DrawerHeader>

						<DrawerBody>
							<Accordion defaultIndex={0} allowToggle>
								<AccordionItem>
									<AccordionButton _expanded={{ bg: 'teal', color: 'white' }}>
										<Box flex='1' textAlign='left'>General</Box>
										<AccordionIcon />
									</AccordionButton>

									<AccordionPanel pb={4}>
										<FormControl>
											<FormLabel color='teal' textAlign='center' htmlFor='title'>Title</FormLabel>

											<Editable defaultValue={presentation.title}>
												<Tooltip label="Click to edit">
													<EditablePreview py={2} _hover={{ background: useColorModeValue("gray.100", "gray.700") }} />
												</Tooltip>

												<HStack justifyContent='space-between'>
													<Input py={2} px={4} as={EditableInput} name='title' type='text' autoComplete='title' value={presentation.title} required onBlur={handleFormSubmit} />
													<EditableControls target='title' />
												</HStack>
											</Editable>
										</FormControl>

										<FormControl>
											<FormLabel color='teal' textAlign='center' htmlFor='author'>Author</FormLabel>

											<Editable isDisabled defaultValue={presentation.author}>
												<Tooltip label="Read Only">
													<EditablePreview py={2} _hover={{ background: useColorModeValue("gray.100", "gray.700") }} />
												</Tooltip>

												<HStack justifyContent='space-between'>
													<Input py={2} px={4} as={EditableInput} name='author' type='text' autoComplete='author'  value={presentation.author} />
													<EditableControls target='author' />
												</HStack>
											</Editable>
										</FormControl>

										<FormControl>
											<FormLabel color='teal' textAlign='center' htmlFor='path'>Path</FormLabel>

											<InputGroup>
												<InputLeftAddon>/presentations/</InputLeftAddon>

												<Editable defaultValue={(presentation.path ?? presentation.title).toLowerCase()}>
													<Tooltip label="Click to edit">
														<EditablePreview py={2} px={4} _hover={{ background: useColorModeValue("gray.100", "gray.700") }} />
													</Tooltip>

													<Stack justifyContent='space-between'>
														<Input py={2} px={4} as={EditableInput} name='path' type='text' autoComplete='path' />
														<EditableControls target='path' />
													</Stack>
												</Editable>
											</InputGroup>
										</FormControl>

										<FormControl>
											<FormLabel color='teal' textAlign='center' htmlFor='description'>Description</FormLabel>

											<Editable defaultValue={presentation.description} placeholder='Enter a description...'>
												<Tooltip label="Click to edit">
													<EditablePreview py={2} _hover={{ background: useColorModeValue("gray.100", "gray.700") }} />
												</Tooltip>

												<Stack justifyContent='space-between'>
													<Textarea py={2} px={4} as={EditableInput} name='title' type='text' autoComplete='title'  value={presentation.title} required onBlur={handleFormSubmit} />
													<EditableControls target='title' />
												</Stack>
											</Editable>
										</FormControl>

										<FormControl>
											<FormLabel color='teal' textAlign='center' htmlFor='createdAt'>Created At</FormLabel>

											<Editable isDisabled defaultValue={presentation.createdAt}>
												<Tooltip label="Read Only">
													<EditablePreview py={2} _hover={{ background: useColorModeValue("gray.100", "gray.700") }} />
												</Tooltip>

												<HStack justifyContent='space-between'>
													<Input py={2} px={4} as={EditableInput} name='createdAt' type='text' autoComplete='createdAt' value={presentation.createdAt} />
													<EditableControls target='createdAt' />
												</HStack>
											</Editable>
										</FormControl>

										<FormControl>
											<FormLabel color='teal' textAlign='center' htmlFor='updatedAt'>Updated At</FormLabel>

											<Editable isDisabled defaultValue={presentation.updatedAt}>
												<Tooltip label="Read Only">
													<EditablePreview py={2} _hover={{ background: useColorModeValue("gray.100", "gray.700") }} />
												</Tooltip>

												<HStack justifyContent='space-between'>
													<Input py={2} px={4} as={EditableInput} name='updatedAt' type='text' autoComplete='updatedAt' value={presentation.updatedAt} />
													<EditableControls target='updatedAt' />
												</HStack>
											</Editable>
										</FormControl>
									</AccordionPanel>
								</AccordionItem>

								<AccordionItem>
									<AccordionButton _expanded={{ bg: 'teal', color: 'white' }}>
										<Box flex='1' textAlign='left'>Options</Box>
										<AccordionIcon />
									</AccordionButton>

									<AccordionPanel pb={4}>
										<FormControl pb={4}>
											<FormLabel color='teal' textAlign='center' htmlFor='options.mode'>Mode</FormLabel>

											<Select defaultValue={presentation.options.mode} name='options.mode' onChange={handleFormSubmit}>
												{['javascript', 'xml'].map(mode => (
													<option key={mode} value={mode}>{mode.toUpperCase()}</option>
												))}
											</Select>
										</FormControl>

										<FormControl py={4}>
											<FormLabel color='teal' textAlign='center' htmlFor='options.theme'>Theme</FormLabel>

											<Select defaultValue={presentation.options.theme} name='options.theme' onChange={handleFormSubmit}>
												{['material', 'neat'].map(theme => (
													<option key={theme} value={theme}>{theme.replace(/^\w/, (c) => c.toUpperCase())}</option>
												))}
											</Select>
										</FormControl>

										<FormControl py={4}>
											<CheckboxGroup colorScheme='teal'>
												<Stack spacing={[1, 1]} direction={['column', 'column']}>
													<Checkbox size='lg' name='options.lineNumbers' isChecked={presentation.options.lineNumbers} onChange={handleFormSubmit}>Line Numbers</Checkbox>
													<Checkbox size='lg' name='options.lineWrapping' isChecked={presentation.options.lineWrapping} onChange={handleFormSubmit}>Line Wrapping</Checkbox>
													<Checkbox size='lg' name='options.readOnly' isChecked={presentation.options.readOnly} onChange={handleFormSubmit}>Read Only</Checkbox>
												</Stack>
											</CheckboxGroup>
										</FormControl>
									</AccordionPanel>
								</AccordionItem>
							</Accordion>
						</DrawerBody>

						{/* <DrawerFooter borderTopWidth='1px'>
							<Button mr={3} onClick={onClose}>Cancel</Button>
							<Button colorScheme='blue'>Submit</Button>
						</DrawerFooter> */}
					</DrawerContent>
				</Drawer>

				<HStack>
					<Container display={showUserList} maxW='3xs' id='firepad-userlist' alignSelf='start'>
						<Button leftIcon={<FaCog />} colorScheme='pink' onClick={onOpen}>Settings</Button>

						<Heading size='md' mt={8}>User List</Heading>

						<List spacing={3}>
							<ListItem key={1}>
								<ListIcon as={FaUser} color='green.500' />
								{currentUser.displayName}
							</ListItem>
						</List>

						<Heading size='md' mt={8}>Slides</Heading>

						<List spacing={3}>
							{/* for each slide, take a screenshot of it */}
							{presentation.slides.sort().map((slide, index) => (
								<ListItem key={index}>
									<Image className='image' id={'image.' + index} loading='lazy' src={'https://fakeimg.pl/152x106/000/FFF/?font=lobster&text=Slide%20' + parseInt(index + 1)} />
								</ListItem>
								// <Thumb index={index} slide={slide} />
							))}
						</List>
					</Container>

					<Container m='auto' minW='xs' maxW='3xl' id='firepad'>
						<FormControl textAlign='center'>
							<Editable isDisabled={presentation.options.readOnly} defaultValue={presentation.title}>
								<Tooltip label={presentation.options.readOnly ? 'Read Only' : 'Click to edit'}>
									<EditablePreview py={2} _hover={{ background: useColorModeValue("gray.100", "gray.700") }} />
								</Tooltip>

								<HStack justifyContent='space-between'>
									<Input py={2} px={4} as={EditableInput} name='title' type='text' autoComplete='title' value={presentation.title} required onBlur={handleFormSubmit} />
									<EditableControls target='title' />
								</HStack>
							</Editable>
						</FormControl>
						
						{presentation.slides.sort().map((slide, index) => (
							
							<Container key={index} m={0} p={0} maxW='initial'>
								{index == 0  && (
									<DividerWithText hasComponents my={6}>
										<IconButton icon={<FaPlus />} onClick={() => addSlide(index)} />
										<IconButton icon={<FaMinus />} onClick={() => deleteSlide(index)} />
									</DividerWithText>
								)}
								<Controlled
									className='slide'
									id={`slide.${slide.id}`}
									value={slide.content}
									options={presentation.options}
									onBeforeChange={(editor, data, value) => handleSlideChange(index, value)}
									onChange={(editor, value) => takeScreenshots()}
								/>

								{index !== presentation.slides.length  && (
									<DividerWithText hasComponents my={6}>
										<IconButton icon={<FaPlus />} onClick={() => addSlide(index+1)} />
										<IconButton icon={<FaMinus />} onClick={() => deleteSlide(index+1)} />
									</DividerWithText>
								)}

							</Container>
						))}

						{/* <Container id='cm-container' /> */}
					</Container>
				</HStack>
			</Container>
		</Layout>
	);
}