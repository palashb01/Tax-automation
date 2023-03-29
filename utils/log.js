const log = function () {
  var context = `${new Date().toLocaleString()}: `;
  return Function.prototype.bind.call(console.log, console, context);
}();

export default log;