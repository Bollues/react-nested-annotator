## react-nested-annotator
A React Component for annotating nested text from html.

**Nested** means you can annotate on an annotated text, and select another tag.





### basic usage

```jsx
import { useState } from "react";
import { TextAnnotator } from "react-nested-annotator";

const TEXT = "这是一段话";
const argumentsTemplate = [];
const tags = {
  Tag1: "#3ee0b8",
  Tag2: "#84d2ff",
};

const App = () => {
  const [argument, setArguments] = useState(argumentsTemplate);

  return (
    <div className="container">
      <TextAnnotator
        content={TEXT}
        tags={tags}
        value={argument}
        onChange={function (value) {
          setArguments(value);
          return;
        }}
      />
    </div>
  );
};

export default App;
```

![image](https://github.com/Bollues/react-nested-annotator/blob/main/img/annotation.gif)

![image](D:\gitproject\react-nested-annotator\README.assets\nested.gif)



### how to Delete the label

move mouse over the annotated text, and then **rightclick**

![image](D:\gitproject\react-nested-annotator\README.assets\delete.gif)



### annotate with edge

```jsx
<TextAnnotator
  content={TEXT}
  tags={tags}
  value={argument}
  onChange={function (value) {
    setArguments(value);
    return;
  }}
+ useEdge={true}
/>
```

![image](D:\gitproject\react-nested-annotator\README.assets\useEdge.gif)



### DIY tag style

```jsx
<TextAnnotator
  content={TEXT}
  tags={tags}
  value={argument}
  onChange={function (value) {
    setArguments(value);
    return;
  }}
+ tagStyle={{
+   verticalAlign: "middle",
+   backgroundColor: "white",
+   color: "black",
+   borderRadius: "5px",
+   fontSize: "0.5rem",
+   fontWeight: "bold",
+   padding: "4px"
+ }}
/>
```

![image](D:\gitproject\react-nested-annotator\README.assets\tagStyle.gif)



### codeSandBox

https://codesandbox.io/s/quirky-gauss-p6wfd?file=/src/App.js





### APIs

| key          | type                  | description            | default |
| ------------ | --------------------- | ---------------------- | ------- |
| **content**  | string                | text                   |         |
| **tags**     | object                | { tagName: color-Hex } |         |
| **value**    | object[]              | entities Array         |         |
| **onChange** | ( value: [] ) => void | value change callback  |         |
| useEdge      | boolean               | if annotate with edge  | false   |
| tagStyle     | CSSProperties         | diy tag style          | null    |

Bold **key** means it must be provided.
