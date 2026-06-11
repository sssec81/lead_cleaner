const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Background transparency
  content = content.replace(/bg-white\/(?:40|50|60|70|80|90)/g, 'bg-white');
  content = content.replace(/bg-slate-50\/(?:40|50|60|70|80|90)/g, 'bg-slate-50');
  content = content.replace(/bg-\[color:rgba\(255,255,255,[0-9.]+\)\]/g, 'bg-white');
  content = content.replace(/bg-\[color:rgba\(248,250,252,[0-9.]+\)\]/g, 'bg-slate-50');

  // Blur removal
  content = content.replace(/\sbackdrop-blur-(?:sm|md|lg|xl|2xl|3xl)\s/g, ' ');
  content = content.replace(/\sbackdrop-blur\s/g, ' ');

  // Border radius reduction
  content = content.replace(/rounded-(?:2xl|3xl|4xl)/g, 'rounded-xl');
  content = content.replace(/rounded-\[([0-9.]+)rem\]/g, 'rounded-xl');

  // Translucent border simplification
  content = content.replace(/border-slate-200\/(?:40|50|60|70|80|90)/g, 'border-slate-200');

  // Complex custom shadows to simple
  content = content.replace(/shadow-\[.*?\]/g, 'shadow-sm');

  // Fix up spaces
  content = content.replace(/  +/g, ' ');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated: ' + file);
  }
});
