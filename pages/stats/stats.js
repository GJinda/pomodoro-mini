Page({
  data: {
    finishTaskList: [],
    days: [],
    dayTaskList: [],
    total: 0,
    todayTotal: 0
  },
  onShow() {
    this.setData({
      finishTaskList: [],
      days: [],
      dayTaskList: [],
    })
    wx.getStorage({
      key: 'finishTask',
      success: (res) => {
        console.log(JSON.parse(res.data))
        let finishTaskList = JSON.parse(res.data).reverse()
        this.setData({
          finishTaskList: finishTaskList
        })
        //set days
        for (let i in finishTaskList) {
          let dayObj = {
            year: finishTaskList[i].finishTime.year,
            month: finishTaskList[i].finishTime.month,
            day: finishTaskList[i].finishTime.day,
          }
          if (this.containDay(dayObj)) {
            continue;
          } else {
            let dayArr = [dayObj]
            this.setData({
              days: this.data.days.concat(dayArr)
            })
          }
        }
        //set dayTaskList
        let days = this.data.days
        for (let i in days) {
          let dayTaskItem = {
            day: days[i],
            tasks: []
          }
          for (let j in finishTaskList) {
            let dayObj = {
              year: finishTaskList[j].finishTime.year,
              month: finishTaskList[j].finishTime.month,
              day: finishTaskList[j].finishTime.day,
            }
            if (days[i].year == dayObj.year && days[i].month == dayObj.month && days[i].day == dayObj.day) {
              let taskArr = [finishTaskList[j]]
              dayTaskItem.tasks = dayTaskItem.tasks.concat(taskArr)
            }
          }
          let dayTaskArr = [dayTaskItem]
          this.setData({
            dayTaskList: this.data.dayTaskList.concat(dayTaskArr)
          })
        }
        console.log(this.data.days)
        console.log(this.data.dayTaskList)
        //set total
        this.setData({
          total: this.data.finishTaskList.length
        })
        //set todayTotal
        let dayTaskList = this.data.dayTaskList
        for (let i in dayTaskList) {
          if (this.isToday(dayTaskList[i].day)) {
            this.setData({
              todayTotal: dayTaskList[i].tasks.length
            })
          }
        }
      },
      fail: (res) => {
        console.log(res.errMsg)
      }
    })
  },
  containDay(dayObj) {
    let days = this.data.days;
    for (let i in days) {
      if (days[i].year == dayObj.year && days[i].month == dayObj.month && days[i].day == dayObj.day) {
        return true
      }
    }
    return false
  },
  isToday(dayObj) {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (dayObj.year == year && dayObj.month == month && dayObj.day == day) {
      return true
    } else {
      return false
    }
  }
})