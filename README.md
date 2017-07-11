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
System Metrics Formatter is a lib that allows you to format [system-metrics-collector](https://www.npmjs.com/package/system-metrics-formatter) data upload on a aws s3 bucket.
System Metrics Formatter is used by [metrics2xlsx](https://www.npmjs.com/package/metrics2xlsx) to create an xlsx file.

## Installation  
``$ npm install system-metrics-formatter``
## Usage example
```js
#!/usr/bin/env node
const formatter = require('system-metrics-formatter');
formatter('bucketName', 'customerId', 'id')
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.log(error);
    });
```
## Arguments
`Bucket name`     (string): It's used to set s3 bucket name

`Customer Id`     (string): It's a unique identifier used to identify each customer (example: Mario_Rossi)

`Id`              (string): It's an unique identifier used to identify each customer's computer (example: computer_1)

`accessKeyId`     (string): It's used to set aws access key id (optional)

`secretAccessKey` (string): It's used to set aws secret access key (optional)

`region`          (string): It's used to set aws region (optional)
