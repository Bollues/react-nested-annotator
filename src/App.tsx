import { useState } from 'react';
import { TextAnnotator } from './component';

const TEXT: string = '0123456789'
const argumentsTemplate: any = {
  value: []
}
const tags = {
  ORG: "#00ffa2",
  PERSON: "#84d2ff"
}

const App = () => {
  const [argument, setArguments] = useState(argumentsTemplate)

  return (
    <div className='container'>
      <TextAnnotator
        style={{
          fontFamily: "IBM Plex Sans",
          lineHeight: 1.5,
          width: '100%',
          fontSize: '2rem'
        }}
        content={TEXT}
        tags={tags}
        value={argument.value}
        onChange={function (value) {
          setArguments({ value });
          return
        }}
        // getSpan={function (span) {
        //   return {
        //     ...span,
        //     mark: true,
        //     tag,
        //     color: (tags as any)[tag]
        //   }
        // }}
      />
    </div>

  )
}

export default App