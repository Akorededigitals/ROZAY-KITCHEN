import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf-8');

if (!code.includes('import SEOTags')) {
  code = code.replace(
    'import ScrollToTop from "./components/ScrollToTop";',
    'import ScrollToTop from "./components/ScrollToTop";\nimport SEOTags from "./components/SEOTags";'
  );
  
  code = code.replace(
    '<ScrollToTop />',
    '<ScrollToTop />\n      <SEOTags />'
  );

  fs.writeFileSync('src/App.tsx', code);
}
