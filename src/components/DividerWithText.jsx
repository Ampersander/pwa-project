import React from 'react';

import { Flex, Box, Divider, useColorModeValue, Text } from '@chakra-ui/react';

export default function DividerWithText(props) {
	const { children, hasComponents, ...flexProps } = props;

	return (
		<Flex align='center' color={useColorModeValue('gray.600', 'gray.400')} {...flexProps}>
			<Box flex='1'>
				<Divider borderColor='currentcolor' />
			</Box>

			{hasComponents
				? children
				: (<Text as='span' px='3' fontWeight='medium' >
						{children}
				</Text>)
			}

			<Box flex='1'>
				<Divider borderColor='currentcolor' />
			</Box>
		</Flex>
	);
}