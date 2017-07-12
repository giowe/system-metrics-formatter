'use strict';

module.exports = (...data) => {
  const buildedResponse = [];


  data.forEach(({ Time, Disks, Memory, Cpu, Network }, i) =>  {
    const diskData = {};
    const networkData = {};

    Disks.forEach(d => {
      diskData[d.Name] = {
        available: d.Available,
        used: d.Used
      };
    });

    Object.keys(Network).forEach((networkName) => {
      const networkAtTime = Network[networkName];
      const networkAtTimePre = c === 0 ? null : data[i-1].Network[networkName];
      if (networkAtTimePre) {
        if (networkAtTime.BytesIn - networkAtTimePre.BytesIn < 0) {
          networkData[networkName] = {
            bytesIn: 'NA',
            bytesOut: 'NA'
          };
        }else{
          networkData[networkName] = {
            bytesIn : networkAtTime.BytesIn - networkAtTimePre.BytesIn,
            bytesOut : networkAtTime.BytesOut - networkAtTimePre.BytesOut
          };
        }
      } else {
        networkData[networkName][t] = {
          bytesIn: 'NA',
          bytesOut: 'NA'
        };
      }
    });

    const memoryUtilization = Memory.MemTotal - Memory.MemFree;
    const memoryData = {
      percentage: memoryUtilization / Memory.MemTotal
    };

    let cpuData;
    if (i === 0) {
      cpuData = 'NA';
    } else {
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

      cpuData = (totald - idled) / totald;
    }
    buildedResponse.push({time: Time, diskData, memoryData, cpuData, networkData})
  });

  return buildedResponse.reverse();
};
