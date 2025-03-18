class Person {
	constructor(firstName, lastName, money) {
		// Public properties
		this.firstName = firstName
		this.lastName = lastName
		this.ageYears = 0
		this.money = money
		this.cars = new Array()
	}
	fullName = function () {
		return this.firstName + ' ' + this.lastName
	}
	timeGoesBy = function (years) {
		this.ageYears += years
	}
	birthday = function () {
		this.ageYears++
	}
	buyCar = function (car) {
		alert(this.firstName + ' has $' + this.money)

		if (car.price > this.money){
			alert(this.firstName + 'doesnt have enough money to buy a ' + car.color + ' ' + car.make + ' ' + car.model)
			return false
		}
		this.money -= car.price
		this.cars[this.cars.length] = car
		alert(this.firstName + ' bought a ' + car.color + ' ' + car.make + ' ' + car.model + ' for $' + car.price)
		alert(this.firstName + ' now has $' + this.money)
		return true
	}
}
