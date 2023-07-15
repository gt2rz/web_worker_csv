let errors = [];

function csvProcess({ content, separator = "," }) {
  const lines = content.split("\n");

  self.postMessage({"type": "init", "lines": lines.length });

  for (var i = 0; i < lines.length; i++) {
    if (i === 0) {
      continue;
    }

    const line = lines[i].split(separator);
    validateLine(line, i);      
    
    self.postMessage({"type": "progress", "linesProcessed": i, "linesErrors": errors.length });

  }

  self.postMessage({"type": "done", "linesProcessed": i, "linesErrors": errors.length, "errors": errors });
 
}

self.onmessage = function (event) {
  const content = event.data;
  csvProcess({ content });
};


function validateLine(line, lineNumber) {
  if (line.length !== 6) {
    errors.push({ line: lineNumber, msg: "Invalid number of columns" });
  }

  const date = new Date(line[2]);
  if (isNaN(date.getTime())) {
    errors.push({ line: lineNumber, msg: "Invalid date" });
  }
}