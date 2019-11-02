#!/usr/bin/env node



const OSS = require("ali-oss")
const dotenv = require("dotenv")
const cwd = process.cwd()
const fs = require('fs')
const chalk = require("chalk")


//获取默认env配置
require("dotenv").config()



const uploadFile = (client, folder, aliOSSBasePath) => {
    const dist = folder || 'dist'

    require('ali-oss-deploy-with-version')(client, {
        localFolderPath: `${cwd}/${dist}`,
        aliOSSBasePath: aliOSSBasePath,
        filesAlsoCopy2Base: [/\.html/]
    })
}

// todo: 只处理了两层目录
module.exports = async ({ folder, env }) => {
    //如果有指定环境，则读取指定环境配置，重载默认env配置
    if (env) {
        const envConfig = dotenv.parse(fs.readFileSync(`.env.${env}`))
        for (const k in envConfig) {
            process.env[k] = envConfig[k]
        }
    }

    //设置oss
    const client = new OSS({
        region: process.env.OSS_REGION,
        accessKeyId: process.env.OSS_KEY,
        accessKeySecret: process.env.OSS_SECRET,
        bucket: process.env.OSS_BUCKET
    })

    const aliOSSBasePath = process.env.OSS_DIR || require(cwd + '/package.json').name

    const result = await client.list({
        prefix: aliOSSBasePath,
        delimiter: '/'
    })

    let res = (result.objects && [].concat(result) || []).concat(result.prefixes && await Promise.all(result.prefixes.map(key => client.list({
        prefix: key,
        delimiter: '/'
    }))) || [])

    res = res.reduce((sum, item) => sum.concat(item.objects || []), [])


    if (res.length > 0) {
        await client.deleteMulti(res.map(item => item.name))
    }

    const emojiInfo = "ℹ️";
    console.log(chalk.blue(`${emojiInfo}  current ENV:`), env)

    return uploadFile(client, folder, aliOSSBasePath)
}



