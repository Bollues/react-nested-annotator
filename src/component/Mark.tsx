import { NestedMarkProps } from './interfaces';
import { nanoid } from 'nanoid';

const renderTag = (tag: any, tagStyle: any) => {
  return (
    tag && <span
      className='mark-tag'
      style={Object.assign({
        fontSize: '0.7em',
        fontWeight: 500,
        marginLeft: '6px',
        color: '#fff',
        cursor: 'default'
      }, tagStyle)}
    >{tag}</span>
  )
}

const generateMarkArray = ({id, children, start, content, whichEdgeIsActive}: NestedMarkProps) => {
  let res: any = []
  let tmpStart: number = 0
  let tmpEnd: number = 0
  if (children) {
    children.forEach(item => {
      if (tmpStart < item.start - start) {        // 防止加入''的情况
        res.push({
          id,
          start,
          content: content.slice(tmpStart, item.start - start),
        })
      }
      item['whichEdgeIsActive'] = whichEdgeIsActive
      res.push(item)
      tmpStart = item.end - start
      tmpEnd = item.end
    })
    if (tmpStart !== content.length) {
      res.push({
        id,
        start: tmpEnd,
        content: content.slice(tmpStart, content.length),
      })
    }
  } else {
    if (tmpStart !== content.length) {
      res.push({
        id,
        start,
        content: content.slice(tmpStart, content.length),
      })
    }
  }
  return res
}

const generateContentWithEdge: any = ({content, id, start}: any, whichEdgeIsActive: number) => {
  return (
    <div key={nanoid()} style={{ display: 'inline-block' }}>
      {
        content.split('').map((letter: string, i: number) => {
          const index: number = start + i
          return (
            <div className={whichEdgeIsActive === index ? 'edge active' : 'edge'} key={nanoid()} data-index={index}>
              <span className="edge-border" data-index={index} data-id={id} />
              <span className="edge-text" data-index={index} data-id={id} >{letter}</span>
            </div>
          )
        })
      }
    </div>
  )
}

const Mark = (props: NestedMarkProps) => {
  let { id, start, end, color, tag, onContextMenu } = props
  const useEdge = props.useEdge ? true : false
  const tagStyle = props.tagStyle ? props.tagStyle : null

  let markArr: any = generateMarkArray(props)

  return (
    <mark
      className="react-nested-annotator-mark"
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
        useEdge ?
          markArr.map((item: any) => item.mark ? Mark(item) : generateContentWithEdge(item, props.whichEdgeIsActive)) :
          markArr.map((item: any) => item.mark ? Mark(item) : item.content)
      }
      {renderTag(tag, tagStyle)}
    </mark>
  )

}

export default Mark