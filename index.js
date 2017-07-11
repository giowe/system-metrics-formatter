'use strict';

const AWS = require('aws-sdk');
const path =require('path');
const fs = require('fs');
const zlib = require('zlib');

const _listAllKeys = (bucket, customerId, id, s3, out = []) => new Promise((resolve, reject) => {
  s3.listObjectsV2({
    Bucket: bucket,
    MaxKeys: 10,
    Prefix: `${customerId}/${id}`,
    StartAfter: out[out.length-1]
  }, (err, data) => {
    if (err) return reject(err);
    data.Contents.forEach(content => {
      //if (content.LastModificationDate )
      out.push(content.Key);
    });
    if (data.IsTruncated) {
      resolve(_listAllKeys(out));
    } else {
      resolve(out);
    }
  });
});

const _parseData = (data) => new Promise((resolve, reject) => {
  const times = [];
  const diskData = {};
  const memoryData = {};
  const cpuData = {};
  const networkData = {};

  data.forEach(({ Time, Disks, Memory, Cpu, Network }, i) =>  {
    times.push(Time);
    Disks.forEach(d => {
      if (!diskData[d.Name]) diskData[d.Name] = {};
      diskData[d.Name][Time] = {
        available: d.Available,
        used: d.Used
      };
    });

    Network.forEach(n => {
      if (!networkData[n.Name]) networkData[n.Name] = {};
      networkData[n.Name][Time] = {
        bytesIn: n.BytesIn,
        bytesOut: n.BytesOut
      };
    });

    const networkNames = Object.keys(networkData);

    networkNames.forEach((networkName) => {
      times.forEach((t, c) => {
        const networkAtTime = networkData[networkName][t];
        const networkAtTimePre = c === 0 ? null : networkData[networkName][times[c - 1]];
        if (networkAtTimePre) {
          if (networkAtTime.bytesIn - networkAtTimePre.bytesIn < 0) {
            networkData[networkName][t] = {
              bytesIn: 'NA',
              bytesOut: 'NA'
            }
          }else{
            networkData[networkName][t] = {
              bytesIn : networkAtTime.bytesIn - networkAtTimePre.bytesIn,
              bytesOut : networkAtTime.bytesOut - networkAtTimePre.bytesOut
            }
          }
        } else {
          networkData[networkName][t] = {
            bytesIn: 'NA',
            bytesOut: 'NA'
          }
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

  resolve({diskData, memoryData, cpuData, networkData, times});
});

module.exports = (bucket, customerId, id, accessKeyId = null, secretAccessKey = null, region = null) => {
  const s3 = (accessKeyId && secretAccessKey && region) ? new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region
  }) :  new AWS.S3();

  return _listAllKeys(bucket, customerId, id, s3)
    .then(data => {
      return Promise.all(data.sort().map(key => new Promise((resolve, reject) => {
        s3.getObject({
          Bucket: bucket,
          Key: key
        }, (err, data) => {
          if (err) return reject(err);
          resolve(JSON.parse(zlib.inflateSync(data.Body).toString()));
        });
      })))
    })
    .then(data => {
      if (!data.length){
        console.log(`No data found for:\ncustomerId = ${customerId}\nid = ${id}`);
      } else{
        return _parseData(data);
      }
    });
};
