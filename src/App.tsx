import { useState } from 'react';
import { TextAnnotator } from './component';

const TEXT: string = '2021年7月20日16时30分许，梅陇派出所接群众报警称，在徐汇区梅陇路130号门口有人斗殴。民警到达后，发现有两名男子在以唱双簧的形式演戏，经询问，两名男子自称为张三（男，3101234567898765）和李四（男，3100000000000000），两人未涉嫌违法，已对其进行批评教育。'
const argumentsTemplate: any = []
const tags = {
  TIME: "#3ee0b8",
  PER: "#84d2ff",
  PERID: "#808fe6",
  LOC: "#e4b979",
  CONCLUSION: "#96e64b"
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
        value={argument}
        onChange={function (value) {
          setArguments(value);
          return
        }}
        // useEdge={true}
        // tagStyle={{
        //   verticalAlign: 'middle',
        //   backgroundColor: 'white',
        //   color: 'black',
        //   borderRadius: '5px',
        //   fontSize: '0.5rem',
        //   fontWeight: 'bold',
        //   padding: '4px'
        // }}
      />
    </div>

  )
}

export default App