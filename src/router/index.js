
const goodsList = r => require.ensure([], () => r(require('../pages/goodsList')), 'goodsList');
const cartList = r => require.ensure([], () => r(require('../pages/cartList')), 'cartList');
const addressList = r => require.ensure([], () => r(require('../pages/addressList')), 'addressList');
const orderConfirm = r => require.ensure([], () => r(require('../pages/orderConfirm')), 'orderconfirm');
const orderSuccess = r => require.ensure([], () => r(require('../pages/orderSuccess')), 'orderSuccess');

export default [{
    path: '/',
    name: 'goodsList',
    component: goodsList
  },
  {
    path: "/cartList",
    name: 'cartList',
    component: cartList
  },
  {
    path: "/addressList",
    name: 'addressList',
    component: addressList
  },
  {
    path: "/orderConfirm/:addressId",
    name: 'orderConfirm',
    component: orderConfirm
  },
  {
    path:"/orderSuccess/:orderId",
    name:'orderSuccess',
    component:orderSuccess
  }
]
