yyl-server / [Exports](modules.md)

# yyl-server

## 安装

```bash
yarn add yyl-server
```

## 使用

```typescript
import { Runner } from 'yyl-server'
import yylConfig from './yyl.config'

const runner = new Runner({
  yylConfig: config,
  log: () => undefined,
  env: {},
  cwd: process.cwd(),
  serverOption: {
    appWillMount() {
      mountArr.push('will')
      return Promise.resolve()
    },
    appDidMount() {
      mountArr.push('did')
      return Promise.resolve()
    }
  }
})
```
