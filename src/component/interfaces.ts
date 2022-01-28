import React from 'react';

export type Span = {
  start: number
  end: number
  mark: boolean
}

export interface TextSpan extends Span {
  id: string,
  content: string
}

export type TextBaseProps<T> = {
  content: string
  value: T[]
  tags: {}
  onChange: (value: T[]) => any
  useEdge?: boolean
  tagStyle?: any
}

export type TextAnnotatorProps<T> = React.HTMLAttributes<HTMLDivElement> & TextBaseProps<T>

export interface MarkProps {
  key: string
  content: string
  start: number
  end: number
  tag: string
  useEdge?: boolean
  color?: string
  whichEdgeIsActive?: number
  whichEdgeIsHover?: number
  tagStyle?: any
  onContextMenu: (any: any) => any
}

export interface NestedMarkProps extends MarkProps {
  id: number | string
  children?: MarkProps[]
}