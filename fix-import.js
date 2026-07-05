import fs from 'fs';
let code = fs.readFileSync('src/components/ProductCatalog.tsx', 'utf-8');

code = code.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";');
code = code.replace('  import { useEffect } from "react";\n', '');

fs.writeFileSync('src/components/ProductCatalog.tsx', code);
