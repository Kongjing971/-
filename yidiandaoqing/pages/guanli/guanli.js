Page({
  data: {
    jintianDingdan: [],
    lishiDingdan: [],
    jinyingyee: 0,
    peisonggongzi: 0,
    daoshou: 0,
    xinshangpinming: "",
    xinshangpinjiage: "",
    gonggaoshuru: "",
    zuixinGonggao: {}
  },

  onShow() {
    const gerenziliao = wx.getStorageSync("gerenziliao");
    if (!gerenziliao || gerenziliao.shenfen !== "guanliyuan") {
      wx.reLaunch({ url: "/pages/denglu/denglu" });
      return;
    }
    wx.setStorageSync("zuijinYemian", "/pages/guanli/guanli");
    const dingdanliebiao = wx.getStorageSync("dingdanliebiao") || [];
    const jintian = this.jinriRiqi();
    const jintianDingdan = dingdanliebiao.filter((item) => item.shijian.startsWith(jintian));
    const jinyingyee = jintianDingdan.reduce((sum, item) => sum + Number(item.zongjia), 0);
    const jintianJianshu = this.suanJianshu(jintianDingdan);
    const peisonggongzi = Number((jintianJianshu * 0.3).toFixed(2));
    const daoshou = Number((jinyingyee - peisonggongzi).toFixed(2));
    const lishiDingdan = dingdanliebiao.filter((item) => !item.shijian.startsWith(jintian));
    const zuixinGonggao = wx.getStorageSync("zuixinGonggao") || {};
    this.setData({ jintianDingdan, lishiDingdan, jinyingyee, peisonggongzi, daoshou, zuixinGonggao });
  },

  shuru(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ [key]: e.detail.value });
  },

  tianjiaShangpin() {
    const { xinshangpinming, xinshangpinjiage } = this.data;
    if (!xinshangpinming || !xinshangpinjiage) {
      wx.showToast({ title: "请输入商品和价格", icon: "none" });
      return;
    }
    const jiage = Number(xinshangpinjiage);
    if (Number.isNaN(jiage) || jiage <= 0) {
      wx.showToast({ title: "价格格式不对", icon: "none" });
      return;
    }
    const shangpinliebiao = wx.getStorageSync("shangpinliebiao") || [];
    shangpinliebiao.push({
      id: Date.now(),
      mingzi: xinshangpinming,
      jiage,
      tupianwenzi: xinshangpinming.slice(0, 1)
    });
    wx.setStorageSync("shangpinliebiao", shangpinliebiao);
    this.setData({ xinshangpinming: "", xinshangpinjiage: "" });
    wx.showToast({ title: "已添加商品", icon: "success" });
  },

  fabuGonggao() {
    const { gonggaoshuru } = this.data;
    if (!gonggaoshuru) {
      wx.showToast({ title: "请输入公告内容", icon: "none" });
      return;
    }
    const zuixinGonggao = {
      neirong: gonggaoshuru,
      shijian: this.geShiJian()
    };
    wx.setStorageSync("zuixinGonggao", zuixinGonggao);
    this.setData({ zuixinGonggao, gonggaoshuru: "" });
    wx.showToast({ title: "公告已发布", icon: "success" });
  },

  suanJianshu(dingdanliebiao) {
    return dingdanliebiao.reduce((sum, dan) => {
      const jianshu = (dan.shangpin || []).reduce((itemSum, sp) => itemSum + Number(sp.shuliang || 0), 0);
      return sum + jianshu;
    }, 0);
  },

  jinriRiqi() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  },

  geShiJian() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${day} ${h}:${min}`;
  }
});
