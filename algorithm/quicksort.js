// 递归版本（非常慢）
const qsort_recurv = array => {
  if (array.length <= 1) {
    return array
  }
  const [first, ...rest] = array
  const smaller = [],
    bigger = []
  for (var i = 0; i < rest.length; i++) {
    const value = rest[i]
    value < first ? smaller.push(value) : bigger.push(value)
  }
  return [...quickSort(smaller), first, ...quickSort(bigger)]
}

function qsort(arrs, left, right) {
  const base = arrs[left]
  let i = left
  let j = right
  while (i !== j) {
    while (base <= arrs[j] && i < j) {
      j--
    }
    while (base >= arrs[i] && i < j) {
      i++
    }
    if (i < j) {
      const temp = arrs[i]
      arrs[i] = arrs[j]
      arrs[j] = temp
    }
  }
  const temp = arrs[i]
  arrs[i] = base
  arrs[left] = temp
  // console.log([...arrs], left, right, i, j)
  if (i - 1 > left) qsort(arrs, left, i - 1)
  if (j + 1 < right) qsort(arrs, j + 1, right)
}
