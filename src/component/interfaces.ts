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
  onChange: (value: T[]) => any
  getSpan?: (span: TextSpan) => T
  // TODO: determine whether to overwrite or leave intersecting ranges.
}

export type TextAnnotatorProps<T> = React.HTMLAttributes<HTMLDivElement> & TextBaseProps<T>

export interface MarkProps {
  key: string
  content: string
  start: number
  end: number
  tag: string
  color?: string
  onContextMenu: (any: any) => any
}

export interface NestedMarkProps extends MarkProps {
  id: number | string
  children?: MarkProps[]
}