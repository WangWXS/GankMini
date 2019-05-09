// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoList: [],
    homeList: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    try {
      let time = wx.getStorageSync('time')
      let photo = wx.getStorageSync('photoList')
      let home = wx.getStorageSync('homeList')
      // 如果有数据缓存，24小时内不再重新请求
      if (photo && this.getCurrentTime() - time < 60 * 60 * 24) {
        let photoList = this.data.photoList;
        photoList = JSON.parse(photo)
        this.setData({
          photoList
        })
      } else {
        this.getPhoto()
      }
   
      if (home && this.getCurrentTime() - time < 60 * 60 * 24) {
        let homeList = this.data.homeList;
        homeList = JSON.parse(home)
        this.setData({
          homeList
        })
      } else {
        this.getHome()
      }
    } catch (e) {
      console.log(e)
      this.getPhoto()
      this.getHome()
    }
  },

  getPhoto() {
    let that = this
    wx.request({
      url: `https://gank.io/api/data/福利/4/1`,
      success(res) {
        let result = res.data.results
        for (let i = 0; i < result.length; i++) {
          result[i] = result[i].url
        }
        let photoList = that.data.photoList;
        photoList = result
        that.setData({
          photoList
        })
        try {
          wx.setStorageSync('photoList', JSON.stringify(photoList))
          wx.setStorageSync('time', that.getCurrentTime())
        } catch (e) {
          console.log(e)
        }
      }
    })
  },

  getHome() {
    console.log("getHome")
    let that = this
    wx.request({
      url: `https://gank.io/api/today`,
      success(res) {
        let result = res.data.results
        let category = res.data.category
        let homeList = that.data.homeList;
        for (let i = 0; i < category.length; i++) {
          let a = result[category[i]]
          homeList[i] = a[a.length - 1]
          homeList[i].publishedAt = homeList[i].publishedAt.substring(0, 10)
          homeList[i].who = homeList[i].who + " · " + homeList[i].type
        }
        that.setData({
          homeList
        })
        try {
          wx.setStorageSync('homeList', JSON.stringify(homeList))
          wx.setStorageSync('time', that.getCurrentTime())
        } catch (e) {
          console.log(e)
        }
      }
    })
  },

  previewImg(event) {
    let target = event.currentTarget
    let current = target.dataset.current
    let urls = this.data.photoList
    wx.previewImage({
      current: current,
      urls: urls
    })
  },

  getCurrentTime() {
    return Math.floor(((new Date()).getTime()) / 1000)
  }
})