<template>
  <div>
      <nav-header></nav-header>
      <div class="container">
    <div class="page-title-normal">
      <h2 class="page-title-h2"><span>check out</span></h2>
    </div>
    <!-- 进度条 -->
    <div class="check-step">
      <ul>
        <li class="cur"><span>Confirm</span> address</li>
        <li class="cur"><span>View your</span> order</li>
        <li class="cur"><span>Make</span> payment</li>
        <li class="cur"><span>Order</span> confirmation</li>
      </ul>
    </div>

    <div class="order-create">
      <div class="order-create-pic"><img src="../../static/ok-2.png" alt=""></div>
      <div class="order-create-main">
        <h3>Congratulations! <br>Your order is under processing!</h3>
        <p>
          <span>Order ID：{{orderId}}</span>
          <span>Order total：{{orderTotal | currency}}</span>
        </p>
        <div class="order-create-btn-wrap">
          <div class="btn-l-wrap">
              <router-link to="/cartList" class="btn btn--m">Cart List</router-link>
          </div>
          <div class="btn-r-wrap">
              <router-link to="/" class="btn btn--m">Goods List</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <nav-footer></nav-footer>
  </div>
</template>
<script>
import NavHeader from "../components/navHeader";
import NavFooter from "../components/navFooter";
export default {
  name: "orderSuccess",
  components: {
    NavHeader,
    NavFooter
  },
  data() {
    return {
      orderId: "",
      orderTotal: 0
    };
  },
  mounted() {
    this.$http({
      method: "get",
      url: "api/v1/carts/getOrderDetail.node",
      payload: {
        orderId: this.$route.params.orderId
      }
    }).then(res => {
        if(res.data.resultCode==="000000"){
            this.orderId=res.data.info.orderId
            this.orderTotal=res.data.info.orderTotal
        }
    }).catch(err=>{
        console.log(err);
    })
  }
};
</script>
<style>

</style>


