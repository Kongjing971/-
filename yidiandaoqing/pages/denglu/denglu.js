Page({
  tiaoZhuanDaoShangCiYemian(gerenziliao) {
    const morenMap = {
      yonghu: "/pages/shouye/shouye",
      guanliyuan: "/pages/guanli/guanli",
      peisongyuan: "/pages/peisong/peisong"
    };
    const zuijinYemian = wx.getStorageSync("zuijinYemian");
    const mubiao = zuijinYemian || morenMap[gerenziliao.shenfen] || "/pages/shouye/shouye";
    wx.reLaunch({ url: mubiao });
  },

  data: {
    xingming: "",
    qinshihao: "",
    shouji: "",
    shenfen: "yonghu",
    mima: ""
  },

  onLoad() {
    const gerenziliao = wx.getStorageSync("gerenziliao");
    if (gerenziliao && gerenziliao.xingming) {
      this.setData({
        xingming: gerenziliao.xingming || "",
        qinshihao: gerenziliao.qinshihao || "",
        shouji: gerenziliao.shouji || "",
        shenfen: gerenziliao.shenfen || "yonghu"
      });
    }
  },

  onShow() {
    const gerenziliao = wx.getStorageSync("gerenziliao");
    if (gerenziliao && gerenziliao.xingming) {
      this.tiaoZhuanDaoShangCiYemian(gerenziliao);
    }
  },

  shuru(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ [key]: e.detail.value });
  },

  xuanShenfen(e) {
    this.setData({
      shenfen: e.currentTarget.dataset.shenfen,
      mima: ""
    });
  },

  denglu() {
    const { xingming, qinshihao, shouji, shenfen, mima } = this.data;
    if (!xingming || !qinshihao || !shouji) {
      wx.showToast({ title: "请完整填写信息", icon: "none" });
      return;
    }
    if (!/^1\d{10}$/.test(shouji)) {
      wx.showToast({ title: "手机号格式不对", icon: "none" });
      return;
    }
    if (shenfen === "guanliyuan" && mima !== "971661") {
      wx.showToast({ title: "管理员密码错误", icon: "none" });
      return;
    }
    if (shenfen === "peisongyuan" && mima !== "8520") {
      wx.showToast({ title: "配送员密码错误", icon: "none" });
      return;
    }
    const gerenziliao = { xingming, qinshihao, shouji, shenfen };
    wx.setStorageSync("gerenziliao", gerenziliao);
    this.tiaoZhuanDaoShangCiYemian(gerenziliao);
  },

  zhijieJinru() {
    const gerenziliao = wx.getStorageSync("gerenziliao");
    if (!gerenziliao || !gerenziliao.xingming) {
      wx.showToast({ title: "还没有保存信息", icon: "none" });
      return;
    }
    this.tiaoZhuanDaoShangCiYemian(gerenziliao);
  }
});
