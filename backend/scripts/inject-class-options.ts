const fs = require('fs');
const path = require('path');

const optionsPath = path.join(__dirname, '../config/shared/class-options.json');
const componentsDir = path.join(__dirname, '../src/components/props');
const sharedClass = JSON.parse(fs.readFileSync(optionsPath, 'utf-8'));

function injectOptionsIntoComponent(componentPath) {
  const json = JSON.parse(fs.readFileSync(componentPath, 'utf-8'));

  if (json.attributes?.class?.customField === 'plugin::multi-select.multi-select') {
    json.attributes.class.options = sharedClass;

    fs.writeFileSync(componentPath, JSON.stringify(json, null, 2));
    console.log(`✅ Injected class options into ${path.basename(componentPath)}`);
  }
}

function updateAllComponents() {
  const files = fs.readdirSync(componentsDir, { recursive: true });

  files.forEach(file => {
    if (file.endsWith('.json')) {
      const filePath = path.join(componentsDir, file);
      injectOptionsIntoComponent(filePath);
    }
  });
}

updateAllComponents();
