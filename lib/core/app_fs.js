'use strict'

const fs = require('fs')
const {
  StatusCodeEnum
} = require('../models/app_enum.js')
const {
  ReaderBase,
  WriterBase
} = require('../models/app_interface.js')
const { AppResult } = require('../models/app_dto.js')

/**
 * Creates a new FileReader
 * @class
 */
class FileReader extends ReaderBase {
  /**
   * @param {string} path - path to read the data
   * @constructor
   */
  constructor(path) {
    super()
    this.path = path
  }

  /**
   * async read
   * @return {AppResult}
   * @override
   */
  async read() {
    let that = this

    return new Promise((resolve, reject) => {
      let rstream = fs.createReadStream(that.path) // fs.ReadStream

      rstream.on('data', (chunk) => {
        that.data += chunk
      })

      rstream.on('end', () => {
        resolve(new AppResult().ok())
      })

      rstream.on('error', err => {
        reject(new AppResult().err(StatusCodeEnum.warn, err))
      })

      rstream.on('close', () => {
      })
    })
  }
}

/**
 * Creates a new StreamReader
 * @class
 */
class StreamReader extends ReaderBase {
  /**
   * @param {StreamReader} stream - 
   * @constructor
   */
  constructor(stream) {
    super()
    this.rstream = stream // e.g., fs.ReadStream
  }

  /**
   * async read
   * @return {AppResult}
   * @override
   */
  async read() {
    let that = this

    return new Promise((resolve, reject) => {
      if (that.rstream.readableEnded) {
        return resolve(new AppResult().ok())
      }

      that.rstream.on('data', (chunk) => {
        that.data += chunk
      })

      that.rstream.on('end', () => {
        resolve(new AppResult().ok())
      })

      that.rstream.on('error', (err) => {
        reject(new AppResult().err(StatusCodeEnum.warn, err))
      })

      // Ensure stream is in flowing mode
      that.rstream.resume()
    })
  }
}

/**
 * Creates a new ConsoleWriter
 * @class
 */
class ConsoleWriter extends WriterBase {
  /**
   * async write
   * @param {string} d - message string
   * @override
   */
  async write(d) {
    let that = this

    return new Promise((resolve) => {
      console.log(d || that.data)
      resolve(new AppResult().ok())
    })
  }
}

class FileWriter extends WriterBase {
  constructor(path) {
    super()
    this.path = path
  }

  /**
   * async write
   * @param {string} d - message string
   * @override
   */
  async write() {
    let that = this

    return new Promise((resolve, reject) => {
      let wstream = fs.createWriteStream(that.path) // fs.WriteStream

      wstream.on('error', function (err) {
        reject(new AppResult().err(StatusCodeEnum.warn, err))
      })

      wstream.on('finish', function () {
        resolve(new AppResult().ok())
      })

      wstream.on('close', function () {
      })

      wstream.write(that.data, function () {
        wstream.end()
      })
    })
  }
}

/**
 * Creates a new StreamWriter
 * @class
 */
class StreamWriter extends WriterBase {
  /**
   * @param {StreamWriter} stream - 
   * @constructor
   */
  constructor(stream) {
    super()
    this.wstream = stream
  }

  /**
   * async write
   * @param {string} d - message string
   * @override
   */
  async write() {
    let that = this
    return new Promise((resolve, reject) => {
      that.wstream.on('error', function (err) {
        reject(new AppResult().err(StatusCodeEnum.warn, err))
      })

      that.wstream.on('finish', function () {
        resolve(new AppResult().ok())
      })

      that.wstream.on('close', function () {
      })

      that.wstream.write(that.data, function () {
        that.wstream.end()
      })
    })
  }
}

module.exports = {
  FileReader,
  StreamReader,
  ConsoleWriter,
  FileWriter,
  StreamWriter
}