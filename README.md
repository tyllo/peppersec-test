## Тестовое задание - Dapp для рассылки ERC20 токенов.
---
Для предоставленого смарт-контракта необходимо реализовать фронтенд. Флоу работы следущий


**Создатель airdrop (рассылки):**
1. заходит на страницу dapp подключает кошелек (Metamask) и предоставляет
  a. адрес токена
  b. список адресов с соответствующими балансами
2. приложение должно убедиться что
  а. у пользователя есть необходимый баланс выбранного токена
  b. пользователь выдал разрешение смарт-контракту тратить его токены (в терминах ERC20 стандарта, нужно убедится в достаточном allowance)
3. если allowance недостаточный то предложить пользователю сделать approve на необходимую сумму.
4. сформировать Merkle Tree из предоставленных пользователем данных. Листом дерева является keccak256(_recipient, _amount)
5. загрузить список рассылки в любое обще-доступное хранилище (например ipfs)
6. позвонить пользователю наконец создать airdrop (на этот момент у приложения есть все необходимые данные для формирования транзакции вызова метода createNewAirdrop)
7. предоставить специальный URL для получателей токена


**Получатель (юзеры из списка)**
1. Заходит по специально сформированному URL и подключает свой кошелек
2. Приложение проверяет является ли подключенный кошелек получателем рассылки
3. Если да то предлагает забрать токены из смарт-контракта. Для этого приложение должно сформировать транзакцию для вызова метода drop(bytes32[] proof, address _recipient, uint256 _amount, string _ipfs). Где proof это merkle tree proof для указанного элемента дерева (_recipient,_amount), а _ipfs идентификатор рассылки


**Полезные ссылки**
1. [Где взять](https://erc20faucet.com) ERC20 токены для рассылки и [faucet ETH](https://faucets.chain.link/goerli) в сети goerli
2. [Смарт-контракт]((https://goerli.etherscan.io/address/0x45df93713f04972e6419d31780a85b0fff56604c#code)) с которым взаимодействует приложение
3. [ERC20 standard](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)
4. [Пример реализации](https://github.com/tornadocash/fixed-merkle-tree) Merkle tree. Обрати внимание по умолчанию там не другая хеш-функция используется, а тебе нужен keccak256(sha3)
5. Еще ссылок: [MerkleProof.test.js](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/test/utils/cryptography/MerkleProof.test.js), [презентация](https://rstormsf.github.io/slides-merkleairdrop/), [multisender](http://multisender.app)



## Quasar App
---

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
npm run dev
```

### Build the app for production
```bash
npm run build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

### For window use docker
```bash
docker run --rm -p 8080:8080 -v `pwd`:/app -it node:16.3.0-alpine sh

cd /app

yarn

npm run dev

```
