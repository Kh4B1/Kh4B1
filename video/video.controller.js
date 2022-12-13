const models = require("../../models"),
  fs = require("fs")

exports.upload = async (req, res) => {
  const { id: user_id } = req.body.user,
    { id: access_id } = req.params,
    { filename } = req.file
  try {
    await models.Video.create({
      user_id: user_id,
      access_id: access_id,
      path: filename,
    })
    console.log(1)
    res.json({ result: true })
  } catch (err) {
    console.log(err)
  }
}

exports.stream = async (req, res) => {
    const { pathname } = url.parse(req.url, true)
    const filepath = `./source/video${pathname}`
  
    const stat = fs.statSync(filepath)
    const fileSize = stat.size
    const range = req.headers.range
    console.log(range)
    
    if (!range) {
      const header = { "Content-Type": "video/mp4" }
      res.writeHead(200, header)
      res.end()
    } else {
      const MAX_CHUNK_SIZE = 1000 * 1000 * 50
      // ranage헤더 파싱
      const parts = range.replace(/bytes=/, "").split("-")
      // 재생 구간 설정
      const start = parseInt(parts[0], 10)
      const _end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const end = Math.min(_end, start + MAX_CHUNK_SIZE - 1)
  
      const header = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Type": "video/mp4",
        "Content-Length": fileSize - 1,
      }
      res.writeHead(206, header)
      const readStream = fs.createReadStream(filepath, { start, end })
      readStream.pipe(res)
    }
  }

