import { SUBJECTS, TIMES } from '../data/timetableData'

export const classesFor = (slots) =>
  slots.map((key, index) => ({ key, index }))
    .filter(({ key, index }) => key !== 'X' && !(key === 'LAB' && slots[index - 1] === 'LAB'))
    .map(({ key, index }) => ({
      time: TIMES[index],
      subject: SUBJECTS[key],
      hours: key === 'LAB' ? '2 hrs' : '1 hr',
    }))
