import React, { useRef, useState } from 'react'

import CustomStyle from './YourStyle'

export default function App() {
  return (
    <div
      style={{
        border: '1px solid red',
        margin: '0 auto',
        marginTop: '64px',
        width: '640px',
        height: '640px'
      }}>
      <CustomStyle width={640} height={640} />
    </div>
  )
}
