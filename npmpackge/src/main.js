import program from 'commander'
import { VERSION } from './utils/constants'
import create from './create'

program.command('create')
  .description('create hwui template')
  .alias('c')
  .action(() => {
    create()
  })

program.version(VERSION,'-v --version').parse(process.argv)
