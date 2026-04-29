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
        
        // Handle single quotes: fetch('https://.../api/...') -> fetch(`${import.meta.env.VITE_API_URL}/api/...`)
        let newContent = content.replace(/fetch\('https:\/\/anti-backend-r68e\.onrender\.com\/api\/(.*?)'\)/g, "fetch(`${import.meta.env.VITE_API_URL}/api/$1`)");
        newContent = newContent.replace(/fetch\('https:\/\/anti-backend-r68e\.onrender\.com\/api\/(.*?)',/g, "fetch(`${import.meta.env.VITE_API_URL}/api/$1`,");
        newContent = newContent.replace(/fetch\('https:\/\/anti-backend-r68e\.onrender\.com\/api\/(.*?)'\s*\)/g, "fetch(`${import.meta.env.VITE_API_URL}/api/$1`)");
        
        // Handle double quotes just in case
        newContent = newContent.replace(/fetch\("https:\/\/anti-backend-r68e\.onrender\.com\/api\/(.*?)"\)/g, "fetch(`${import.meta.env.VITE_API_URL}/api/$1`)");
        newContent = newContent.replace(/fetch\("https:\/\/anti-backend-r68e\.onrender\.com\/api\/(.*?)",/g, "fetch(`${import.meta.env.VITE_API_URL}/api/$1`,");
        
        // Handle backticks: fetch(`https://.../api/...`) -> fetch(`${import.meta.env.VITE_API_URL}/api/...`)
        newContent = newContent.replace(/fetch\(`https:\/\/anti-backend-r68e\.onrender\.com\/api\/(.*?)`\)/g, "fetch(`${import.meta.env.VITE_API_URL}/api/$1`)");
        newContent = newContent.replace(/fetch\(`https:\/\/anti-backend-r68e\.onrender\.com\/api\/(.*?)`,/g, "fetch(`${import.meta.env.VITE_API_URL}/api/$1`,");

        // Handle cases without explicit close parenthesis or comma by replacing just the URL prefix inside backticks
        // if they were already converted to backticks, or if they were simple strings that we didn't catch above
        newContent = newContent.replace(/'https:\/\/anti-backend-r68e\.onrender\.com\/api\//g, "`\\${import.meta.env.VITE_API_URL}/api/");
        newContent = newContent.replace(/"https:\/\/anti-backend-r68e\.onrender\.com\/api\//g, "`\\${import.meta.env.VITE_API_URL}/api/");
        
        // For existing backticks, just replace the URL part
        newContent = newContent.replace(/`https:\/\/anti-backend-r68e\.onrender\.com\/api\//g, "`\\${import.meta.env.VITE_API_URL}/api/");

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Updated', filePath);
        }
    }
});
