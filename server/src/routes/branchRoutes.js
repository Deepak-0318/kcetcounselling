const express = require("express");
const router = express.Router();

const cutoffs = require("../../data/cutoffs-all.json");

router.get("/", (req, res) => {
  const branches = [
    ...new Set(
      cutoffs.map(item => item.branch)
      .filter(branch => branch && branch.length > 0)
    )
  ].sort();

  res.json(branches);
});

router.get("/stats", (req, res) => {
  const totalColleges = new Set(cutoffs.map(c => c.collegeCode)).size;
  const totalBranches = new Set(cutoffs.map(c => c.branch).filter(b => b && b.length > 0)).size;
  
  // Calculate branch popularity (number of colleges offering it)
  const branchOfferings = {};
  const branchGM3Cutoffs = {};
  
  cutoffs.forEach(item => {
    const cleanB = item.branch;
    if (!cleanB) return;

    // offerings count
    if (!branchOfferings[cleanB]) {
      branchOfferings[cleanB] = new Set();
    }
    branchOfferings[cleanB].add(item.collegeCode);
    
    // GM Round 3 cutoffs for popularity average
    if (item.category === "GM" && item.round === "R3") {
      if (!branchGM3Cutoffs[cleanB]) {
        branchGM3Cutoffs[cleanB] = [];
      }
      const val = Number(item.cutoff);
      if (!isNaN(val)) {
        branchGM3Cutoffs[cleanB].push(val);
      }
    }
  });
  
  const popularity = Object.keys(branchOfferings).map(branch => {
    const collegeCount = branchOfferings[branch].size;
    const cutoffsList = branchGM3Cutoffs[branch] || [];
    const avgCutoff = cutoffsList.length > 0
      ? Math.round(cutoffsList.reduce((sum, val) => sum + val, 0) / cutoffsList.length)
      : null;
      
    return {
      branch,
      collegeCount,
      avgCutoff
    };
  });
  
  // Sort by most offered branches
  popularity.sort((a, b) => b.collegeCount - a.collegeCount);
  
  res.json({
    totalColleges,
    totalBranches,
    popularity: popularity.slice(0, 10) // top 10
  });
});

module.exports = router;