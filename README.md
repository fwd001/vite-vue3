使用文档： https://doc.vvbin.cn/

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

## Change Log

[CHANGELOG](./CHANGELOG.zh_CN.md)

## Project

- [vue-vben-admin](https://github.com/anncwb/vue-vben-admin) - full version
- [vue-vben-admin-thin-next](https://github.com/anncwb/vben-admin-thin-next) - Simplified version

## How to contribute

You are very welcome to join！[Raise an issue](https://github.com/anncwb/vue-vben-admin/issues/new/choose) Or submit a Pull Request。

**Pull Request:**

1. Fork code!
2. Create your own branch: `git checkout -b feat/xxxx`
3. Submit your changes: `git commit -am 'feat(function): add xxxxx'`
4. Push your branch: `git push origin feat/xxxx`
5. submit`pull request`

## Git Contribution submission specification

- reference [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) specification ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` Add new features
  - `fix` Fix the problem/BUG
  - `style` The code style is related and does not affect the running result
  - `perf` Optimization/performance improvement
  - `refactor` Refactor
  - `revert` Undo edit
  - `test` Test related
  - `docs` Documentation/notes
  - `chore` Dependency update/scaffolding configuration modification etc.
  - `workflow` Workflow improvements
  - `ci` Continuous integration
  - `types` Type definition file changes
  - `wip` In development

## Related warehouse

If these plugins are helpful to you, you can give a star support

- [vite-plugin-mock](https://github.com/anncwb/vite-plugin-mock) - Used for local and development environment data mock
- [vite-plugin-html](https://github.com/anncwb/vite-plugin-html) - Used for html template conversion and compression
- [vite-plugin-compression](https://github.com/anncwb/vite-plugin-compression) - Used to pack input .gz|.brotil files
- [vite-plugin-svg-icons](https://github.com/anncwb/vite-plugin-svg-icons) - Used to quickly generate svg sprite
