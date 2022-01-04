import { NestedMarkProps } from './interfaces';

const renderTag = (tag: any) => {
  return (
    tag && <span
      className='mark-tag'
      style={{
        fontSize: '0.7em',
        fontWeight: 500,
        marginLeft: '6px',
        color: '#fff',
        cursor: 'default'
      }}
    >{tag}</span>
  )
}

const Mark = (props: NestedMarkProps) => {
  let { id, start, end, color, content, tag, onContextMenu, children } = props
  // console.log('props', props)
  let res: any = []
  let tmpStart = 0
  children?.forEach(item => {
    if (tmpStart < item.start - start) {        // 防止加入''的情况
      res.push(content.slice(tmpStart, item.start - start))
    }
    res.push(item)
    tmpStart = item.end - start
  })
  if (tmpStart !== content.length) {
    res.push(content.slice(tmpStart, content.length))
  }
  return (
    <mark
      key={id}
      style={{
        display: 'inline-block',
        backgroundColor: color || '#84d2ff',
        padding: '2px 4px',
        margin: '2px 6px',
        borderRadius: '6px',
        boxShadow: '0 0px 3px rgba(0, 0, 0, 0.3)'
      }}
      data-id={id}
      data-start={start}
      data-end={end}
      onContextMenu={onContextMenu}
    >
      {
        res.map((item: any) => item.mark ? Mark(item) : item)
      }
      {renderTag(tag)}
    </mark>
  )

}



export default Mark