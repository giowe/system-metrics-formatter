'use strict';

const AWS = require('aws-sdk');
const path =require('path');
const fs = require('fs');
const zlib = require('zlib');

const _listAllKeys = (out = []) => new Promise((resolve, reject) => {
  s3.listObjectsV2({
    Bucket: config.bucket,
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

_listAllKeys()
  .then(data => {
    Promise.all(data.sort().map(key => new Promise((resolve, reject) => {
      s3.getObject({
        Bucket: config.bucket,
        Key: key
      }, (err, data) => {
        if (err) return reject(err);
        resolve(JSON.parse(zlib.inflateSync(data.Body).toString()));
      });
    })))
      .then(data => {
        if (!data.length) console.log(`No data found for:\ncustomerId = ${customerId}\nid = ${id}`);
        else saveXlsx(data);
      })
      .catch(err => {
        console.log(err);
      });
  })
  .catch(err => {
    console.log(err);
  });



module.exports = (bucket, accessKeyId = null, secretAccessKey = null, region = null) => {
    const s3 = new AWS.S3({
        accessKeyId,
        secretAccessKey,
        region
    });

    const times = [];
    const diskData = {};
    const memoryData = {};
    const cpuData = {};
    const networkData = {};

    //TODO get data from s3
    const data = {};

    data.forEach(({ Time, Disks, Memory, Cpu, Network }, i)=> {
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

        const memoryUtilization = Memory.MemTotal - Memory.MemFree;
        memoryData[Time] = {
            memoryUtilization,
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
};
