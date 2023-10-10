const DEFAULT_MESSAGE =
  'I have you IP!!!!!!!!!!!!!';
const fullMessage = addDateTime(DEFAULT_MESSAGE);
alert(fullMessage);

function addDateTime(message) {
  const dateTimeNow = new Date();
  const date = dateTimeNow.toLocaleDateString();
  const hour = dateTimeNow.toLocaleTimeString([], { timeStyle: 'short' });
  return date + ' ' + hour + ' : ' + message;
}

