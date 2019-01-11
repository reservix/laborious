import indent from 'indent-string';
import logSymbols from 'log-symbols';

const logWith = (prefix: string) => (msg: string) =>
  console.log(`${prefix} ${msg}`);

export const log = {
  info: logWith(logSymbols.info),
  success: logWith(logSymbols.success),
  warning: logWith(logSymbols.warning),
  error: logWith(logSymbols.error),
  indent: (msg: string) => console.log(indent(msg, 0)),
};
