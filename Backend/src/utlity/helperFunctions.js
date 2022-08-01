/**
 * Check if any of given variables is undefined
 * @param  {...any} args variables that are to be checked
 * @returns {boolean}
 */
function checkIfUndefined(...args) {
	for (let variable of args) {
		if (variable == undefined) {
			return true
		}
	}
	return false
}

/**
 * Check if all of given strings pass testing by supplied regex
 * @param {*} regex regex to check the strings against
 * @param  {...any} args strings passed as function arguments
 * @returns {Boolean}
 */
function testRegex(regex, ...args) {
	for (let variable of args) {
		if (!regex.test(variable)) {
			return false
		}
	}
	return true
}

export {checkIfUndefined, testRegex}