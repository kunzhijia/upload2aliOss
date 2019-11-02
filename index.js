#!/usr/bin/env node

require("dotenv").config()


const OSS = require("ali-oss")
const env = process.env
const cwd = process.cwd()


const uploadFile = (client, folder, aliOSSBasePath) => {
  const dist = folder || 'dist'

  require('ali-oss-deploy-with-version')(client, {
    localFolderPath: `${cwd}/${dist}`,
    aliOSSBasePath: aliOSSBasePath,
    filesAlsoCopy2Base: [/\.html/]
  })
}

// todo: 只处理了两层目录
const upload = async (folder) => {
  const client = new OSS({
    region: env.OSS_REGION,
    accessKeyId: env.OSS_KEY,
    accessKeySecret: env.OSS_SECRET,
    bucket: env.OSS_BUCKET
  })

  const aliOSSBasePath = env.OSS_DIR || require(cwd + '/package.json').name

  const result = await client.list({
    prefix: aliOSSBasePath,
    delimiter: '/'
  })

  let res = (result.objects && [].concat(result) || []).concat(result.prefixes && await Promise.all(result.prefixes.map(key => client.list({
    prefix: key,
    delimiter: '/'
  }))) || [])

  res = res.reduce((sum, item) => sum.concat(item.objects || []), [])

  console.log(res.map(item => item.name))

  if (res.length > 0) {
    await client.deleteMulti(res.map(item => item.name))
  }
  
  return uploadFile(client, folder, aliOSSBasePath)
}

upload()

console.log("TCL: upload", `${cwd}/dist`)
