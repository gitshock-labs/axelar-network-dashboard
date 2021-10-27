import Exercise1 from './exercise1'
import Exercise3 from './exercise3'
import Exercise4 from './exercise4'
import Exercise5 from './exercise5'

export default function Exercises({ id }) {
  switch (id) {
    case '1':
      return (<Exercise1 />)
    case '3':
      return (<Exercise3 />)
    case '4':
      return (<Exercise4 />)
    case '5':
      return (<Exercise5 />)
    default:
      return null
  }
}