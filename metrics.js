

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const resultsDir = path.join(__dirname, "results");
const csvFile = path.join(resultsDir, "metrics.csv");

if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

if (!fs.existsSync(csvFile)) {
  fs.writeFileSync(
    csvFile,
    [
      "Tool",
      "Mode",
      "Browser",
      "Duration(s)",
      "CPU_BEFORE",
      "CPU_AFTER_1S",
      "CPU_INITIAL_JUMP",
      "CPU_AVG",
      "RAM_BEFORE",
      "RAM_AFTER_1S",
      "RAM_INITIAL_JUMP",
      "RAM_AVG",
      "PROCESS_MEM_AVG",
      "DATE"
    ].join(",") + "\n"
  );
}

function getCPUPercent() {
  const stat1 = fs.readFileSync("/proc/stat", "utf8").split("\n")[0].split(" ");
  const idle1 = parseInt(stat1[5]);
  const total1 = stat1
    .slice(2, 9)
    .reduce((acc, val) => acc + parseInt(val), 0);

  const wait = ms => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
  wait(100); 

  const stat2 = fs.readFileSync("/proc/stat", "utf8").split("\n")[0].split(" ");
  const idle2 = parseInt(stat2[5]);
  const total2 = stat2
    .slice(2, 9)
    .reduce((acc, val) => acc + parseInt(val), 0);

  const idle = idle2 - idle1;
  const total = total2 - total1;
  return ((1 - idle / total) * 100);
}

function getRAMPercent() {
  const meminfo = fs.readFileSync("/proc/meminfo", "utf8").split("\n");
  let total = 0;
  let available = 0;

  meminfo.forEach(line => {
    if (line.startsWith("MemTotal")) total = parseInt(line.replace(/\D+/g, ""));
    if (line.startsWith("MemAvailable")) available = parseInt(line.replace(/\D+/g, ""));
  });

  const used = total - available;
  return (used / total) * 100;
}

function getProcessMemTotalMB() {
  let total = 0;

  const browserNames = ["chrome", "chromium", "firefox", "webkit", "msedge"];

  try {
    const out = execSync("ps -eo pid,comm,rss").toString().trim().split("\n");

    out.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 3) return;

      const rssKB = parseInt(parts[2]);
      const cmd = parts[1].toLowerCase();

      if (
        cmd.includes("node") ||
        browserNames.some(b => cmd.includes(b))
      ) {
        total += rssKB;
      }
    });
  } catch {}

  return total / 1024; 
}

let interval = null;

let cpuSamples = [];
let ramSamples = [];
let processMemSamples = [];

let cpuBefore = null;
let cpuAfter1s = null;

let ramBefore = null;
let ramAfter1s = null;

let startTime = null;

function startMonitoring() {
  console.log("Starting Linux metrics monitoring...");

  startTime = Date.now();

  cpuBefore = getCPUPercent();
  ramBefore = getRAMPercent();

  cpuSamples = [];
  ramSamples = [];
  processMemSamples = [];

  let tick = 0;

  interval = setInterval(() => {
    const cpu = getCPUPercent();
    const ram = getRAMPercent();
    const pmem = getProcessMemTotalMB();

    cpuSamples.push(cpu);
    ramSamples.push(ram);
    processMemSamples.push(pmem);

    tick++;
    if (tick === 1) {
      cpuAfter1s = cpu;
      ramAfter1s = ram;
    }
  }, 1000);
}

function stopMonitoring(tool, mode, browser) {
  console.log("Stopping Linux metrics monitoring...");

  if (interval) clearInterval(interval);

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  if (cpuSamples.length === 0) cpuSamples.push(cpuBefore);
  if (ramSamples.length === 0) ramSamples.push(ramBefore);
  if (processMemSamples.length === 0)
    processMemSamples.push(getProcessMemTotalMB());

  const cpuAvg = (cpuSamples.reduce((a, b) => a + b, 0) / cpuSamples.length).toFixed(2);
  const ramAvg = (ramSamples.reduce((a, b) => a + b, 0) / ramSamples.length).toFixed(2);
  const procMemAvg = (processMemSamples.reduce((a, b) => a + b, 0) / processMemSamples.length).toFixed(2);

  const cpuInitialJump = (cpuAfter1s - cpuBefore).toFixed(2);
  const ramInitialJump = (ramAfter1s - ramBefore).toFixed(2);

  const row = [
    tool,
    mode,
    browser,
    duration,
    cpuBefore.toFixed(2),
    cpuAfter1s.toFixed(2),
    cpuInitialJump,
    cpuAvg,
    ramBefore.toFixed(2),
    ramAfter1s.toFixed(2),
    ramInitialJump,
    ramAvg,
    procMemAvg,
    new Date().toISOString()
  ].join(",") + "\n";

  fs.appendFileSync(csvFile, row);

  console.log(`Metrics saved for ${tool} (${mode}, ${browser})`);
}

module.exports = { startMonitoring, stopMonitoring };
