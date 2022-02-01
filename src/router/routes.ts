import { Router } from 'vue-router'

import AirdropRoutes from 'pages/Airdrop/routes'
import HomeRoutes from 'pages/Home/routes'
import ErrorsRoutes from 'pages/Errors/routes'


type ICreateRoutesOptions = {
  router: Router;
}

export const createRoutes = (options: ICreateRoutesOptions) => [
  ...HomeRoutes(options),
  ...AirdropRoutes(options),

  // must be last, because in error - `*` route
  ...ErrorsRoutes(options),
]
