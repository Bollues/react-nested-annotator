import { forwardRef } from 'react';
import './clickMenu.css'

type ClickMenuProps = {
  custom: string[],
  clickMenuActive: boolean,
  transferOption: any
}

const ClickMenu = forwardRef((props: ClickMenuProps, ref: React.Ref<HTMLDivElement> | null) => {
  const { custom, clickMenuActive, transferOption } = props

  function renderCustom(oneCustomStr: string = "未定义", idx: number) {
    return (
      <li className="click-menu-list-item" key={"custom" + idx} onClick={() => transferOption(oneCustomStr)}>
        {oneCustomStr}
      </li>
    )
  }


  return (
    <div ref={ref} className={`click-menu-container ${clickMenuActive ? 'active' : ''}`}>
      <ul className="click-menu-list">
        {
          custom?.map((oneCustomStr, idx) => renderCustom(oneCustomStr, idx))
        }
      </ul>
    </div>
  )
})

export default ClickMenu