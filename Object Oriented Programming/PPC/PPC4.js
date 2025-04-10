function Person(fn, age, arms) {
	// Public properties
	this.fn = fn
	
	// Private properties
	let _age = age
	this.arms = arms

	// Private getter
	this.getAge = function () {
		return _age
	}

	// Private helper function
	const getMultipliedAge = function () {
		return _age * 2
	}

	// Method to modify age
	this.timePasses = function (years) {
		_age += years
	}

	// Method to say age
	this.sayYourAge = function () {
		alert(`I am ${getMultipliedAge()} years old`)
	}
}

// Static property
Person.City = 'Default City'

// Prototype methods
Person.prototype.speak = function (words) {
	alert(words)
}
