let acc1

function go() {
	acc1 = new Account(AccountType.CHEQUING, 1, 'Neil Lindstrom')
	acc1.deposit(999999999999999)

	console.log(acc1.fullName + ' has $' + acc1.getBalance())
	console.log(acc1.fullName + ' wants to withdraw $2000')
	if (acc1.withdraw(2000)) {
		console.log('he can')
		console.log(acc1.fullName + ' now has $' + acc1.getBalance())
	} else {
		console.log(`he can't`)
	}
} // end of go
