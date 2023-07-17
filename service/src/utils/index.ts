import moment from 'moment'

interface SendResponseOptions<T = any> {
  type: 'Success' | 'Fail'
  message?: string
  data?: T
}

export function sendResponse<T>(options: SendResponseOptions<T>) {
  if (options.type === 'Success') {
    return Promise.resolve({
      message: options.message ?? null,
      data: options.data ?? null,
      status: options.type,
    })
  }

  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject({
    message: options.message ?? 'Failed',
    data: options.data ?? null,
    status: options.type,
  })
}

/** 是否为某天 */
export function isSomeDay(month: number, day: number) {
  const today = moment().utcOffset(8).toDate()
  global.console.log('this_time ===>', today.toLocaleString())
  global.console.log('this_date ===>', today)
  global.console.log('this_minute ===>', today.toLocaleTimeString())
  const Month = today.getMonth() + 1
  const Day = today.getDate()
  return (Month === month && Day === day)
}
