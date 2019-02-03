// converts YYYY-MM-DDThh:mm into date
export const formatDate = dateString => {
  return new Date(
    Number(dateString.slice(0, 4)),
    Number(dateString.slice(5, 7)) - 1,
    Number(dateString.slice(8, 10)),
    Number(dateString.slice(11, 13)),
    Number(dateString.slice(14, 16))
  )
}

// converts date into string YYYY-MM-DDThh:mm e.g. '2019-02-02T17:33'
export const formatDateString = date => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
}

export const formatDateDisplay = dateString => {
  const date = new Date(dateString)
  var options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }

  return date.toLocaleDateString('en-US', options)
}
