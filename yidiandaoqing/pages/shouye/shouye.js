Page({
  data: {
    gerenziliao: {},
    gonggao: {},
    jintianPeisongJindu: [],
    lishiGoumaiJilu: []
  },

  onShow() {
    const gerenziliao = wx.getStorageSync("gerenziliao");
    if (!gerenziliao || !gerenziliao.xingming) {
      wx.reLaunch({ url: "/pages/denglu/denglu" });
      return;
    }
    wx.setStorageSync("zuijinYemian", "/pages/shouye/shouye");
    const gonggao = wx.getStorageSync("zuixinGonggao") || {};
    const dingdanliebiao = wx.getStorageSync("dingdanliebiao") || [];
    const jintian = this.jinriRiqi();
    const woDeDingdan = dingdanliebiao.filter((item) => item.shouji === gerenziliao.shouji);
    const jintianPeisongJindu = woDeDingdan.filter((item) => item.shijian.startsWith(jintian));
    const lishiGoumaiJilu = woDeDingdan.filter((item) => !item.shijian.startsWith(jintian));
    this.setData({ gerenziliao, gonggao, jintianPeisongJindu, lishiGoumaiJilu });
  },

  quGongneng(e) {
    const yemiandizhi = e.currentTarget.dataset.url;
    wx.setStorageSync("zuijinYemian", yemiandizhi);
    wx.navigateTo({ url: yemiandizhi });
  },

  tuichu() {
    wx.removeStorageSync("gerenziliao");
    wx.removeStorageSync("zuijinYemian");
    const app = getApp();
    app.globalData.gouwuche = [];
    wx.reLaunch({ url: "/pages/denglu/denglu" });
  },

  jinriRiqi() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
});
