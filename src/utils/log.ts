import indentString from 'indent-string';
import logSymbols from 'log-symbols';

const logWith = (prefix: string) => (msg: string) =>
  console.log(`${prefix} ${msg}`);

export function log(msg: string) {
  return console.log(msg);
}

log.info = logWith(logSymbols.info);
log.success = logWith(logSymbols.success);
log.warning = logWith(logSymbols.warning);
log.error = logWith(logSymbols.error);
log.indent = (msg: string, indent?: string) =>
  console.log(
    indentString(msg, typeof indent === 'string' ? 1 : 0, {
      indent,
      includeEmptyLines: true,
    })
  );
