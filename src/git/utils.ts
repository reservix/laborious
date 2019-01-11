/**
 * Stolen from: https://github.com/jonschlinkert/is-git-url
 * (too lazy to add typings)
 */
const GIT_URL_REGEX = /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
export const isGitUrl = (val: string) => GIT_URL_REGEX.test(val);
