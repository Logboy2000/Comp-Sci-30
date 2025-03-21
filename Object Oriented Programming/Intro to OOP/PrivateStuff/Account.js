var AccountType = {
	CHEQUING: 0,
	SAVINGS: 1,
}

class Account {
	#balance = 0 // Private

	constructor(accountType = AccountType.CHEQUING, accountNum, fullName) {
		this.#balance = 0
		this.fullName = fullName
		this.accountType = accountType
	}

	getBalance() {
		return this.#balance
	}

	deposit(amount) {
		this.#balance += amount
	}

	withdraw(amount) {
		if (amount > this.#balance) {
			return false
		}
		this.#balance -= amount
		return true
	}
}
