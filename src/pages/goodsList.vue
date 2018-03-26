<template>
  <div class="home">
      <nav-header></nav-header>
      <nav-bread>
        <span>Goods</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" @click="sortGoodsByprice">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" :class="{'cur':priceCheck=='all'}" @click='setPriceFilter("all")'>All</a></dd>
                <dd v-for="(item,idx) in priceFilter" :key="idx" @click="setPriceFilter(idx)">
                  <a href="javascript:void(0)" :class="{'cur':priceCheck==idx}">{{item.startPrice|currency}} - {{item.endPrice|currency}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4" v-scroll="loadMore">
                <ul>
                  <li v-for="(item,index) in goodsList" :key="index">
                    <div class="pic">
                      <a href="#"><img v-lazy="`static/${item.productImage}`" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice|currency}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="loading-wrapper" v-show="isFetching">
                  <img src="static/loading-svg/loading-spinning-bubbles.svg" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <modal :mdShow="mdShow" @close="closeModal">
          <p slot="message">
             请先登录,否则无法加入到购物车中!
          </p>
          <div slot="btnGroup">
              <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
          </div>
      </modal>
      <modal :mdShow="mdShowCart" @close="closeModal">
        <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成功!</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
          <router-link class="btn btn--m btn--red" href="javascript:;" to="/cartList">查看购物车</router-link>
        </div>
      </modal>
      <div class="md-overlay" v-show="filterBy" @click.stop="closePop"></div>
     <nav-footer></nav-footer>
  </div>
</template>

<script>
import NavHeader from "../components/navHeader";
import NavFooter from "../components/navFooter";
import NavBread from "../components/navBread";
import Modal from "../components/modal";
export default {
  name: "goodslist",
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  },
  data() {
    return {
      params: {
        page: 1,
        pageSize: 8,
        startPrice: 0
      },
      sortFlag: true,
      goodsList: [],
      priceFilter: [
        {
          startPrice: "0.00",
          endPrice: "100.00"
        },
        {
          startPrice: "100.00",
          endPrice: "500.00"
        },
        {
          startPrice: "500.00",
          endPrice: "1000.00"
        },
        {
          startPrice: "1000.00",
          endPrice: "5000.00"
        }
      ],
      priceCheck: "all",
      filterBy: false,
      isLoading: false,
      isFetching: false,
      scrollTime: 0,
      mdShow: false,
      mdShowCart: false
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    getGoodsList() {
      this.$http({
        method: "get",
        url: "api/v1/goods/goodslist.node",
        payload: this.params
      })
        .then(res => {
          if (res.data.resultCode === "000000") {
            this.isLoading = false;
            this.isFetching = false;
            this.scrollTime = res.data.page.totalPage;
            let goodsList = res.data.result;
            for (let index = 0; index < goodsList.length; index++) {
              let element = goodsList[index];
              this.goodsList.push(element);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    setPriceFilter(idx) {
      this.priceCheck = idx;
      this.params.page = 1;
      if (idx != "all") {
        this.params.startPrice = this.priceFilter[idx].startPrice;
        this.params.endPrice = this.priceFilter[idx].endPrice;
      } else {
        this.params.startPrice = "0.00";
        delete this.params.endPrice;
      }
      this.goodsList = [];
      this.getGoodsList();
    },
    showFilterPop() {
      this.filterBy = true;
    },
    closeModal() {
      this.mdShow = false;
      this.mdShowCart = false;
    },
    closePop() {
      this.filterBy = false;
    },
    sortGoodsByprice() {
      this.sortFlag = !this.sortFlag;
      this.params.page = 1;
      this.goodsList = [];
      this.params.sort = this.sortFlag ? -1 : 1;
      this.getGoodsList();
    },
    loadMore() {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      this.isFetching = true;
      setTimeout(() => {
        if (this.params.page >= this.scrollTime) {
          this.isFetching = false;
          return;
        }
        this.params.page++;
        this.getGoodsList();
      }, 500);
    },
    addCart(pid) {
      this.$http({
        method: "post",
        url: "api/v1/carts/addcart.node",
        payload: {
          productId: pid
        }
      })
        .then(res => {
          if (res.data.resultCode === "000000") {
              this.$store.commit('updateCartCount',1)
            this.mdShowCart = true;
          }
        })
        .catch(err => {
          if (err.response.status == 401) {
            this.mdShow = true;
          }
        });
    }
  },
  directives: {
    scroll: {
      bind: function(el, binding) {
        window.addEventListener("scroll", function() {
          if (
            Math.ceil(
              document.documentElement.scrollTop +
                document.documentElement.clientHeight
            ) >= document.documentElement.scrollHeight
          ) {
            let loadData = binding.value;
            loadData();
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.loading-wrapper {
  text-align: center;
  height: 60px;
  margin: 20px;
}
.loading-wrapper img {
  width: 60px;
  height: 60px;
}
</style>
