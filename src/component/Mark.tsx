import { NestedMarkProps, MarkProps } from './interfaces';
import { nanoid } from 'nanoid';

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

// const generateMarkArr: any = (children: MarkProps[], start: number, content: string) => {
//   let res: any = []
//   let tmpStart = 0
//   children && children.forEach(item => {
//     if (tmpStart < item.start - start) {        // 防止加入''的情况
//       res.push(content.slice(tmpStart, item.start - start))
//     }
//     res.push(item)
//     tmpStart = item.end - start
//   })
//   if (tmpStart !== content.length) {
//     res.push(content.slice(tmpStart, content.length))
//   }
//   return res
// }

const generateContentWithEdge: any = (content: string, id: string, start: string, whichEdgeIsActive: string) => {
  return (
    <div key={nanoid()} style={{ display: 'inline-block' }}>
      {
        content.split('').map((letter: string, i: number) => {
          const index: string = Number(start) + i + ''
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
  let { id, start, end, color, content, tag, onContextMenu, children } = props
  // console.log('props', props);
  const useEdge = props.useEdge ? true : false

  let res: any = []
  let tmpStart = 0
  children && children.forEach(item => {
    if (tmpStart < item.start - start) {        // 防止加入''的情况
      res.push(content.slice(tmpStart, item.start - start))
    }
    res.push(item)
    tmpStart = item.end - start
  })
  if (tmpStart !== content.length) {
    res.push(content.slice(tmpStart, content.length))
  }

  // console.log('res', res);

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
        useEdge ?
          res.map((item: any) => item.mark ? Mark(item) : generateContentWithEdge(item, id, start, props.whichEdgeIsActive)) :
          res.map((item: any) => item.mark ? Mark(item) : item)
      }
      {renderTag(tag)}
    </mark>
  )

}

export default Mark