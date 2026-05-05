Page({
  data: {
    dingdanliebiao: [],
    jinxingzhong: [],
    jintianYiWancheng: [],
    lishiYiWancheng: [],
    jintianSongda: 0,
    jintianGongzi: 0,
    jintianSongdaJianshu: 0
  },

  onShow() {
    const gerenziliao = wx.getStorageSync("gerenziliao");
    if (!gerenziliao || gerenziliao.shenfen !== "peisongyuan") {
      wx.reLaunch({ url: "/pages/denglu/denglu" });
      return;
    }
    wx.setStorageSync("zuijinYemian", "/pages/peisong/peisong");
    this.shuaxin();
  },

  shuaxin() {
    const gerenziliao = wx.getStorageSync("gerenziliao") || {};
    const peisongyuanBiaoshi = gerenziliao.shouji;
    const dingdanliebiao = wx.getStorageSync("dingdanliebiao") || [];
    const jintian = this.jinriRiqi();
    const jintianSongdaDingdan = dingdanliebiao.filter(
      (item) =>
        item.shijian.startsWith(jintian) &&
        item.zhuangtai === "已送达" &&
        item.peisongyuanBiaoshi === peisongyuanBiaoshi
    );
    const jintianSongda = jintianSongdaDingdan.length;
    const jintianSongdaJianshu = this.suanJianshu(jintianSongdaDingdan);
    const jintianGongzi = Number((jintianSongdaJianshu * 0.3).toFixed(2));
    const jinxingzhong = dingdanliebiao.filter((item) => {
      if (item.zhuangtai === "待配送") return true;
      return item.peisongyuanBiaoshi === peisongyuanBiaoshi && item.zhuangtai !== "已送达";
    });
    const yiwancheng = dingdanliebiao.filter(
      (item) => item.zhuangtai === "已送达" && item.peisongyuanBiaoshi === peisongyuanBiaoshi
    );
    const jintianYiWancheng = yiwancheng.filter((item) => item.shijian.startsWith(jintian));
    const lishiYiWancheng = yiwancheng.filter((item) => !item.shijian.startsWith(jintian));
    this.setData({
      dingdanliebiao,
      jintianSongda,
      jintianSongdaJianshu,
      jintianGongzi,
      jinxingzhong,
      jintianYiWancheng,
      lishiYiWancheng
    });
  },

  gaiZhuangtai(e) {
    const gerenziliao = wx.getStorageSync("gerenziliao") || {};
    const peisongyuanBiaoshi = gerenziliao.shouji;
    const peisongyuanXingming = gerenziliao.xingming;
    const id = e.currentTarget.dataset.id;
    const mubiao = e.currentTarget.dataset.zhuangtai;
    const dingdanliebiao = wx.getStorageSync("dingdanliebiao") || [];
    const idx = dingdanliebiao.findIndex((item) => item.id === id);
    if (idx === -1) return;
    const dangqian = dingdanliebiao[idx];
    if (mubiao === "配送中") {
      if (dangqian.zhuangtai !== "待配送") {
        wx.showToast({ title: "该订单已被其他配送员接单", icon: "none" });
        this.shuaxin();
        return;
      }
      dingdanliebiao[idx].peisongyuanBiaoshi = peisongyuanBiaoshi;
      dingdanliebiao[idx].peisongyuanXingming = peisongyuanXingming;
    } else if (dangqian.peisongyuanBiaoshi !== peisongyuanBiaoshi) {
      wx.showToast({ title: "只能操作自己接的订单", icon: "none" });
      this.shuaxin();
      return;
    }
    dingdanliebiao[idx].zhuangtai = mubiao;
    wx.setStorageSync("dingdanliebiao", dingdanliebiao);
    this.shuaxin();
    wx.showToast({ title: "状态已更新", icon: "success" });
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
  }
});
