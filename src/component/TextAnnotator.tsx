import { useState, useRef, useEffect } from 'react';
import Mark from './Mark';
import ClickMenu from './ClickMenu';
import { TextAnnotatorProps, Span, TextSpan } from './interfaces';
import { selectionIsEmpty, splitWithOffsets, makeSplits, mergeSplits, calcOffset } from './utils';
import { nanoid } from 'nanoid';
import './index.css';

let start: number = 0, end: number = 0                                // 标注的起始和终止位置

const TextAnnotator = <T extends Span>(props: TextAnnotatorProps<T>) => {
  const { content, value, style, tags } = props

  const [isEdgeStart, setIsEdgeStart] = useState(true)                // 是否正在标注edge的start
  const [clickMenuActive, setClickMenuActive] = useState(false)       // 显示/隐藏 菜单
  const [tag, setTag] = useState('')                                  // 选择的tag
  const [whichEdgeIsActive, setWhichEdgeIsActive] = useState(-1)      // 设置edge常亮
  const measuredRef = useRef<HTMLDivElement>(null);                   // 菜单ref，用来设置top & left & height

  const useEdge = props.useEdge ? true : false
  const tagStyle = props.tagStyle ? props.tagStyle : null

  useEffect(() => {
    if (tag.length > 0) {
      renderTag(start, end)
      setTag('')
      setWhichEdgeIsActive(-1)
    }
  }, [tag])

  const generateContentWithEdge: any = (content: string, start: number) => {
    return content.split('').map((letter: string, i: number) => {
      const index: number = start + i
      return (
        <div className={whichEdgeIsActive === index ? 'edge active' : 'edge'} key={nanoid()} data-index={index}>
          <span className="edge-border" data-index={index} />
          <span className="edge-text" data-index={index} >{letter}</span>
        </div>
      )
    })
  }

  const Spilt = (props: any) => {
    const { mark, content, start, end, id } = props
    let contentSplits = null
    if (useEdge) contentSplits = generateContentWithEdge(content, start, id)

    if (mark) return useEdge ?
      <Mark useEdge={useEdge} whichEdgeIsActive={whichEdgeIsActive} tagStyle={tagStyle} {...props} /> :
      <Mark useEdge={useEdge} tagStyle={tagStyle} {...props} />

    return (
      useEdge ?
        (
          <div style={{ display: 'inline' }}>
            {
              contentSplits.map((item: any) => item)
            }
          </div>
        ) :
        (
          <span
            data-start={start}
            data-end={end}
          >
            {content}
          </span>
        )
    )
  }

  const getSpan = (span: TextSpan): T => {
    if (tag.length === 0) return { start: span.start, end: span.end, mark: false } as T
    return {
      ...span,
      mark: true,
      tag,
      color: (tags as any)[tag]
    } as any
  }

  // 设置menu的位置
  const openMenu = (event: any) => {
    setClickMenuActive(true)
    let target = event.target.parentNode
    while (target.className !== 'react-nested-annotator') {     // 确保相对元素始终是react-nested-annotator，否则后面的menu的位置会变成相对mark的位置
      target = target.parentNode
    }
    const domRect = target.getBoundingClientRect()
    measuredRef.current!.style.top = `${event.clientY - domRect.top}px`    // 鼠标相对元素内top
    measuredRef.current!.style.left = `${event.clientX - domRect.left}px`    // 鼠标相对元素内left
    return
  }

  // 选择的tag
  const transferOption = (whichOptionIsClicked: string) => {
    setTag(whichOptionIsClicked)
  }

  // 划词标注
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

    start = offset + selection.anchorOffset
    end = offset + selection.focusOffset      // 已经是左闭右开了，不要end + 1!

    if (Math.abs(end - start) !== selectTextLen) {      // 标注时侵入标签了
      window.getSelection()?.empty()
      return
    }

    window.onclick = (e: any) => {    // 点击选项，关闭菜单
      if (e.target.className === 'click-menu-list' || e.target.className === 'click-menu-list-item') {
        setClickMenuActive(false)
      }
    }
    openMenu(e)
    window.getSelection()?.empty()
  }

  // edge标注
  const handleEdge = (e: any) => {
    window.getSelection()?.empty()
    if (e.target.className === 'edge-text' || e.target.className === 'edge-border') {
      const index: number = Number(e.target.getAttribute('data-index'))
      if (isEdgeStart) {          // 设置edge起点
        setIsEdgeStart(false)
        start = index
        setWhichEdgeIsActive(index)
        return
      } else {      // 设置edge终点
        end = index
        window.onclick = (e: any) => {    // 点击选项，关闭菜单
          if (e.target.className === 'click-menu-list' || e.target.className === 'click-menu-list-item') {
            setClickMenuActive(false)
          }
        }
        setIsEdgeStart(true)
        openMenu(e)
      }
    } else return

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

  // 右键事件
  const handleMarkRightClick = (e: any) => {
    const tag: string = e.target.nodeName
    const id: string = e.target.getAttribute('data-id')
    e.preventDefault()
    e.stopPropagation()
    if (tag) {
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

  const splits = splitWithOffsets(content, value, useEdge, tagStyle)

  return (
    // 利用事件委托将所有子元素上的右键事件绑定到react-nested-annotator上，优化内存
    <div
      className='react-nested-annotator'
      style={style}
      onClick={(e: any) => useEdge ? handleEdge(e) : handleMouseUp(e)}
      onContextMenu={(e: any) => handleMarkRightClick(e)}>
      <ClickMenu ref={measuredRef} custom={Object.keys(tags)} clickMenuActive={clickMenuActive} transferOption={transferOption} />
      {
        splits.map((item: any, idx: number) => (
          <Spilt
            key={idx}
            {...item}
          />
        ))
      }
      {
        useEdge && (<div className='edge' key={content.length} data-index={content.length}>
          <span className="edge-border" data-index={content.length} />
        </div>)
      }
    </div>
  )
}

export default TextAnnotator