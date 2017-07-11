'use strict';

module.exports = (object, previousObject) => {
  const times = [];
  const diskData = {};
  const memoryData = {};
  const cpuData = {};
  const networkDataRaw = {};
  const networkData = {};

  [object, previousObject].forEach(({ Time, Disks, Memory, Cpu, Network }, i) =>  {
    times.push(Time);
    Disks.forEach(d => {
      if (!diskData[d.Name]) diskData[d.Name] = {};
      diskData[d.Name][Time] = {
        available: d.Available,
        used: d.Used
      };
    });

    Network.forEach(n => {
      if (!networkDataRaw[n.Name]) networkDataRaw[n.Name] = {};
      if (!networkData[n.Name]) networkData[n.Name] = {};
      networkDataRaw[n.Name][Time] = {
        bytesIn: n.BytesIn,
        bytesOut: n.BytesOut
      };
    });

    Object.keys(networkDataRaw).forEach((networkName) => {
      times.forEach((t, c) => {
        const networkAtTime = networkDataRaw[networkName][t];
        const networkAtTimePre = c === 0 ? null : networkDataRaw[networkName][times[c - 1]];
        if (networkAtTimePre) {
          if (networkAtTime.bytesIn - networkAtTimePre.bytesIn < 0) {
            networkData[networkName][t] = {
              bytesIn: 'NA',
              bytesOut: 'NA'
            };
          }else{
            networkData[networkName][t] = {
              bytesIn : networkAtTime.bytesIn - networkAtTimePre.bytesIn,
              bytesOut : networkAtTime.bytesOut - networkAtTimePre.bytesOut
            };
          }
        } else {
          networkData[networkName][t] = {
            bytesIn: 'NA',
            bytesOut: 'NA'
          };
        }
      });
    });

    const memoryUtilization = Memory.MemTotal - Memory.MemFree;
    memoryData[Time] = {
      percentage: memoryUtilization / Memory.MemTotal
    };

    if (i === 0) return cpuData[Time] = 'NA';
    const prevCpuTotal = data[i-1].Cpu.TotalCpuUsage;
    const cpuTotal = Cpu.TotalCpuUsage;
    const prevIdle = prevCpuTotal.Idle + prevCpuTotal.Iowait;
    const idle = cpuTotal.Idle + cpuTotal.Iowait;

    const prevNonIdle = prevCpuTotal.User + prevCpuTotal.Nice + prevCpuTotal.System + prevCpuTotal.Irq + prevCpuTotal.Softirq + prevCpuTotal.Steal;
    const nonIdle = cpuTotal.User + cpuTotal.Nice + cpuTotal.System + cpuTotal.Irq + cpuTotal.Softirq + cpuTotal.Steal;

    const prevTotal = prevIdle + prevNonIdle;
    const total = idle + nonIdle;

    const totald = total - prevTotal;
    const idled = idle - prevIdle;

    cpuData[Time] = (totald - idled) / totald;
  });

  return { diskData, memoryData, cpuData, networkData, times };
};
