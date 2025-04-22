var Person = function (n, race) {
	var alive = true,
		age = 1
	var maxAge =
		70 + Math.round(Math.random() * 15) + Math.round(Math.random() * 15)
	function makeOlder() {
		return (alive = ++age <= maxAge)
	}

	var myName = n ? n : 'John Doe'
	var weight = 1

	this.toString = this.getName = function () {
		return myName
	}

	this.eat = function () {
		if (makeOlder()) {
			this.dirtFactor++
			return (weight *= 3)
		} else {
			alert(myName + " can't eat, he's dead!")
		}
	}

	this.exercise = function () {
		if (makeOlder()) {
			this.dirtFactor++
			return (weight /= 2)
		} else alert(myName + " can't exercise, he's dead!")
	}

	this.getWeigh = function () {
		return weight
	}
	this.getRace = function () {
		return race
	}
	this.getAge = function () {
		return age
	}
	this.muchTimePasses = function () {
		age += 50
		this.dirtFactor = 10
	}

	this.clothing = 'nothing/naked'
	this.dirtFactor = 0
} // end of constructor

Person.prototype.beCool = function () {
	this.clothing = 'khakis and black shirt'
}
Person.prototype.shower = function () {
	this.dirtFactor = 2
}
Person.prototype.showLegs = function () {
	alert(this + ' has ' + this.legs + ' legs')
}
Person.prototype.amputate = function () {
	this.legs--
}

Person.prototype.legs = 2

Person.population = 0

// Here is the code that uses the Person class
function RunGavinsLife() {
	var gk = new Person('Gavin', 'caucasian') //New instance of the Person object created.
	var lk = new Person('Lisa', 'caucasian') //New instance of the Person object created.
	alert('There are now ' + Person.population + ' people')

	gk.showLegs()
	lk.showLegs() //Both share the common 'Person.prototype.legs' variable when looking at 'this.legs'

	gk.race = 'hispanic' //Sets a public variable, but does not overwrite private 'race' variable.
	alert(gk + "'s real race is " + gk.getRace()) //Returns 'caucasian' from private 'race' variable set at create time.
	gk.eat()
	gk.eat()
	gk.eat() //weight is 3...then 9...then 27
	alert(
		gk +
			' weighs ' +
			gk.weigh() +
			' pounds and has a dirt factor of ' +
			gk.dirtFactor
	)

	gk.exercise() //weight is now 13.5
	gk.beCool() //clothing has been update to current fashionable levels
	gk.clothing = 'Pimp Outfit' //clothing is a public variable that can be updated to any funky value
	gk.shower()
	alert(
		'Existing shower technology has gotten ' +
			gk +
			' to a dirt factor of ' +
			gk.dirtFactor
	)

	gk.muchTimePasses() //50 Years Pass
	Person.prototype.shower = function () {
		//Shower technology improves for everyone
		this.dirtFactor = 0
	}
	gk.beCool = function () {
		//Gavin alone gets new fashion ideas
		this.clothing = 'tinfoil'
	}

	gk.beCool()
	gk.shower()
	alert(
		'Fashionable ' +
			gk +
			' at ' +
			gk.getAge() +
			' years old is now wearing ' +
			gk.clothing +
			' with dirt factor ' +
			gk.dirtFactor
	)

	gk.amputate() //Uses the prototype property and makes a public property
	gk.showLegs()
	lk.showLegs() //Lisa still has the prototype property

	gk.muchTimePasses() //50 Years Pass...Gavin is now over 100 years old.
	gk.eat() //Complains about extreme age, death, and inability to eat.
}
