/* eslint-disable @typescript-eslint/no-explicit-any */
import Qs from 'qs'
import NP from 'number-precision'
import dayjs from 'dayjs'

// 公用方法写这里
// 获取url参数 @hashCheck 是否从hash中取值
export const getQueryString = (name: string, hashCheck?: boolean) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let str = window.location?.search || ''
  if (hashCheck) {
    const index = window.location.hash.indexOf('?')
    str = index === -1 ? '' : window.location.hash?.substr(index)
  }
  const r = str.substr(1).match(reg)
  if (r != null) return decodeURIComponent(r[2])
  return null
}

/**
 * @description: 获取url全部参数
 * @param {*} url 完整的url链接
 * @param {*} hashCheck 是否从hash中取值
 * @return {*}
 */
export const getQueryAll = (url = location.href, hashCheck?: boolean) => {
  let query = ''
  const queryIndex = url.indexOf('?')
  const hashIndex = url.indexOf('#')
  const hash = hashIndex === -1 ? '' : url.substr(hashIndex)
  if (hashCheck) {
    const index = hash.indexOf('?')
    query = queryIndex === -1 ? '' : hash.substr(index + 1)
  } else {
    query = url.substring(queryIndex + 1, hashIndex)
  }
  const search = /([^&=]+)=?([^&]*)/g
  const decode = function (s: string) {
    return decodeURIComponent(s.replace(/\+/g, ' '))
  }
  const urlParams: any = {}
  let match
  while ((match = search.exec(query))) {
    urlParams[decode(match[1])] = decode(match[2])
  }
  return urlParams
}

/**
 * @description: 获取hash模式路由path
 * @param {string} url 页面完整链接
 * @return {string} route path
 */
export const getRoutePath = (url = location.href) => {
  const hashIndex = url.indexOf('#')
  let queryIndex = url.indexOf('?')
  if (queryIndex === -1) {
    queryIndex = url.length
  }
  return url.substring(hashIndex + 1, queryIndex)
}

// 返回字典中value对应的label值
export const getLabel = (list: any[], value: any, valueName = 'value', labelName = 'label') => {
  const result = list.filter((item: any) => {
    return item[valueName] === value
  })[0]
  return result ? result[labelName] : ''
}

// 返会数组中指定属性的值的集合
export const getArrValues = (list = [], labelName = 'label') => {
  return list.map((val) => val[labelName])
}

// 将数组转换成指定属性的对象
export const arrToMap = (arr: any, label: any) => {
  const mapTemp: any = {}
  arr.forEach((val: any) => {
    mapTemp[val[label]] = val
  })
  return mapTemp
}

export const copyContent = (inputId: any) => {
  const input = document.querySelector(inputId)
  if (!input) return
  input?.focus()
  input?.select()
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    const range = document.createRange()
    range.selectNodeContents(input)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
  }
  input?.setSelectionRange(0, 9999) // 给一个较大的数字确保完全覆盖input的内容
  const copyStatus = document.execCommand('copy')
  input?.blur()
  return copyStatus
}

export const safeGet = (data: { [index: string]: any }, path: string) => {
  const pathArr = path.split('.')
  let result = data
  for (let i = 0; i < pathArr.length; i++) {
    if (!result || result[pathArr[i]] === undefined) {
      return undefined
    }
    result = result[pathArr[i]]
  }
  return result
}

// 判断为空
export const isEmpty = (val: any) => {
  return [null, undefined, ''].includes(val)
}

// 金额元转分
export const yuanToFen = (money: any) => {
  if (!money) {
    return money
  }

  return NP.strip(NP.times(money, 100))
}

// 金额分转元(默认保留两位小数)
export const fenToYuan = (money: any, float = 2) => {
  if (!money) {
    return money
  }

  return NP.round(NP.strip(NP.divide(money, 100)), float)
}

// 金额元转0.1分
export const yuanToSfen = (money: any) => {
  if (!money) {
    return money
  }

  return NP.strip(NP.times(money, 1000))
}

// 金额0.1分转元
export const sfenToYuan = (money: any, float = 3) => {
  if (!money) {
    return money
  }

  return NP.round(NP.strip(NP.divide(money, 1000)), float)
}

// 通过api下载文件
export const exportApiFile = (url: string, params: any) => {
  let link = `${url}?${Qs.stringify(params)}`
  link = `${link}${params ? '&' : ''}_t=${new Date().getTime()}`
  // eslint-disable-next-line no-console
  console.log('下载链接：', link)
  window.open(link)
}

export const addImgPrefix = (url: any, prefix: any, replace = '/source') => {
  if (!url) {
    return ''
  }
  if (url.indexOf('://') !== -1) {
    return url
  }
  return `${prefix}${url.replace(replace, '')}&_t=${new Date().getTime()}`
}

