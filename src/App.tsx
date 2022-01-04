import { useState } from 'react';
import { TextAnnotator } from './component';

const TEXT: string = '0123456789'
const TAG_COLORS = {
  ORG: "#00ffa2",
  PERSON: "#84d2ff"
};
const argumentsTemplate: any = {
  value: []
}

const App = () => {
  const [argument, setArguments] = useState(argumentsTemplate)
  const [tag, setTag] = useState('PERSON')

  return (
    <div className='container'>
      <TextAnnotator
        style={{
          fontFamily: "IBM Plex Sans",
          lineHeight: 1.5,
          width: '100%',
        }}
        content={TEXT}
        value={argument.value}
        onChange={function (value) {
          setArguments({ value });
          return
        }}
        getSpan={function (span) {
          return {
            ...span,
            mark: true,
            tag,
            color: (TAG_COLORS as any)[tag]
          }
        }}
      />
    </div>

  )
}

export default App