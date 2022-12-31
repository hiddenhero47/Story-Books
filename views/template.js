const fs = require('fs')

const templateEngines = (filePath, options, callback) => {
  fs.readFile(filePath, (err, content) => {
    if (err) return callback(err)
    // this is an extremely simple template engine
    
    // const rendered = content.toString()
    // .replace('#message#', `<div>${options.message}</div>`)
    // .replace('#data#', `${options.data}`);

    let rendered = content.toString()
    Object.keys(options).forEach(item => {
      if (item ==='_locals' || item==='cache' || item==='settings') {return;}
      rendered = rendered.replaceAll(`'#${item}#'`, `${options[item]}`);
    });

    return callback(null, rendered)
  })
}

module.exports = templateEngines