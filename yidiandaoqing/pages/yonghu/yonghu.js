Page({
  data: {
    shangpinliebiao: [],
    gouwuche: [],
    zongjia: 0,
    shuliangMap: {}
  },

  onLoad() {
    this.shuaxinQuanbu();
  },

  onShow() {
    const gerenziliao = wx.getStorageSync("gerenziliao");
    if (!gerenziliao || gerenziliao.shenfen !== "yonghu") {
      wx.reLaunch({ url: "/pages/denglu/denglu" });
      return;
    }
    wx.setStorageSync("zuijinYemian", "/pages/yonghu/yonghu");
    this.shuaxinQuanbu();
  },

  jiaYiFen(e) {
    const id = e.currentTarget.dataset.id;
    const shangpin = this.data.shangpinliebiao.find((x) => x.id === id);
    if (!shangpin) return;

    const gouwuche = [...this.data.gouwuche];
    const idx = gouwuche.findIndex((x) => x.id === id);
    if (idx > -1) {
      gouwuche[idx].shuliang += 1;
    } else {
      gouwuche.push({
        id: shangpin.id,
        mingzi: shangpin.mingzi,
        jiage: shangpin.jiage,
        shuliang: 1
      });
    }

    this.baocunGouwuche(gouwuche);
  },

  jianYiFen(e) {
    const id = e.currentTarget.dataset.id;
    const gouwuche = [...this.data.gouwuche];
    const idx = gouwuche.findIndex((x) => x.id === id);
    if (idx === -1) return;

    gouwuche[idx].shuliang -= 1;
    if (gouwuche[idx].shuliang <= 0) {
      gouwuche.splice(idx, 1);
    }
    this.baocunGouwuche(gouwuche);
  },

  quXiadan() {
    if (this.data.gouwuche.length === 0) {
      wx.showToast({
        title: "先选点东西",
        icon: "none"
      });
      return;
    }
    wx.navigateTo({ url: "/pages/xiadan/xiadan" });
  },

  shuaxinQuanbu() {
    const shangpinliebiao = wx.getStorageSync("shangpinliebiao") || [];
    this.setData({ shangpinliebiao });
    this.shuaxinGouwuche();
  },

  shuaxinGouwuche() {
    const app = getApp();
    const gouwuche = app.globalData.gouwuche || [];
    const zongjia = gouwuche.reduce((sum, item) => sum + item.jiage * item.shuliang, 0);
    this.setData({ gouwuche, zongjia, shuliangMap: this.zhuanShuliangMap(gouwuche) });
  },

  baocunGouwuche(gouwuche) {
    const app = getApp();
    app.globalData.gouwuche = gouwuche;
    const zongjia = gouwuche.reduce((sum, item) => sum + item.jiage * item.shuliang, 0);
    this.setData({ gouwuche, zongjia, shuliangMap: this.zhuanShuliangMap(gouwuche) });
  },

  zhuanShuliangMap(gouwuche) {
    const map = {};
    gouwuche.forEach((item) => {
      map[item.id] = item.shuliang;
    });
    return map;
  }
});
