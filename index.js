'use strict';

module.exports = (...data) => {
  const buildedResponse = [];

  data.forEach(({ Id, CustomerId, Time, Disks, Memory, Cpu, Network }, i) =>  {
    const diskData = {};
    const networkData = {};

    Disks.forEach(d => {
      diskData[d.Name] = {
        mountPath: d.MountPoint,
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
            bytesIn: NaN,
            bytesOut: NaN
          };
        }else{
          networkData[networkName] = {
            bytesIn,
            bytesOut
          };
        }
      } else {
        networkData[networkName] = {
          bytesIn: NaN,
          bytesOut: NaN
        };
      }
    });

    const {MemTotal, MemFree, MemAvailable, SwapFree, SwapTotal} = Memory;
    const memoryUtilization = MemTotal - MemFree;
    const memoryUsed = MemTotal - MemAvailable;
    const swapTotal = SwapTotal;
    const swapUsed = swapTotal - SwapFree;
    const memoryData = {
      memoryUsed,
      memoryUsedPercentage: MemTotal > 0 ? memoryUsed / MemTotal : 0,

      memoryUtilization,

      memoryAvailable: MemAvailable,
      memoryAvailablePercentage: MemTotal > 0 ? MemAvailable / MemTotal : 0,

      memoryFreePercentage: MemTotal > 0 ? MemFree / MemTotal : 0,

      swapUtilization: swapTotal > 0 ? swapUsed/swapTotal : 0,
      swapUsed
    };

    let cpuData;
    if (i === 0) {
      cpuData = NaN;
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

      cpuData = totald > 0 ? (totald - idled) / totald : 0;
    }
    buildedResponse.push({id: Id, customerId: CustomerId, time: Time, diskData, memoryData, cpuData, networkData})
  });

  return buildedResponse;
};
