import Exercise4 from './exercise4'
import Exercise5 from './exercise5'

export default function Exercises({ id }) {
  switch (id) {
    case '4':
      return (<Exercise4 />)
    case '5':
      return (<Exercise5 />)
    default:
      return null
  }
}