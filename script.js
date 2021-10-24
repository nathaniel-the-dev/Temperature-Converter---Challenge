'use strict';

const converterForm = document.getElementById('converter');

const fromUnitInput = document.querySelector('select[name="fromUnit"]');
const toUnitInput = document.querySelector('select[name="toUnit"]');

const answerContainer = document.querySelector('.answer');

function formatUnit(unit) {
	return unit === 'C' ? '°C' : unit === 'F' ? '°F' : 'K';
}
function formatNumber(temperature) {
	// Return integer
	if (Number.isInteger(temperature)) return temperature;

	// Return float
	const numberAsString = temperature + '';
	const [integer, fraction] = numberAsString.split('.');
	const fractionTo2DP = fraction.slice(0, 2);
	const number = [integer, fractionTo2DP].join('.');

	return parseFloat(number);
}

function changeInput(e) {
	const toOptions = toUnitInput.querySelectorAll('option');
	const matchingOpt = toUnitInput.querySelector(`option[value="${e.target.value}"]`);

	toOptions.forEach((opt) => (opt.disabled = opt.hidden = false));
	matchingOpt.disabled = matchingOpt.hidden = true;
	matchingOpt.selected = false;
}

function handleValidationError(error) {
	console.error(error.message);
}

function handleFormSubmit(e) {
	try {
		// Prevent default form submission
		e.preventDefault();

		// Get data from the form
		const entries = new FormData(converterForm).entries();
		const data = Object.fromEntries(entries);

		// Validate data
		if (!data.fromTemperature) throw new Error('Must provide a temperature');
		if (data.fromUnit === data.toUnit) throw new Error(`Conversion units cannot be the same`);

		// Convert temperatures
		const answer = convertTemperature(data);

		// Update UI
		showAnswer(data, answer);
	} catch (error) {
		handleValidationError(error);
	}
}

function convertTemperature(values) {
	switch (values.fromUnit) {
		case 'C':
			if (values.toUnit === 'F') return +values.fromTemperature * 1.8 + 32;
			if (values.toUnit === 'K') return +values.fromTemperature + 273;
		case 'F':
			if (values.toUnit === 'C') return (+values.fromTemperature - 32) / 1.8;
			if (values.toUnit === 'K') return (+values.fromTemperature - 32) / 1.8 + 273;
		case 'K':
			if (values.toUnit === 'C') return +values.fromTemperature - 273;
			if (values.toUnit === 'F') return (+values.fromTemperature - 273) / 1.8 + 32;
	}
}

function showAnswer({ fromTemperature, fromUnit, toUnit }, answer) {
	answerContainer.innerHTML = `<span>${fromTemperature} ${formatUnit(fromUnit)}</span> &RightArrow; <span>${formatNumber(answer)}</> ${formatUnit(toUnit)}</span>`;
}

converterForm.addEventListener('submit', handleFormSubmit);

fromUnitInput.addEventListener('input', changeInput);