export const addBase64Head = (url: any, head = 'data:image/jpg;base64,') => {
  if (!url) {
    return ''
  }
  return `${head}${url}`
}

// 多个一维数组取交集
export const intersectArrs = (list1: any, ...arrs: any) => {
  if (!list1) {
    return []
  }
  if (!arrs || !arrs.length) {
    return [...new Set(list1)]
  }
  return [
    ...new Set(
      list1.filter((item: any) => {
        return arrs.every((arr: any) => arr.indexOf(item) !== -1)
      }),
    ),
  ]
}

// 找出新旧数组之间的差集
export const compareArr = (oldArr = [], newArr = []) => {
  const result = {
    delete: [], // 删除的
    add: [], // 新增的
    retain: [], // 两边都有的
  }
  // 两边转字符串后值相等 则表示没变化
  if (oldArr.join() === newArr.join()) {
    result.retain = [...newArr]
    return result
  }
  const newSet = new Set(newArr)
  oldArr.forEach((key) => {
    // 存在则是两边都有的，否则是删掉的
    if (newSet.has(key)) {
      result.retain.push(key)
      newSet.delete(key) // 删除已有的
    } else {
      result.delete.push(key)
    }
  })
  result.add = [...newSet] // 删除了已有的，剩下的都是新增的
  return result
}

// 简单的时间截取 系统中多处仅需要展示年月日
export const timeDateCut = (timeStr: any) => {
  if (!timeStr || typeof timeStr !== 'string') {
    return ''
  }
  return timeStr.substr(0, 10)
}

// 吐出一个不存在于 compareStr 中的标识字符串
export const pickTagStr = (compareStr: any) => {
  let tag = '@rr_'
  let index = 0
  while (compareStr.indexOf(tag) !== -1) {
    tag += index++
  }
  return tag
}
// 能否被JSON.parse，可能是字符串 不一定是JSON
export const canJsonParse = (str: any) => {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}
// 处理文本中超长的数字变量，通过正则将其转为字符串
export const changeLongToString = (str: any) => {
  const tag = pickTagStr(str)
  return str
    .replace(/:\d{17,}/g, (item: any) => `:"${tag}_r_${item.substr(1)}"`)
    .replace(new RegExp(`${tag}_r_\\s`, 'g'), '')
    .replace(new RegExp(`${tag}_r_`, 'g'), '')
}
// 解析接口响应返回的text类型的response
export const parseResponse = (str: any) => {
  if (!str || typeof str !== 'string') {
    return str
  }
  try {
    // 先用最简单的方式处理(异常情况：用户输入字段(如：备注等)匹配到替换规则，导致JSON错位，需特殊处理)
    const response = JSON.parse(changeLongToString(str))
    return response
  } catch (e) {
    const reg = /:\d{17,}/
    const tag = pickTagStr(str)
    // 直接对整个str遍历，逐个处理超长的数据类型
    while (reg.test(str)) {
      const strBack = str
      str = str.replace(reg, (item: any) => `:"${tag}_r_${item.substr(1)}"`) // 需转换 _r_ 占位并添加""
      // 变化后解析失败，判定为无需转换的内容。回退并添加无需转换标识
      if (!canJsonParse(str)) {
        str = strBack.replace(reg, (item: any) => `:${tag}_n_${item.substr(1)}`) // 不需要转换 _n_ 占位
      }
    }
    const result = str
      .replace(new RegExp(`${tag}_r_\\s`, 'g'), '')
      .replace(new RegExp(`${tag}_r_`, 'g'), '')
      .replace(new RegExp(`${tag}_n_\\s`, 'g'), '')
      .replace(new RegExp(`${tag}_n_`, 'g'), '')

    // 仍有错就抛出去吧，方便排查
    return JSON.parse(result)
  }
}
/**
 * 去除js对象中的空值（undefined，null），以及空对象
 * @param {Objece} ob
 * @returns
 */
export function delUndefined(ob: any = {}) {
  for (const e in ob) {
    if (typeof ob[e] === 'undefined' || ob[e] === null) {
      delete ob[e]
    } else if (ob[e].constructor === Object) {
      if (Object.keys(ob[e]).length === 0) {
        delete ob[e]
      } else {
        delUndefined(ob[e])
      }
    } else if (ob[e].constructor === Array) {
      ob[e].map(function (seg: any) {
        if (typeof seg === 'object') {
          delUndefined(seg)
        }
      })
    }
  }
  return ob
}

/**
 * @description: 封装异步表单校验 注意是异步的
 * @param {form} form 表单实例
 * @return {Boolean} 校验结果
 */
export const formValidate = async (form: any) => {
  const formCheck = new Promise((resolve) => {
    form.validate((valid: any) => {
      resolve(valid)
    })
  })
  return await formCheck.then((data) => data).catch((data) => data)
}

