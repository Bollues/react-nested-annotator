import Mark from './Mark';
import { TextAnnotatorProps, Span, TextSpan } from './interfaces';
import { selectionIsEmpty, splitWithOffsets, makeSplits, mergeSplits, calcOffset } from './utils';
import { nanoid } from 'nanoid';

const Spilt = (props: any) => {
  const {start, end, mark, content} = props

  if (mark) return <Mark {...props} />

  return (
    <span
      data-start={start}
      data-end={end}
      // onContextMenu={onContextMenu}
    >
      {content}
    </span>
  )
}

const TextAnnotator = <T extends Span >(props: TextAnnotatorProps<T>) => {
  const {content, value, style} = props

  const getSpan = (span: TextSpan): T => {
    if (props.getSpan) return props.getSpan(span)
    return {start: span.start, end: span.end, mark: false} as T
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
    // console.log('selection.anchorNode.parentElement', selection.anchorNode.parentElement)
    

    const selectTextLen: number = selection.toString().length

    let start = offset + selection.anchorOffset 
    let end = offset + selection.focusOffset         // 已经是左闭右开了，不要end + 1!

    if (Math.abs(end - start) !== selectTextLen) {      // 标注时侵入标签了
      window.getSelection()?.empty()
      return
    }
    // console.log('start, end, offset, selectTextLen', start, end, offset, selectTextLen)

    try {
      if (start < end) {        // 从前往后标
        const newValue = makeSplits(content, value, getSpan({id: nanoid(), start, end, mark: true, content: content.slice(start, end)}))    // 拆分成独立的split，方便后续加入嵌套
        props.onChange(newValue)
      } else {     // 从后往前标
        const newValue = makeSplits(content, value, getSpan({id: nanoid(), start: end, end: start, mark: true, content: content.slice(end, start)}))    // 拆分成独立的split，方便后续加入嵌套
        props.onChange(newValue)
      }
    } catch (error) {
      console.log(error)
    }

    window.getSelection()?.empty()
  }

  const handleMarkRightClick = (e: any) => {
    // const start: number = parseInt(e.target.getAttribute('data-start'), 10)
    // const end: number = parseInt(e.target.getAttribute('data-end'), 10)
    const tag: string = e.target.nodeName
    const id: string = e.target.getAttribute('data-id')
    e.preventDefault()
    e.stopPropagation()
    if (tag === 'MARK') {
      // console.log('value', value)
      // console.log('start, end', start, end)
      // console.log('id', id)
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