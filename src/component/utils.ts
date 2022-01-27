
export const selectionIsEmpty = (selection: any) => {
  return selection.anchorOffset === selection.focusOffset
}

// *************************sortByStart version*************************
export const splitWithOffsets = (text: string, offsets: { start: number; end: number; mark?: boolean, content?: string; children?: any }[], useEdge: boolean = false, tagStyle: any = null) => {
  const splits: any = []
  let lastEnd: number = 0
  let lastStart: number = -1

  // 标签排序并生成无嵌套的split
  let unNestededSplits = sortByStart(offsets)

  // 首次渲染（无标签）
  if (unNestededSplits.length === 0) {
    unNestededSplits.push({
      start: 0,
      end: text.length,
      content: text.slice(0, text.length)
    })
    return unNestededSplits
  }


  // 生成嵌套结构的split
  unNestededSplits.forEach((split: any, idx: number) => {
    if (!split.mark || split.mark === false) {      // 非标签直接进
      splits.push({
        id: idx,
        ...split
      })
    } else {
      const { start, end } = split

      if (start >= lastEnd) {       // 非嵌套
        splits.push({
          id: idx,
          ...split,
          content: text.slice(start, end)
        })
        lastEnd = end
        lastStart = start

      } else {        // 嵌套
        // 1. 把所有能套住当前标签的标签放进一个数组
        // 2. 找到能套住当前标签的最小标签
        // 3. 如果存在多个长度相同的能套住当前标签的最小标签，则选取最后一个
        // 4. 将当前标签放入上一步找到的标签的children里
        const nestedTmp = getAllSplits(splits, start, end)        // 1.

        let shortestItemAddr            // 记录的是一个地址
        let shortestItemLen = Infinity
        for (let i = 0; i < nestedTmp.length; i++) {        // 2.
          if ((nestedTmp[i].end - nestedTmp[i].start) <= shortestItemLen) {       // 3.
            shortestItemAddr = nestedTmp[i]
            shortestItemLen = nestedTmp[i].end - nestedTmp[i].start
          }
        }

        if (shortestItemAddr) {         // 4.
          if (!shortestItemAddr.children) shortestItemAddr.children = []
          shortestItemAddr.children.push({         // 处理单个标签
            id: shortestItemAddr.children.length,
            useEdge: useEdge,
            ...split,
            content: text.slice(start, end),
            tagStyle: tagStyle
          })
        }
      }
    }
  })

  // console.log('splits', splits)
  return splits
}


const sortByStart = (offsets: { start: number; end: number; mark?: boolean; content?: string; children?: any }[]) => {
  return offsets.sort((a, b) => a.start - b.start)
}

// 返回一个能套住当前跨度的所有标签的数组
const getAllSplits = (arr: any, start: number, end: number) => {
  let res: any = []
  recursion(arr)
  return res

  function recursion(subArr: any) {
    for (let item of subArr) {
      if (item.start <= start && item.end >= end) res.push(item)
      if (item.children) recursion(item.children)
    }
  }
}

/**
 * 拆分splits
 * 用于
 *    - 加入一个标签时，分割成多个split
 */
export const makeSplits: any = (
  text: string,
  unNestededSplits: { start: number; end: number; mark?: boolean; content?: string; children?: any }[],
  span: { start: number; end: number; mark?: boolean; content?: string; children?: any }
) => {

  // 首次渲染（无标签）
  if (unNestededSplits.length === 0) {
    unNestededSplits.push({
      start: 0,
      end: text.length,
      content: text.slice(0, text.length)
    })
    return unNestededSplits
  }

  const spanStart = span.start
  const spanEnd = span.end

  let BreakException = {};

  try {
    unNestededSplits.forEach((item, idx) => {
      if (!item.mark && item.start <= spanStart && item.end >= spanEnd) {
        item.start !== spanStart && unNestededSplits.push({
          ...item,
          start: item.start,
          end: spanStart,
          content: text.slice(item.start, spanStart)
        })
        unNestededSplits.push(span)
        spanEnd !== item.end && unNestededSplits.push({
          ...item,
          start: spanEnd,
          end: item.end,
          content: text.slice(spanEnd, item.end)
        })
        unNestededSplits.splice(idx, 1)
        throw BreakException
      }
    })
  } catch (e) {
    if (e !== BreakException) throw e
    else return unNestededSplits
  }

  unNestededSplits.push(span)
  // console.log('unNestededSplits', unNestededSplits);

  return unNestededSplits
}

