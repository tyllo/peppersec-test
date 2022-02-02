import {
  ROUTE_AIRDROP_CREATE,
  ROUTE_AIRDROP_SUMMARY,
  ROUTE_AIRDROP_DROP,

  ROUTE_ERROR_404,
} from './routes'


export const PAGE_AIRDROP_CREATE = {
  name: ROUTE_AIRDROP_CREATE,
  to: { name: ROUTE_AIRDROP_CREATE },
  title: 'Создать Airdrop',
}

export const PAGE_AIRDROP_SUMMARY = {
  name: ROUTE_AIRDROP_SUMMARY,
  to: { name: ROUTE_AIRDROP_SUMMARY },
  title: 'Airdrop',
}

export const PAGE_AIRDROP_DROP = {
  name: ROUTE_AIRDROP_DROP,
  to: { name: ROUTE_AIRDROP_DROP },
  title: 'Забрать токена',
}

export const PAGE_ERROR_404 = {
  name: ROUTE_ERROR_404,
  to: { name: ROUTE_ERROR_404 },
  title: 'Страница не найдена',
}
