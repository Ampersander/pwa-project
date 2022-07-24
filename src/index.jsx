import { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';

const config = { initialColorMode: 'light', useSystemColorMode: false };
const theme = extendTheme({ config });

ReactDOM.render(
	<StrictMode>
		<ChakraProvider>
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<App />
		</ChakraProvider>
	</StrictMode>,
	document.getElementById('root')
);