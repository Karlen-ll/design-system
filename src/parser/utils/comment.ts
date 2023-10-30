import { FileComment } from '@/parser/types'

const DEFAULT_COMMENT = '⚠️ Сгенерированный файл. Не редактировать!'

/** Получить текущую дату */
export function getCurrentDate() {
  return new Date().toLocaleDateString('ru', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** Сформировать комментарий с информацией по файлу */
export function getComment(): FileComment {
  return `${DEFAULT_COMMENT} —*— ${getCurrentDate()}`
}
