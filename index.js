#!/usr/bin/env node


const cli = require('cac')()
const upload = require('./lib/upload')


cli.command('[env]', 'Choose a project env')
    .option('--folder [folder]', 'Choose the folder', {
        default: 'dist'
    })
    .action((env, options) => {
        upload({
            env,
            folder: options.folder
        })
    })

// Display help message when `-h` or `--help` appears
cli.help()
// Display version number when `-v` or `--version` appears
// It's also used in help message
cli.version('0.0.0')

cli.parse()