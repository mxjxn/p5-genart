import React from 'react'
import Sketch from 'react-p5'
import blocks from './blocks'

const Comp = React.memo(
  ({
    block = blocks[0],
    width,
    height,
    mod_1 = 0.75,
    mod_2 = 0.25,
    col_1 = '#FFE478',
    col_2 = '#c62a88',
    col_3 = '#03c4a1',
    bg = '#000003'
  }) => {
    //  SIZE
    let DEFAULT_SIZE = 500
    let WIDTH = width
    let HEIGHT = height
    let DIM = Math.min(WIDTH, HEIGHT)

    // Entropy from the block hash
    // let hash = '0xb61be06f187aa780aa4d8d0d58b8817d8877ce822919895ef796f89e08043c1e';
    let hash = block.hash
    let seed = parseInt(hash.slice(0, 16), 16)

    // Extracts individual hash pairs
    let rvs = []
    for (let j = 0; j < 32; j++) {
      let hp = hash.slice(2 + j * 2, 4 + j * 2)
      rvs.push(parseInt(hp, 16) % 20)
    }
    let easter_1 = (rvs[0] == 1) & (rvs[1] == 1)
    let easter_2 = (rvs[0] == 2) & (rvs[1] == 2)

    // Keeps sizing constant
    let M = DIM / DEFAULT_SIZE

    let x = 50
    let y = 50

    function sbox(x1, y1, x2, y2, color, sw, by, steps, dbl, p5) {
      p5.stroke(color)
      p5.strokeWeight(sw)
      p5.noFill()
      if (by === 'x') {
        for (let x = x1; x <= x2; x += steps) {
          p5.line(x, y1, x, y2)
        }
      }
      if (by === 'y') {
        for (let y = y1; y <= y2; y += steps) {
          p5.line(x1, y, x2, y)
        }
      }
      if (dbl === 1) {
        by = by === 'x' ? 'y' : 'x'
        sbox(x1, y1, x2, y2, bg, sw, by, steps, 0, p5)
      }
    }

    // Deterministic randomness
    function rnd_dec() {
      seed ^= seed << 13
      seed ^= seed >> 17
      seed ^= seed << 5
      return ((seed < 0 ? ~seed + 1 : seed) % 1000) / 1000
    }
    function rnd_between(a, b) {
      return a + (b - a) * rnd_dec()
    }
    function rnd_choice(choices) {
      return choices[Math.floor(rnd_between(0, choices.length * 0.99))]
    }

    const setup = (p5, canvasParentRef) => {
      p5.createCanvas(width, height).parent(canvasParentRef)

      // use parent to render the canvas in this ref
      // (without that p5 will render the canvas outside of your component)
    }

    const draw = (p5) => {
      // createCanvas(DIM, DIM);
      p5.background(bg)
      for (x = DIM * 0.05; x < DIM * 0.95; ) {
        let next_x = rnd_between(10 * M, 70 * M)
        next_x = x + next_x > DIM * 0.95 ? DIM * 0.95 - x : next_x
        for (y = DIM * 0.05; y < DIM * 0.85; ) {
          let next_y = rnd_between(10 * M, 70 * M)
          let skip = rnd_choice([0, 0, 0, 0, 1, 1])
          let color = rnd_choice([col_1, col_2, col_3])

          let sw = rnd_between(0.01, p5.map(mod_1, 0, 1, 0.02, 5)) * M
          let by = rnd_choice(['x', 'y'])
          let steps = rnd_between(5, p5.map(mod_2, 0, 1, 8, 25)) * M
          let dbl = rnd_choice([0, 0, 0, 0, 1])

          if (easter_1) {
            steps = 30
          }
          if (easter_2) {
            dbl = 1
          }

          if (skip == 0) {
            sbox(x, y, x + next_x, y + next_y, color, sw, by, steps, dbl, p5)
          }
          y += next_y
        }
        x += next_x
      }

      // p5.background(0);
      // p5.ellipse(x, y, 70, 70);
      // NOTE: Do not use setState in the draw function or in functions that are executed
      // in the draw function...
      // please use normal letiables or class properties for these purposes
      // x++;
      // p5.noLoop();
    }

    return <Sketch setup={setup} draw={draw} />
  }
)

export default Comp
