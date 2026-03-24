/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
function strStr(haystack, needle) {
  return haystack.indexOf(needle);
}
let data = [""];
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
function strStr2(haystack, needle) {
  const n = haystack.length - needle.length;
  for (let i = 0; i < n; i++) {
    if (equal(needle, sliced(haystack, i, needle.length))) {
      return i;
    }
  }
  return -1;
}

function strStr3(haystack, needle) {
  data[0] = "";
  return [strStr2(haystack, needle), data[0]];
}
function equal(a, b) {
  const i = firstDiffCharIndex(a, b);
  data[0] += " -> " + b.slice(b.from, b.from + i + 1);
  return i === b.length;
}

// O(length), M(1)
function firstDiffCharIndex(a, b) {
  if (a.length !== b.length) return -1;

  data[0] += "\r\n";
  for (let i = 0; i < b.length; i++) {
    data[0] += " " + (b.from + i);
    if (a.at(i) !== b.at(i)) {
      return i;
    }
  }
  return b.length;
}

function sliced(str, from, length) {
  return {
    length,
    from,
    at(i) {
      return str.at(from + i);
    },
    slice(f, t) {
      return str.slice(f, t);
    },
  };
}
