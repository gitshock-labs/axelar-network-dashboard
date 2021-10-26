import Exercise3 from './exercise3'

export default function Exercises({ id }) {
	switch (id) {
		case '3':
			return (<Exercise3 />)
		default:
			return null
	}
}