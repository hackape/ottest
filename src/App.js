import React, { Component } from 'react'
import chroma from 'chroma-js'
import hsv from 'converter/hsv2rgb'

window.chroma = chroma

function rgb (args) {
  const [r, g, b] = args.map(Math.round)
  return `rgb(${r}, ${g}, ${b})`
}

const ColorTile = (props) => {
  const { color, w, h=1, ...otherProps } = props
  const style = {
    backgroundColor: color,
    height: typeof h === 'number' ? `${h}px` : h,
  }

  if (w !== undefined) {
    style.width = typeof w === 'number' ? `${w}px` : w
    style.display = 'inline-block'
  }

  return <div style={style} {...otherProps} />
}

class App extends Component {
  constructor () {
    super()
    this.state = {
      hue: 0,
      saturation: 1,
      value: 1,
    }
    this.hues = []
    for (let h = 0; h <= 360; h += 1) {
      this.hues.push(h)
    }
    this.saturations = []
    for (let s = 0; s <= 1; s += 0.01) {
      this.saturations.push(s)
    }
    this.values = []
    for (let v = 1; v >= 0; v -= 0.01) {
      this.values.push(v)
    }
  }

  renderHueScale () {
    return (
      <div style={{ width: '30px' }} >
        {this.hues.map(h =>
          <ColorTile color={rgb(hsv(h, 1, 1))}
            onClick={() => this.setState({ hue: h })}
          />
        )}
      </div>
    )
  }

  renderSaturationValuePlane () {
    return (
      <div>
        {this.values.map(v =>
          <div style={{ height: '1px' }} >{this.saturations.map(s =>
            <ColorTile color={rgb(hsv(this.state.hue, s, v))} w={1} />
          )}</div>
        )}
      </div>
    )
  }

  render () {
    return <div>
      {this.renderHueScale()}
      {this.renderSaturationValuePlane()}
    </div>
  }
}

export default App
