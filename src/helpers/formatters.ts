import { utils } from 'ethers'


export const formatHumanTokenAmount = (
  units?: string,
  minValue = 0.001,
) => {
  if (units === '0') return '0'
  if (!units) return void 0

  const value = utils.formatEther(units)
  if (+value < minValue) return `< ${minValue}`

  const [v1, v2] = value.split('.')
  if (!v2) return value

  if (+v2 < minValue) return v1

  return [
    v1,
    v2.slice(0, 3),
  ].join('.')
}
