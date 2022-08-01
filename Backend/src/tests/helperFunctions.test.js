import {checkIfUndefined, testRegex} from "../utlity/helperFunctions.js"
import {integerRegex} from "../utlity/regex.js"

test("integer regex against a list of valid integers", () => {
	expect(testRegex(integerRegex, "1", "2", "3", "4")).toBe(true)
})

test("integer regex against a list of invalid integers", () => {
	expect(testRegex(integerRegex, "1.5", "abc", "", "4.3")).toBe(false)
})

test("integer regex against a mixed list of valid and invalid integers", () => {
	expect(testRegex(integerRegex, "1", "2.3", "3", "abc")).toBe(false)
})

test("integer regex randomized tests", () => {
	let integers = []
	for (let i = 0; i < 20; i++) {
		integers.push(Math.floor(Math.random() * 100))
	}
	expect(testRegex(integerRegex, ...integers)).toBe(true)
})

test("checkIfUndefined against a list of defined variables", () => {
	expect(checkIfUndefined(15, 20, "test")).toBe(false)
})

test("checkIfUndefined against a list of undefined variables", () => {
	expect(checkIfUndefined(undefined, undefined, undefined)).toBe(true)
})

test("checkIfUndefined against a mixed list of undefined and defined variables", () => {
	expect(checkIfUndefined(1, undefined, 1.5)).toBe(true)
})