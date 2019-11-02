# 简介

## 使用

```
npm i upload2aliOss

upload2aliOss
```

## env config


### 多环境配置
工具支持跟进环境来加载配置，定义多个环境的配置文件

```
.env
.env.dev
.env.test
.ent.uat
.ent.prod
```

`.env` 为默认的配置文件，所有环境都会加载这个配置文件，一般也会作为开发环境的默认配置文件。

当指定 env 时会同时加载对应的配置文件，并覆盖默认配置文件的同名配置。如 prod 环境会加载 `.env.prod` 和 `.env` 文件，`.env.prod` 会覆盖 `.env` 的同名配置。


### oss配置


```
OSS_KEY=oss key
OSS_SECRET=oss secret
OSS_BUCKET=oss bucket
OSS_REGION=oss-cn-shenzhen
OSS_DIR=dm-poc  // 存放的目录
```

