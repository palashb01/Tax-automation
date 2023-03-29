const log = function () {
  var context = `${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}: `;
  return Function.prototype.bind.call(console.log, console, context);
}();

export default log;