/** Minimal WebGL2 helpers: one program, one full-screen triangle, named uniforms. */

export class GLError extends Error {}

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)
  if (!shader) throw new GLError('Could not create shader')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
    const log = gl.getShaderInfoLog(shader) ?? 'unknown error'
    gl.deleteShader(shader)
    throw new GLError(`Shader failed to compile: ${log}`)
  }
  return shader
}

export function createProgram(gl: WebGL2RenderingContext, vertex: string, fragment: string): WebGLProgram {
  const vs = compile(gl, gl.VERTEX_SHADER, vertex)
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragment)
  const program = gl.createProgram()
  if (!program) throw new GLError('Could not create program')
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.bindAttribLocation(program, 0, 'aPosition')
  gl.linkProgram(program)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost()) {
    const log = gl.getProgramInfoLog(program) ?? 'unknown error'
    gl.deleteProgram(program)
    throw new GLError(`Program failed to link: ${log}`)
  }
  return program
}

/** A single triangle that covers the whole viewport (cheaper than a two-triangle quad). */
export function createFullScreenTriangle(gl: WebGL2RenderingContext): { vao: WebGLVertexArrayObject; buffer: WebGLBuffer } {
  const vao = gl.createVertexArray()
  const buffer = gl.createBuffer()
  if (!vao || !buffer) throw new GLError('Could not allocate geometry')
  gl.bindVertexArray(vao)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  gl.bindVertexArray(null)
  return { vao, buffer }
}

export type UniformLocations<K extends string> = Record<K, WebGLUniformLocation | null>

export function uniformLocations<K extends string>(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  names: readonly K[],
): UniformLocations<K> {
  return Object.fromEntries(names.map((name) => [name, gl.getUniformLocation(program, name)])) as UniformLocations<K>
}
