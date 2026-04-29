const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src');

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

walkSync(dir, function(filePath) {
    if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content.replace(/fetch\('\/api\//g, "fetch('https://anti-backend-r68e.onrender.com/api/");
        newContent = newContent.replace(/fetch\(`\/api\//g, "fetch(`https://anti-backend-r68e.onrender.com/api/");
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Updated', filePath);
        }
    }
});
