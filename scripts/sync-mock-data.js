const fs = require('fs');
const path = require('path');

const SQL_DIR = path.join(__dirname, '../../docs/course');
const MOCK_DIR = path.join(__dirname, '../src/mock');

const files = [
  '02_production_seed_core.sql',
  '03_production_seed_lessons.sql',
  '04_production_seed_logic.sql',
  'production_seed.sql',
  'import_javascript_140.sql',
  'clean_inserts.sql'
];

function parseInserts(content, tableName) {
  const regex = new RegExp(`INSERT INTO (?:public\\.)?${tableName} \\((.*?)\\) VALUES[\\s\\S]*?;`, 'gi');
  const results = new Map(); // 使用 Map 進行去重 (Key = ID)
  let match;

  while ((match = regex.exec(content)) !== null) {
      const columns = match[1].split(',').map(c => c.trim());
      const valuesPart = match[0].split(/VALUES/i)[1].trim().slice(0, -1);
      
      let currentField = '';
      let currentRecord = [];
      let inQuote = false;
      let parenLevel = 0;
      
      for (let i = 0; i < valuesPart.length; i++) {
          const char = valuesPart[i];
          if (char === "'" && valuesPart[i-1] !== "\\") inQuote = !inQuote;
          if (!inQuote) {
              if (char === '(') {
                  parenLevel++;
                  if (parenLevel === 1) continue;
              } else if (char === ')') {
                  parenLevel--;
                  if (parenLevel === 0) {
                      currentRecord.push(currentField.trim());
                      const record = {};
                      columns.forEach((col, idx) => {
                          let val = currentRecord[idx];
                          if (val && val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1).replace(/''/g, "'");
                          if (val === 'NULL' || val === 'null') val = null;
                          else if (val === 'true') val = true;
                          else if (val === 'false') val = false;
                          else if (!isNaN(val) && val !== '') val = Number(val);
                          
                          const camelCol = col.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
                          record[camelCol] = val;
                      });
                      
                      // 使用 ID 作為 Key，後出現的會覆蓋先出現的 (去重)
                      if (record.id) {
                          results.set(record.id, record);
                      }
                      
                      currentRecord = [];
                      currentField = '';
                      continue;
                  }
              } else if (char === ',' && parenLevel === 1) {
                  currentRecord.push(currentField.trim());
                  currentField = '';
                  continue;
              }
          }
          if (parenLevel > 0) currentField += char;
      }
  }
  return Array.from(results.values());
}

function sync() {
  console.log('🚀 Starting Comprehensive Mock Data Sync (with Deduplication)...');
  
  let allContent = '';
  files.forEach(file => {
    const filePath = path.join(SQL_DIR, file);
    if (fs.existsSync(filePath)) {
      allContent += fs.readFileSync(filePath, 'utf8') + '\n';
    }
  });

  const tables = [
    'members', 'journeys', 'lessons', 'chapters', 'gyms', 
    'challenges', 'missions', 'announcements', 'journey_menus',
    'lesson_contents', 'gym_badges', 'mission_requirements'
  ];

  tables.forEach(table => {
      const data = parseInserts(allContent, table);
      if (data.length > 0) {
          const fileName = `${table}Mock.ts`;
          const exportName = `MOCK_${table.toUpperCase()}`;
          const content = `// Generated from SQL
export const ${exportName} = ${JSON.stringify(data, null, 2)};
`;
          fs.writeFileSync(path.join(MOCK_DIR, fileName), content);
          console.log(`- ${table}: ${data.length} unique records -> ${fileName}`);
      }
  });

  console.log('✅ Comprehensive Mock data synced successfully!');
}

sync();