/**
 * 拆分普通文本
 * 用于：
 *    - splitWithOffsets的后处理，根据标签切断普通文本
 */
export const splitText: any = (text: string, splits: { id: string; start: number; end: number; mark?: boolean; content?: string; children?: any; tag?: string }[]) => {
  splits = splitWithOffsets(text, splits)
  // console.log('before', splits)
  const res: any = []
  let lastStart = 0, lastEnd = 0
  splits.forEach((item) => {

    if (res.length === 0 || item.start === lastEnd) {
      res.push(item)
    } else {
      if (item.mark) {
        const split = res.pop()
        res.push({
          start: split.start,
          end: item.start,
          content: text.slice(split.start, item.start)
        })
        res.push(item)
        item.end - split.end !== 0 && res.push({
          start: item.end,
          end: split.end,
          content: text.slice(item.end, split.end)
        })
      } else {
        res.push(item)
      }
    }
    lastStart = item.start
    lastEnd = item.end
  })
  // console.log('after', res)
  return res
}


/**
 * 合并splits
 * 用于
 *    - 删除一个标签时，将 前、后、当前 3个split合并成一个split
 */
export const mergeSplits: any = (text: string, splits: { id: string; start: number; end: number; mark?: boolean; content?: string; children?: any; tag?: string }[]) => {
  // console.log('receive splits', splits)
  const res: any = []
  let needSplitAgain = false    // 如果是最外层标签被删了，直接变成一个普通文本，拼接完后再进入makeSplits
  splits.forEach((item) => {
    if (item.start === item.end) return     // 去掉''
    if (item.mark) {    // 是标签直接进（标签不需要合并）
      // if (item.mark || res.length === 0) {    // 是标签直接进（标签不需要合并）
      res.push(item)
      return
    }
    /**
     * 如果曾经是个标签:
     *    - 这个标签是最外层标签（嵌套了部分标签，且没有被其他标签套住）, 例如：0(1(2)3(4))56789里面的(1(2)3(4))
     *        - 变成一个普通文本的split，交给后续splitWithOffsets处理
     *    - 这个标签不是最外层标签
     *        - 直接删
     */

    if (item.tag && item.mark === false) {
      for (let split of splits) {
        if (split.mark && split.start <= item.start && split.end >= item.end) {
          return
        }
      }
      needSplitAgain = true
    }
    /**
     * 曾经不是标签
     *    - 可以被合并到res
     *        - 合并
     *    - 不可以被合并到res
     *        - res.push()
     */
    let isMerged = false     // 记录当前标签是否被合并进res了
    res.forEach((split: any, idx: number) => {
      if (!split.mark && split.end === item.start) {
        res[idx].end = item.end
        res[idx].content += item.content
        isMerged = true
      }
      else if (!split.mark && split.start === item.end) {
        res[idx].start = item.start
        res[idx].content = item.content + res[idx].content
        isMerged = true
      }
    })
    if (!isMerged) res.push({
      start: item.start,
      end: item.end,
      content: item.content
    })
  })

  if (needSplitAgain) {   // 最外层的标签被删了
    return splitText(text, res)
  }
  // console.log('return res', res)
  return res
}

/**
 * 第一次获取完起始位置后，后面的标签要加上偏移量
 * 偏移量的计算方法：
 *    - 如果当前节点有左兄弟，offset就是左兄弟的start-end
 *        - previousElementSibling or previousSibling ?
 *    - 如果当前节点没有左兄弟，offset就是正在标的节点的父节点的data-start
 */
export const calcOffset: any = (node: HTMLUnknownElement) => {
  if (node.previousElementSibling) {
    return parseInt(node.previousElementSibling.getAttribute('data-end') as string, 10)
  } else {
    return parseInt(node.parentElement!.getAttribute('data-start') || '0', 10)
  }
}