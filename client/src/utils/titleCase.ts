// src/utils/titleCase.ts

export function toTitleCase(str: string): string {
  if (!str) return "";
  
  const abbreviations = ["AI", "ML", "IOT", "VLSI", "DEVOPS", "CSE", "ECE", "EEE", "IT", "AR/VR"];
  const minorWords = ["and", "or", "but", "in", "on", "for", "with", "of", "to", "by", "a", "an", "the"];
  
  return str
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      const hasStartParen = word.startsWith("(");
      const hasEndParen = word.endsWith(")");
      
      let core = word;
      if (hasStartParen) core = core.slice(1);
      if (hasEndParen) core = core.slice(0, -1);
      
      const cleanedCore = core.toUpperCase();
      if (abbreviations.includes(cleanedCore)) {
        core = cleanedCore;
      } else if (minorWords.includes(core.toLowerCase()) && index > 0) {
        core = core.toLowerCase();
      } else if (core.length > 0) {
        core = core.charAt(0).toUpperCase() + core.slice(1);
      }
      
      return (hasStartParen ? "(" : "") + core + (hasEndParen ? ")" : "");
    })
    .join(" ");
}
