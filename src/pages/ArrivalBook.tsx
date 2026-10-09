import arrivalBook from '../data/arrivalBook.json'
import { NativeBook } from './MastersBook'

export default function ArrivalBook() {
  return <NativeBook data={arrivalBook} title="抵达之书" subtitle="SAT Arrival Book · 26 Revised" storageKey="arrival_book_answers" />
}
