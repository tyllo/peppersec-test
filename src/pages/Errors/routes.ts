import { RouteRecordRaw } from 'vue-router'
import { ROUTE_ERROR_404 } from 'src/helpers/enums/routes'
import { PAGE_ERROR_404 } from 'src/helpers/enums/pages'


const createRoutes = (): RouteRecordRaw[] => [
  {
    path: '/:path_match(.*)*',
    name: ROUTE_ERROR_404,
    meta: {
      title: PAGE_ERROR_404.title,
    },
    component: () => import(
      /* webpackChunkName: "errors.errors" */
      /* webpackExports: ["default"] */
      './ErrorNotFound404.vue'
    ),
  },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createModule = (options: unknown) => {
  const routes = createRoutes()
  return routes
}

export default createModule
