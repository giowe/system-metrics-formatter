'use strict';

module.exports = (...data) => {
  const buildedResponse = [];

  data.forEach(({ Time, Disks, Memory, Cpu, Network }, i) =>  {
    const diskData = {};
    const networkData = {};

    Disks.forEach(d => {
      diskData[d.Name] = {
        mountPoint: d.MountPoint,
        available: d.Available,
        used: d.Used
      };
    });

    Object.keys(Network).forEach((networkName) => {
      const networkAtTime = Network[networkName];
      const networkAtTimePre = i === 0 ? null : data[i-1].Network[networkName];
      if (networkAtTimePre) {
        const bytesIn = networkAtTime.BytesIn - networkAtTimePre.BytesIn;
        const bytesOut = networkAtTime.BytesOut - networkAtTimePre.BytesOut;
        if (bytesIn < 0 || bytesOut < 0) {
          networkData[networkName] = {
            bytesIn: 'NA',
            bytesOut: 'NA'
          };
        }else{
          networkData[networkName] = {
            bytesIn,
            bytesOut
          };
        }
      } else {
        networkData[networkName] = {
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

  return buildedResponse;
};