// 下载
export const downloadFile = (url: string, name = 'undefined') => {
  const aLink = document.createElement('a')
  aLink.download = name
  aLink.href = url
  aLink.dispatchEvent(new MouseEvent('click'))
}

// Blob文件下载
export function downLoadBlob(url: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Promise((resolve: (blob: any) => void) => {
    const xhr = new XMLHttpRequest()
    // url oss地址
    xhr.open('get', url, true)
    // 响应方式
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (this.status == 200 && this.readyState === 4) {
        const blob = this.response
        resolve({ code: 200, blob })
      } else {
        resolve({ code: 500, msg: this.response.msg || '下载失败' })
      }
    }
    xhr.send() // 发送请求
    xhr.onerror = function () {
      resolve({ code: 500, msg: this.response.msg || '下载失败' })
    }
  })
}

/**
 * @description: 通过code获取状态列表的desc(描述文案)
 * @param {string|number} targetCode
 * @param {{code:number,desc:string}[]} list 接口返回的下拉 数组格式如{code:1,desc:'哈哈'}
 * @return {string}
 */
export const getDescByCode = (targetCode: any, list = []) => {
  let desc = ''
  const matchItem: any = list.find((item: any) => item.code === Number(targetCode))
  if (matchItem) {
    desc = matchItem.desc
  }
  return desc
}

export const timeFormat = (day: any) => new Date(day).getTime()
/**
 * 时间格式化并返回对象结构
 * @param {*} time 时间格式数组 ['2021-09-25', '2021-09-25']
 * @param {*} name 需要赋值的key ['startTime', 'endTime']
 * @returns 格式化后的对象 { startTime: 1632499200000, endTime: 1632585599000 }
 */
export const getTime = (time = [], name = []) => ({
  [name[0]]: time[0] ? timeFormat(`${time[0]} 00:00:00`) : undefined,
  [name[1]]: time[1] ? timeFormat(`${time[1]} 23:59:59`) : undefined,
})

// 解决ts解析key值报错
export function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
  return key in object
}

// 常用正则验证
export const regCommon = {
  email: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/, // 邮箱
  phone: /^1{1}[0-9]{10}$/, // 手机号码
  tel: /^\d{7,12}$/, // 电话号码
  floatTwo: /^[0-9]+(.[0-9]{1,2})?$/, // 两位小数
  float: /^(-?\d+)(\.\d+)?$/, // 浮点数
  specialLimit1: /[^a-zA-Z0-9_\-，,、/（）()\u4e00-\u9fff]/, // 中英文数字大小写字母及指定字母（限制输入特殊字符）
  specialLimit2: /[^a-zA-Z0-9_\-，,、/（）()#&\u4e00-\u9fff]/, // 中英文数字大小写字母及指定字母（限制输入特殊字符）
  idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, // 省份证
}

/**
 * 动态添加js
 * */
export const dynamicLoad = (src: string, call: Function) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onerror = reject
    script.src = src
    document.body.appendChild(script)
    script.onload = function () {
      call && call(resolve)
    }
  })
}

/**
 * 判断时间是否有效
 * @param date any
 * @returns boolean
 */
export function isValidDate(date: any): boolean {
  return !isNaN(dayjs(date).valueOf())
}

// 自定义排序
export const customSort = (data: any, sortBy: any, sortField: any) => {
  const sortByObject = sortBy.reduce(
    (obj: any, item: any, index: any) => ({
      ...obj,
      [item]: index,
    }),
    {},
  )
  return data.sort((a: any, b: any) => sortByObject[a[sortField]] - sortByObject[b[sortField]])
}

/**
 * 判断是否 url
 * */
export function isUrl(url: string) {
  return /^(http|https):\/\//g.test(url)
}
// 生成uuid
export function uuid() {
  const s: string[] = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    const ri = Math.floor(Math.random() * 0x10)
    s[i] = hexDigits.substring(ri, ri + 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  // @ts-ignore
  const rn = (s[19] & 0x3) | 0x8
  s[19] = hexDigits.substring(rn, rn + 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  const uuid = s.join('')
  return uuid
}

/**
 * @description 查找包含自身节点的父代节点
 * @param tree 需要查找的树数据
 * @param curKey 当前节点key
 * @param keyField 自定义 key 字段
 * @param node 找到的node 可以不传
 */
export function findCurNode(tree: any, curKey: any, keyField: string, node = null) {
  tree.forEach((item: any) => {
    if (item[keyField] === curKey) {
      node = item
    }
    if (item.children && item.children.length) {
      const findChildren = findCurNode(item.children, curKey, keyField, node)
      if (findChildren) {
        node = findChildren
      }
    }
  })
  return node
}
