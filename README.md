## doc

[文档地址](https://doc.vvbin.cn/)

```bash
cd vue-vue3

pnpm install

```

- run

```bash
pnpm serve
```

- build

```bash
pnpm build
```

- docker

### The dockerFile is located in the project root directory and supports differential deployment

#### build image

```bash
docker build -t vue-vben-admin .
```

#### Environment variables are dynamically used to achieve differentiated container deployment. Different VG_BASE_URL environment variables point to different back-end service addresses. In the following example, http://localhost:3333 is used as the back-end service address and the container is mapped to port 6666

```bash
docker run --name vue-vben-admin -d -p 6666:80  -e VG_BASE_URL=http://localhost:3333 vue-vben-admin
```

Then you can navigate http://localhost:6666
