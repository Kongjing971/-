Page({
  data: {
    gouwuche: [],
    zongjia: 0,
    lianxiren: "",
    shouji: "",
    qinshihao: "",
    beizhu: ""
  },

  onShow() {
    const app = getApp();
    const gouwuche = app.globalData.gouwuche || [];
    const zongjia = gouwuche.reduce((sum, item) => sum + item.jiage * item.shuliang, 0);
    const gerenziliao = wx.getStorageSync("gerenziliao") || {};
    if (!gerenziliao || gerenziliao.shenfen !== "yonghu") {
      wx.reLaunch({ url: "/pages/denglu/denglu" });
      return;
    }
    wx.setStorageSync("zuijinYemian", "/pages/xiadan/xiadan");
    this.setData({
      gouwuche,
      zongjia,
      lianxiren: gerenziliao.xingming || "",
      shouji: gerenziliao.shouji || "",
      qinshihao: gerenziliao.qinshihao || ""
    });
  },

  shuru(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      [key]: e.detail.value
    });
  },

  tijiaoDingdan() {
    const { gouwuche, zongjia, lianxiren, shouji, qinshihao, beizhu } = this.data;
    if (!gouwuche.length) {
      wx.showToast({ title: "还没有选商品", icon: "none" });
      return;
    }
    if (!lianxiren || !shouji || !qinshihao) {
      wx.showToast({ title: "请把地址信息写完整", icon: "none" });
      return;
    }
    const xinDingdan = {
      id: Date.now(),
      shijian: this.geShiJian(),
      shangpin: gouwuche,
      zongjia,
      lianxiren,
      shouji,
      dizhi: qinshihao,
      beizhu,
      zhuangtai: "待配送"
    };

    const dingdanliebiao = wx.getStorageSync("dingdanliebiao") || [];
    dingdanliebiao.unshift(xinDingdan);
    wx.setStorageSync("dingdanliebiao", dingdanliebiao);

    const app = getApp();
    app.globalData.gouwuche = [];

    wx.showToast({ title: "下单成功", icon: "success" });
    setTimeout(() => {
      wx.setStorageSync("zuijinYemian", "/pages/shouye/shouye");
      wx.reLaunch({ url: "/pages/shouye/shouye" });
    }, 500);
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
