import { useState, useRef, useEffect } from 'react';
import Mark from './Mark';
import ClickMenu from './ClickMenu';
import { TextAnnotatorProps, Span, TextSpan } from './interfaces';
import { selectionIsEmpty, splitWithOffsets, makeSplits, mergeSplits, calcOffset } from './utils';
import { nanoid } from 'nanoid';

const Spilt = (props: any) => {
  const { start, end, mark, content } = props

  if (mark) return <Mark {...props} />

  return (
    <span
      data-start={start}
      data-end={end}
    >
      {content}
    </span>
  )
}

let start = 0, end = 0

const TextAnnotator = <T extends Span>(props: TextAnnotatorProps<T>) => {
  const { content, value, style, tags } = props

  const [clickMenuActive, setClickMenuActive] = useState(false)   // 显示/隐藏 菜单
  const [tag, setTag] = useState('')    // 选择的tag
  
  // let [start, setStart] = useState(0)
  // let [end, setEnd] = useState(0)
  const measuredRef = useRef<HTMLDivElement>(null);   // 菜单ref，用来设置top & left & height

  useEffect(() => {
    if (tag.length > 0) {
      // console.log(tag, start, end)
      renderTag(start, end)
      setTag('')
    }
  }, [tag])

  // useEffect(() => {
  //   console.log(clickMenuActive);
  // }, [clickMenuActive])

  const getSpan = (span: TextSpan): T => {
    // if (props.getSpan) return props.getSpan(span)
    // return {start: span.start, end: span.end, mark: false} as T
    if (tag.length === 0) return { start: span.start, end: span.end, mark: false } as T
    return {
      ...span,
      mark: true,
      tag,
      color: (tags as any)[tag]
    } as any
  }

  const openMenu = (event: any) => {
    setClickMenuActive(true)
    return
  }

  const transferOption = (whichOptionIsClicked: string) => {
    setTag(whichOptionIsClicked)
    // renderTag(start, end)
    // setTag('')
    // setClickMenuActive(false)
  }

  const handleMouseUp = (e: any) => {
    if (!props.onChange) return

    const selection: any = window.getSelection()

    if (selectionIsEmpty(selection)) return

    if (e.target.className === 'mark-tag') {
      window.getSelection()?.empty()
      return
    }

    // 第一次获取完起始位置后，后面的标签要加上偏移量
    const offset: number = calcOffset(selection.anchorNode)

    const selectTextLen: number = selection.toString().length

    // let start = offset + selection.anchorOffset
    // let end = offset + selection.focusOffset     // 已经是左闭右开了，不要end + 1!

    start = offset + selection.anchorOffset
    end = offset + selection.focusOffset      // 已经是左闭右开了，不要end + 1!

    if (Math.abs(end - start) !== selectTextLen) {      // 标注时侵入标签了
      window.getSelection()?.empty()
      return
    }

    window.onclick = (e: any) => {    // 点击window任意位置，关闭菜单
      // console.log('e', e)
      if (e.target.className === 'click-menu-list' || e.target.className === 'click-menu-list-item') {
        setClickMenuActive(false)
      }
    }

    openMenu(e)
    window.getSelection()?.empty()
    // return new Promise((resolve, reject) => {
    //   // 打开menu
    //   if (!clickMenuActive) {   // 没有打开menu
    //     console.log('打开menu')
    //     openMenu(e)
    //     window.getSelection()?.empty()
    //     resolve(tag)
    //   }
      
    // }).then(() => {
    //   console.log('resolve', tag, start, end)
    // })

    // console.log('timeout', tag, start, end)
    // if (tag.length > 0) {
    //   renderTag(start, end)
    // }

    // if (tag.length > 0) {
    //   console.log('onchange', tag);
    //   try {
    //     if (start < end) {        // 从前往后标
    //       const newValue = makeSplits(content, value, getSpan({id: nanoid(), start, end, mark: true, content: content.slice(start, end)}))    // 拆分成独立的split，方便后续加入嵌套
    //       props.onChange(newValue)
    //     } else {     // 从后往前标
    //       const newValue = makeSplits(content, value, getSpan({id: nanoid(), start: end, end: start, mark: true, content: content.slice(end, start)}))    // 拆分成独立的split，方便后续加入嵌套
    //       props.onChange(newValue)
    //     }
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // window.getSelection()?.empty()
  }

  const renderTag = (start: number, end: number) => {
    try {
      if (start < end) {        // 从前往后标
        const newValue = makeSplits(content, value, getSpan({ id: nanoid(), start, end, mark: true, content: content.slice(start, end) }))    // 拆分成独立的split，方便后续加入嵌套
        props.onChange(newValue)
      } else {     // 从后往前标
        const newValue = makeSplits(content, value, getSpan({ id: nanoid(), start: end, end: start, mark: true, content: content.slice(end, start) }))    // 拆分成独立的split，方便后续加入嵌套
        props.onChange(newValue)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleMarkRightClick = (e: any) => {
    const tag: string = e.target.nodeName
    const id: string = e.target.getAttribute('data-id')
    e.preventDefault()
    e.stopPropagation()
    if (tag === 'MARK') {
      const newValue = value.map((item, idx) => {
        if ((item as any).id && (item as any).id === id) {
          value[idx].mark = false
        }
        return value[idx]
      })
      try {
        props.onChange(mergeSplits(content, newValue))
      } catch (error) {
        console.log(error)
      }
    }
  }

  const splits = splitWithOffsets(content, value)

  return (
    // 利用事件委托将所有子元素上的右键事件绑定到它们的父元素上，优化内存
    <div style={style} onMouseUp={(e: any) => handleMouseUp(e)} onContextMenu={(e: any) => handleMarkRightClick(e)}>
      <ClickMenu ref={measuredRef} custom={Object.keys(tags)} clickMenuActive={clickMenuActive} transferOption={transferOption} />
      {
        splits.map((item: any, idx: number) => (
          <Spilt
            key={idx}
            {...item}
          // onContextMenu={(e: any) => handleMarkRightClick(e, item.start, item.end, item.tag)}
          />
        ))
      }
    </div>
  )
}

export default TextAnnotator