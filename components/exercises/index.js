import Exercise3 from './exercise3'
import Exercise4 from './exercise4'

export default function Exercises({ id }) {
  switch (id) {
    case '3':
      return (<Exercise3 />)
    case '4':
      return (<Exercise4 />)
    default:
      return null
  }
}