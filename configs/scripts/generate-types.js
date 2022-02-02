const { exec } = require('child_process')


const FILE_ABI_PATH = './src/helpers/abi'
const OUTPUT_PATH = './src/types/generated'

const SETTINGS = [
  {
    file: `${FILE_ABI_PATH}/MerkleProofAirdrop.json`,
    output: OUTPUT_PATH,
    name: 'GMerkleProofAirdrop',
  },
  {
    file: `${FILE_ABI_PATH}/ERC20.json`,
    output: OUTPUT_PATH,
    name: 'GERC20',
  },
]


SETTINGS.forEach((options) => {
  const cmd = [
    'node "./node_modules/ethereum-abi-types-generator/dist/bin/generator-cli.js"',
    `"${options.file}"`,
    `--output="${options.output}"`,
    `--name="${options.name}"`,
    '--provider=ethers_v5',
  ].join(' ')


  const child = exec(cmd)

  // eslint-disable-next-line no-console
  child.on('error', (error) => console.log(`[${options.name}]`, error))
  // eslint-disable-next-line no-console
  child.on('close', (error) => console.log(`[${options.name}]:`, error, cmd))
})
