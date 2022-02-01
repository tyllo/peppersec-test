import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteLocationNormalized,
} from 'vue-router'
import { createRoutes } from './routes'


/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const createTitleGuard = (defaultTitle: string) => (to: RouteLocationNormalized) => {
  const title = (to.meta as Record<string, string>)?.title
  document.title = title ? `${title} — ${defaultTitle}` : defaultTitle
}

const createAppRouter = ((/* { store, ssrContext } */) => {
  // eslint-disable-next-line no-nested-ternary
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes: [],

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE,
    ),
  })

  const routes = createRoutes({ router })
  routes.forEach((route) => router.addRoute(route))

  const titleGuar = createTitleGuard(document.title)
  router.afterEach(titleGuar)

  return router
})

export default createAppRouter
