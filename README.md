# system-metrics-formatter
[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Dependency Status][dependencies-image]][dependencies-url] [![Gandalf Status][gandalf-image]][gandalf-url]

[npm-url]: https://www.npmjs.com/package/system-metrics-formatter
[npm-image]: http://img.shields.io/npm/v/system-metrics-formatter.svg?style=flat
[downloads-image]: https://img.shields.io/npm/dm/system-metrics-formatter.svg?style=flat-square
[dependencies-url]: href="https://david-dm.org/giowe/system-metrics-formatter
[dependencies-image]: https://david-dm.org/giowe/system-metrics-formatter.svg
[gandalf-url]: https://www.youtube.com/watch?v=Sagg08DrO5U
[gandalf-image]: http://img.shields.io/badge/gandalf-approved-61C6FF.svg

## What is System Metrics Formatter?
System Metrics Formatter is a lib that allows you to format [system-metrics-collector](https://www.npmjs.com/package/system-metrics-collector) data upload on a aws s3 bucket.
System Metrics Formatter is used by [metrics2xlsx](https://www.npmjs.com/package/metrics2xlsx) to create an xlsx file.

## Installation  
``$ npm install system-metrics-formatter``
## Usage example
```
const formatter = require('system-metrics-formatter')
formatter(...data)
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.log(error);
    });
```
## Data

The data array have to be structured like this : 
```
[{
	"Id": "web06",
	"Time": 1499929501000,
	"Cpu": {
		"Speed": [1999.999, 1999.999],
		"NumCpus": 2,
		"TotalCpuUsage": {
			"CpuName": "cpu",
			"User": 1461522481,
			"Nice": 5287,
			"System": 101455761,
			"Idle": 5934062111,
			"Iowait": 170328408,
			"Irq": 0,
			"Softirq": 12139205,
			"Steal": 0,
			"Guest": 0,
			"GuestNice": 0
		},
		"CpusUsage": [{
			"CpuName": "cpu0",
			"User": 716905051,
			"Nice": 2402,
			"System": 52929272,
			"Idle": 2980071702,
			"Iowait": 74224476,
			"Irq": 0,
			"Softirq": 8577366,
			"Steal": 0,
			"Guest": 0,
			"GuestNice": 0
		}, {
			"CpuName": "cpu1",
			"User": 744617429,
			"Nice": 2885,
			"System": 48526489,
			"Idle": 2953990408,
			"Iowait": 96103932,
			"Irq": 0,
			"Softirq": 3561838,
			"Steal": 0,
			"Guest": 0,
			"GuestNice": 0
		}]
	},
	"Memory": {
		"MemTotal": 8011084,
		"MemFree": 465108,
		"MemAvailable": 6211740
	},
	"Disks": [{
		"Name": "/dev/sda1",
		"MountPoint": "/",
		"Capacity": 53,
		"Used": 98937224,
		"Available": 87774652
	}, {
		"Name": "devtmpfs",
		"MountPoint": "/dev",
		"Capacity": 0,
		"Used": 0,
		"Available": 3987924
	}, {
		"Name": "tmpfs",
		"MountPoint": "/dev/shm",
		"Capacity": 0,
		"Used": 0,
		"Available": 4005540
	}, {
		"Name": "tmpfs",
		"MountPoint": "/run",
		"Capacity": 10,
		"Used": 395780,
		"Available": 3609760
	}, {
		"Name": "tmpfs",
		"MountPoint": "/sys/fs/cgroup",
		"Capacity": 0,
		"Used": 0,
		"Available": 4005540
	}, {
		"Name": "tmpfs",
		"MountPoint": "/run/user/0",
		"Capacity": 0,
		"Used": 0,
		"Available": 801112
	}, {
		"Name": "tmpfs",
		"MountPoint": "/run/user/1000",
		"Capacity": 0,
		"Used": 0,
		"Available": 801112
	}, {
		"Name": "tmpfs",
		"MountPoint": "/run/user/1001",
		"Capacity": 0,
		"Used": 0,
		"Available": 801112
	}, {
		"Name": "tmpfs",
		"MountPoint": "/run/user/995",
		"Capacity": 0,
		"Used": 0,
		"Available": 801112
	}],
	"Network": {
		"eth0": {
			"Name": "eth0",
			"BytesIn": 234834354229,
			"PacketsIn": 699261404,
			"BytesOut": 1625122903784,
			"PacketsOut": 1019711938
		},
		"lo": {
			"Name": "lo",
			"BytesIn": 1999836410540,
			"PacketsIn": 2876214756,
			"BytesOut": 1999836410540,
			"PacketsOut": 2876214756
		}
	}
}, {
	"Id": "web06",
	"Time": 1499929801000,
	"Cpu": {
		"Speed": [1999.999, 1999.999],
		"NumCpus": 2,
		"TotalCpuUsage": {
			"CpuName": "cpu",
			"User": 1461533775,
			"Nice": 5287,
			"System": 101457201,
			"Idle": 5934104489,
			"Iowait": 170328732,
			"Irq": 0,
			"Softirq": 12139354,
			"Steal": 0,
			"Guest": 0,
			"GuestNice": 0
		},
		"CpusUsage": [{
			"CpuName": "cpu0",
			"User": 716910367,
			"Nice": 2402,
			"System": 52930047,
			"Idle": 2980092964,
			"Iowait": 74224676,
			"Irq": 0,
			"Softirq": 8577465,
			"Steal": 0,
			"Guest": 0,
			"GuestNice": 0
		}, {
			"CpuName": "cpu1",
			"User": 744623407,
			"Nice": 2885,
			"System": 48527154,
			"Idle": 2954011524,
			"Iowait": 96104056,
			"Irq": 0,
			"Softirq": 3561888,
			"Steal": 0,
			"Guest": 0,
			"GuestNice": 0
		}]
	},
	"Memory": {
		"MemTotal": 8011084,
		"MemFree": 532256,
		"MemAvailable": 6282388
	},
	"Disks": [{
		"Name": "/dev/sda1",
		"MountPoint": "/",
		"Capacity": 53,
		"Used": 98937400,
		"Available": 87774476
	}, {
		"Name": "devtmpfs",
		"MountPoint": "/dev",
		"Capacity": 0,
		"Used": 0,
		"Available": 3987924
	}, {
		"Name": "tmpfs",
		"MountPoint": "/dev/shm",
		"Capacity": 0,
		"Used": 0,
		"Available": 4005540
	}, {
		"Name": "tmpfs",
		"MountPoint": "/run",
		"Capacity": 10,
		"Used": 395780,
		"Available": 3609760
	}, {
		"Name": "tmpfs",
		"MountPoint": "/sys/fs/cgroup",
		"Capacity": 0,
		"Used": 0,
		"Available": 4005540
	}, {
		"Name": "tmpfs",
		"MountPoint": "/run/user/0",
		"Capacity": 0,
		"Used": 0,
		"Available": 801112
	}, {
		"Name": "tmpfs",
		"MountPoint": "/run/user/1000",
		"Capacity": 0,
		"Used": 0,
		"Available": 801112
	}, {
		"Name": "tmpfs",
		"MountPoint": "/run/user/1001",
		"Capacity": 0,
		"Used": 0,
		"Available": 801112
	}, {
		"Name": "tmpfs",
		"MountPoint": "/run/user/995",
		"Capacity": 0,
		"Used": 0,
		"Available": 801112
	}],
	"Network": {
		"eth0": {
			"Name": "eth0",
			"BytesIn": 234834677342,
			"PacketsIn": 699264901,
			"BytesOut": 1625127176975,
			"PacketsOut": 1019715548
		},
		"lo": {
			"Name": "lo",
			"BytesIn": 1999836419636,
			"PacketsIn": 2876214872,
			"BytesOut": 1999836419636,
			"PacketsOut": 2876214872
		}
	}
}]
```
and will return an array like this one:
```
[{
	"time": 1499928001000,
	"diskData": {
		"/dev/sda1": {
			"available": 87775416,
			"used": 98936460
		},
		"devtmpfs": {
			"available": 3987924,
			"used": 0
		},
		"tmpfs": {
			"available": 801112,
			"used": 0
		}
	},
	"memoryData": {
		"percentage": 0.9275204204574562
	},
	"cpuData": 0.18587263411063473,
	"networkData": {
		"eth0": {
			"bytesIn": 159174,
			"bytesOut": 1285706
		},
		"lo": {
			"bytesIn": 3812,
			"bytesOut": 3812
		}
	}
}, {
	"time": 1499928301000,
	"diskData": {
		"/dev/sda1": {
			"available": 87775244,
			"used": 98936632
		},
		"devtmpfs": {
			"available": 3987924,
			"used": 0
		},
		"tmpfs": {
			"available": 801112,
			"used": 0
		}
	},
	"memoryData": {
		"percentage": 0.931590780972962
	},
	"cpuData": 0.21451745160255267,
	"networkData": {
		"eth0": {
			"bytesIn": 424772,
			"bytesOut": 1246994
		},
		"lo": {
			"bytesIn": 4324,
			"bytesOut": 4324
		}
	}
}]
```
