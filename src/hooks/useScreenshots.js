import { useState } from 'react';

const _interopDefault = ex => { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const html2canvas = _interopDefault(require('html2canvas'));

export default function useScreenshots(type = null, quality = null) {
	const [screenshots, setScreenshots] = useState({ images: [], type: type, quality: quality });
	const [errors, setErrors] = useState({ messages: [] });

	function takeScreenshot(node) {
		if (!node) throw new Error('You should provide correct html node.');

		return html2canvas(node).then(function (canvas) {
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
			setScreenshots({ ...screenshots, images: [...screenshots.images, base64Image] });
			return base64Image;
		}).catch(e => setErrors({ ...errors, messages: [...errors.messages, e] }));
	};

	return { screenshots, errors, takeScreenshot };
}