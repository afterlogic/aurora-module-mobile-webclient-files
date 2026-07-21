export default {
  pString: (value, defaultValue = '') =>
    value !== undefined && value !== null ? String(value) : defaultValue,
  pInt: (value, defaultValue = 0) => {
    const n = parseInt(value, 10)
    return Number.isNaN(n) ? defaultValue : n
  },
  pBool: (value, defaultValue = false) =>
    typeof value === 'boolean' ? value : defaultValue,
  pArray: (value, defaultValue = []) => (Array.isArray(value) ? value : defaultValue),
  pObject: (value, defaultValue = {}) =>
    value && typeof value === 'object' && !Array.isArray(value) ? value : defaultValue,
}
