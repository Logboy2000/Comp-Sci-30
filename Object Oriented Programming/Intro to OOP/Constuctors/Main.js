let people = []

function loaded() {
	people[0] = new Person('Tim', 'Tickleberry', 0)
	people[1] = new Person('Tom', 'Tickleberry', 0)
	people[2] = new Person('Tam', 'Tickleberry', 1000000000)
	people[3] = new Person('Timothy', 'Tickleberry', -10000)

	tesla = new Car('Tesla', 'Model S', 'White', 10000000)

	people[0].buyCar(tesla)
	people[2].buyCar(tesla)


	//update()
}

function update() {
	requestAnimationFrame(update)
}