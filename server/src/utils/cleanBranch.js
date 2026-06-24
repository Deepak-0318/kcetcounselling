const START_KEYWORDS = [
  "AERONAUTICAL", "AEROSPACE", "AGRICULTURAL", "AGRICULTURE",
  "ARTIFICIAL", "AUTOMOBILE", "AUTOMOTIVE", "B.PLAN", "BPLAN",
  "BIO", "BIOMEDICAL", "BIOTECHNOLOGY", "CERAMICS", "CHEMICAL",
  "CIVIL", "COMPUTER", "CONSTRUCTION", "CYBER", "DATA",
  "DESIGN", "ELECTRONICS", "ELECTRICAL", "ENERGY", "ENVIRONMENTAL",
  "INDUSTRIAL", "INFORMATION", "MARINE", "MATHEMATICS", "MATHAMATICS",
  "MECHANICAL", "MECHATRONICS", "MINING", "PETROLEUM", "PHARMACEUTICAL",
  "PLANNING", "POLYMER", "PRODUCTION", "ROBOTIC", "ROBOTICS",
  "SILK", "TEXTILE", "TEXTILES", "VLSI"
];

function cleanBranch(rawBranch) {
  if (!rawBranch) return "";
  
  let branch = rawBranch.toUpperCase().trim();

  // 1. Spacing and Spelling Corrections (First Phase)
  branch = branch
    .replace(/\s+/g, " ")
    .replace(/&/g, "AND")
    .replace(/\bENGG\b\.?/g, "ENGINEERING")
    .replace(/\bENG\b\.?/g, "ENGINEERING")
    .replace(/\bEDUN\b\.?/g, "EDUCATION")
    
    // Character spacing spacing / OCR corrections
    .replace(/A\s*R\s*T\s*I\s*F\s*I\s*C\s*I?\s*A\s*L/g, "ARTIFICIAL")
    .replace(/I\s*N\s*D\s*U\s*S\s*T\s*R\s*I\s*A\s*L/g, "INDUSTRIAL")
    .replace(/I\s*N\s*T\s*E\s*G\s*[RT]\s*A\s*T\s*E\s*D/g, "INTEGRATED")
    .replace(/B\s*I\s*G\s+D\s*A\s*T\s*A/g, "BIG DATA")
    .replace(/B\s*I\s*O\s*T\s*E\s*C\s*H\s*N\s*O\s*L\s*O\s*G\s*Y/g, "BIOTECHNOLOGY")
    .replace(/B\s*I\s*O\s*-\s*T\s*E\s*C\s*H\s*N\s*O\s*L\s*O\s*G\s*Y/g, "BIOTECHNOLOGY")
    
    // Spelling corrections
    .replace(/VIRUTAL/g, "VIRTUAL")
    .replace(/MATHAMATICS/g, "MATHEMATICS")
    .replace(/COMPUTER\s+SICENCE/g, "COMPUTER SCIENCE")
    
    // Split words / spacing spacing corrections
    .replace(/COMMUNICATIO N/g, "COMMUNICATION")
    .replace(/INSTRUMENTATI ON/g, "INSTRUMENTATION")
    .replace(/TELECOMMUNIC ATION/g, "TELECOMMUNICATION")
    .replace(/TELECOMMUNICAT ION/g, "TELECOMMUNICATION")
    .replace(/ENVIRONMENTA L/g, "ENVIRONMENTAL")
    .replace(/PHARMACEUTIC AL/g, "PHARMACEUTICAL")
    .replace(/MANUFACTURIN G/g, "MANUFACTURING")
    
    .replace(/AERO SPACE/g, "AEROSPACE")
    .replace(/V LSI/g, "VLSI")
    .replace(/D ATA/g, "DATA")
    .replace(/DAT A/g, "DATA")
    .replace(/C YBER/g, "CYBER")
    .replace(/CYB ER/g, "CYBER")
    .replace(/S OFTWARE/g, "SOFTWARE")
    .replace(/SOFT WARE/g, "SOFTWARE")
    .replace(/BLO CK CHAIN/g, "BLOCK CHAIN")
    .replace(/B LOCK CHAIN/g, "BLOCK CHAIN")
    .replace(/I OT/g, "IOT")
    .replace(/D EV OPS/g, "DEV OPS")
    .replace(/DEV OPS/g, "DEVOPS")
    .replace(/DEVOPS/g, "DEVOPS")
    .replace(/EXC LUSIVELY/g, "EXCLUSIVELY")
    .replace(/E XCLUSIVELY/g, "EXCLUSIVELY")
    .replace(/INTERNE T/g, "INTERNET")
    
    .replace(/\s*\(\s*/g, " (")
    .replace(/\s*\)\s*/g, ")")
    .trim();

  // 2. Strip address/location prefixes using word boundaries (\b)
  let earliestIndex = -1;
  
  for (const keyword of START_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\b`);
    const match = branch.match(regex);
    if (match && match.index !== undefined) {
      const idx = match.index;
      if (earliestIndex === -1 || idx < earliestIndex) {
        earliestIndex = idx;
      }
    }
  }
  
  if (earliestIndex !== -1) {
    const prefix = branch.substring(0, earliestIndex).trim();
    
    const hasAddressIndicators = (str) => {
      const addressKeywords = /(VILLAGE|POST|ROAD|LAYOUT|TQ|DIST|MAIN|CAMPUS|OFFICE|VTU|RURAL|URBAN|BENGALURU|BENALURU|BANGALORE|UNIVERSITY|\b\d{5,6}\b)/i;
      if (addressKeywords.test(str)) return true;
      if (str.includes(",") || /\d/.test(str)) return true;
      if (str.split(/\s+/).length > 2 && str.length > 15) return true;
      return false;
    };

    if (prefix && hasAddressIndicators(prefix)) {
      branch = branch.substring(earliestIndex);
    }
  }

  // 3. Remove leading degree prefixes and HONS
  branch = branch
    .replace(/^(B\.?\s*TECH\s+IN|BTECH\s+IN)\s+/g, "")
    .replace(/^(B\.?\s*PLAN\s+IN|BPLAN\s+IN)\s+/g, "")
    .replace(/^(B\.?\s*TECH\b|BTECH\b)\s*/g, "")
    .trim();

  branch = branch.replace(/^[(\s]*HONS[)\s]*/gi, "").replace(/[(\s]*HONS[)\s]*$/gi, "");

  if (branch === "B.PLAN" || branch === "BPLAN") {
    branch = "PLANNING";
  }

  // 4. Mismatch Parentheses Cleanup
  if (branch.endsWith(")") && (branch.match(/\(/g) || []).length < (branch.match(/\)/g) || []).length) {
    branch = branch.slice(0, -1).trim();
  }
  if (branch.startsWith("(") && (branch.match(/\(/g) || []).length > (branch.match(/\)/g) || []).length) {
    branch = branch.slice(1).trim();
  }
  branch = branch.replace(/^\((.*)\)$/, "$1").trim();

  // 5. Normalization & Branch Consolidation
  
  // AI / ML variants
  branch = branch
    .replace(/\b(AIML|AI\s*AND\s*ML|AI\s*&\s*ML)\b/g, "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING")
    .replace(/\bAI\b/g, "ARTIFICIAL INTELLIGENCE");

  // IOT -> INTERNET OF THINGS
  branch = branch.replace(/\bIOT\b/g, "INTERNET OF THINGS");

  // DS -> DATA SCIENCE
  branch = branch
    .replace(/\bDATA SCIENCES\b/g, "DATA SCIENCE")
    .replace(/\bDS\b/g, "DATA SCIENCE");

  // Cyber Security variants
  branch = branch
    .replace(/\bCYBERSECURITY\b/g, "CYBER SECURITY")
    .replace(/\bCYBER\s+SECURITY\b/g, "CYBER SECURITY");

  // Bio/Biotech variants
  if (branch === "BIO-TECHNOLOGY" || branch === "BIO- TECHNOLOGY" || branch === "BIOTECHNOLOGY") {
    branch = "BIOTECHNOLOGY";
  }
  if (branch === "BIO-MEDICAL ENGINEERING" || branch === "BIOMEDICAL ENGINEERING") {
    branch = "BIOMEDICAL ENGINEERING";
  }
  if (branch.includes("BIOTECHNOLOGY") && (branch.includes("BIO-ENGINEERING") || branch.includes("BIO- ENGINEERING"))) {
    branch = "BIOTECHNOLOGY AND BIO-ENGINEERING";
  }

  // Electronics & Communication variants
  if (branch === "ELECTRONICS AND COMMUNICATION ENGINEERING" || branch === "ELECTRONICS AND COMMUNICATION" || branch === "ELECTRONICS AND COMMUNICATION ENGG") {
    branch = "ELECTRONICS AND COMMUNICATION ENGINEERING";
  }

  // Information Science variants
  if (branch === "INFORMATION SCIENCE AND ENGINEERING" || branch === "INFORMATION SCIENCE ENGINEERING" || branch === "INFORMATION SCIENCE" || branch === "INFORMATION SCIENCE AND TECHNOLOGY") {
    branch = "INFORMATION SCIENCE AND ENGINEERING";
  }

  // Mechatronics variants
  if (branch === "MECHATRONICS" || branch === "MECHATRONICS ENGINEERING") {
    branch = "MECHATRONICS ENGINEERING";
  }

  // Computer Science / CSE variants
  if (branch === "COMPUTER SCIENCE" || branch === "COMPUTER SCIENCE AND ENGINEERING") {
    branch = "COMPUTER SCIENCE AND ENGINEERING";
  }
  
  branch = branch
    .replace(/^COMPUTER SCIENCE\s*\(/g, "COMPUTER SCIENCE AND ENGINEERING (")
    .replace(/^COMPUTER SCIENCE AND TECHNOLOGY/g, "COMPUTER SCIENCE AND ENGINEERING")
    .replace(/^COMPUTER SCIENCE AND ENGINEERING\s*\(/g, "COMPUTER SCIENCE AND ENGINEERING (")
    
    // Clean sub-branches
    .replace(/CLOU D/g, "CLOUD")
    .replace(/SOF TWARE/g, "SOFTWARE")
    .replace(/D EV/g, "DEV")
    .replace(/DEV OPS/g, "DEVOPS")
    .replace(/DEVOPS/g, "DEVOPS")
    .replace(/BI G/g, "BIG")
    .replace(/EXC LUSIVELY/g, "EXCLUSIVELY");

  // Specific consolidations
  if (branch === "AGRICULTURE ENGINEERING" || branch === "AGRICULTURAL ENGINEERING") {
    branch = "AGRICULTURAL ENGINEERING";
  }
  if (branch === "AUTOMOTIVE ENGINEERING" || branch === "AUTOMOBILE ENGINEERING") {
    branch = "AUTOMOBILE ENGINEERING";
  }
  if (branch === "ROBOTIC ENGINEERING" || branch === "ROBOTICS ENGINEERING") {
    branch = "ROBOTICS ENGINEERING";
  }
  if (branch === "BACHELOR OF DESIGN (INTERIOR DESIGN)") {
    branch = "DESIGN (INTERIOR DESIGN)";
  }

  // Final spacing and parenthesis cleaning
  branch = branch
    .replace(/\s+/g, " ")
    .replace(/\s*\(\s*/g, " (")
    .replace(/\s*\)\s*/g, ")")
    .trim();

  return branch;
}

module.exports = cleanBranch;