import { RouteRecordRaw } from 'vue-router'
import { ROUTE_HOME, ROUTE_AIRDROP_CREATE } from 'src/helpers/enums/routes'


const createRoutes = (): RouteRecordRaw[] => [
  {
    path: '/',
    name: ROUTE_HOME,
    redirect: {
      name: ROUTE_AIRDROP_CREATE,
    },
  },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createModule = (options: unknown) => {
  const routes = createRoutes()
  return routes
}

export default createModule
