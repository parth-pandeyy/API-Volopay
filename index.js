// const fs = require('fs');
// const http = require('http');
// const url = require('url');
// const slugify = require('slugify');

// const server = http.createServer((req, res) => {
//   const data = fs.readFileSync(
//     `${__dirname}/volopaydata/volopaydata.json`,
//     'utf-8'
//   );
//   const objData = JSON.parse(data);

//   if (req.url == '/') {
//     res.end('hello');
//   } else if (req.url == '/volopaydata') {
//     res.writeHead(200, { 'content-type': 'application/json' });
//     res.end(objData[1].user);
//   } else {
//     res.writeHead(404, {
//       'content-type': 'text/html',
//       'my-own-header': 'hey-Volopaydata, parth this side',
//     });
//     res.end('<h1>page not found!</h1>');
//   }
// });

// server.listen(8000, '127.0.0.1', () => {
//   console.log('Listening the request on port 8000');
// });

const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

const server = http.createServer((req, res) => {
  const data = fs.readFileSync(
    `${__dirname}/volopaydata/volopaydata.json`,
    'utf-8'
  );
  const objData = JSON.parse(data);

  if (req.url == '/') {
    res.end('hello');
  } else if (req.url == '/volopaydata') {
    res.writeHead(200, { 'content-type': 'application/json' });

    //------------------------------------------------------------------------------
    // Api 1 condition:
    // const thirdQuarterSeats = objData.reduce((total, obj) => {
    //   const date = new Date(obj.date);
    //   const quarter = Math.floor(date.getMonth() / 3 + 1);

    //   if (quarter === 3) {
    //     return total + obj.seats;
    //   }

    //   return total;
    // }, 0);

    let thirdQuarterSeats = 0;

    objData.forEach((obj) => {
      const date = new Date(obj.date);
      const quarter = Math.floor((date.getMonth() + 3) / 3);
      const year = date.getFullYear();
      const department = obj.department && obj.department.toLowerCase();
      const seats = obj.seats || 0;

      if (quarter === 3 && year === 2022 && department === 'marketting') {
        thirdQuarterSeats += seats;
      }
    });
    //------------------------------------------------------------------------------
    // Api 2 condition:

    const softwareCounts = {};

    objData.forEach((obj) => {
      const date = new Date(obj.date);
      const quarter = Math.floor((date.getMonth() + 3) / 3);
      const year = date.getFullYear();
      const software = obj.software && obj.software.toLowerCase();

      if (quarter === 4 && year === 2022) {
        if (!softwareCounts.hasOwnProperty(software)) {
          softwareCounts[software] = 0;
        }

        softwareCounts[software]++;
      }
    });

    const sortedSoftware = Object.keys(softwareCounts).sort(
      (a, b) => softwareCounts[b] - softwareCounts[a]
    );
    const secondMostSoftware = sortedSoftware[1] || '';

    //--------------------------------------------------------------------

    const itemAmounts = {};

    objData.forEach((obj) => {
      const date = new Date(obj.date);
      const quarter = Math.floor((date.getMonth() + 3) / 3);
      const year = date.getFullYear();
      const amount = obj.amount;
      const item = obj.software && obj.software.toLowerCase();

      if (quarter === 2 && year === 2022) {
        if (!itemAmounts.hasOwnProperty(item)) {
          itemAmounts[item] = 0;
        }

        itemAmounts[item] += amount;
      }
    });

    const sortedItems = Object.keys(itemAmounts).sort(
      (a, b) => itemAmounts[b] - itemAmounts[a]
    );
    const fourthMostItem = sortedItems[3] || '';
    //-----------------------------------------------------------------------------------
    // Api 3 condition:

    const departmentWiseCounts = {};

    objData.forEach((obj) => {
      const department = obj.department;

      if (!departmentWiseCounts.hasOwnProperty(department)) {
        departmentWiseCounts[department] = 0;
      }

      departmentWiseCounts[department] += obj.seats || 0;
    });

    const totalSeats = Object.values(departmentWiseCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    const departmentWisePercentage = {};

    for (const department in departmentWiseCounts) {
      const seatsCount = departmentWiseCounts[department];
      const percentage = (seatsCount / totalSeats) * 100;
      departmentWisePercentage[department] = percentage.toFixed(2);
    }
    //------------------------------------------------------------------------------------------
    // Api 4 Condition:

    const monthlySales = {};

    objData.forEach((obj) => {
      const date = new Date(obj.date);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const software = obj.software && obj.software.toLowerCase();

      const key = `${year}-${month}`;

      if (!monthlySales.hasOwnProperty(key)) {
        monthlySales[key] = 0;
      }

      if (software === 'apple') {
        monthlySales[key] += obj.amount || 0;
      }
    });

    //---------------------------------------------------------------------------------------
    const responseData = {
      thirdQuarterSeats: thirdQuarterSeats,
      secondMostSoftware: secondMostSoftware,
      fourthMostItem: fourthMostItem,
      departmentWisePercentage: departmentWisePercentage,
      monthlySales: monthlySales,
    };
    res.end(JSON.stringify(responseData));
  } else {
    res.writeHead(404, {
      'content-type': 'text/html',
      'my-own-header': 'hey-Volopaydata, parth this side',
    });
    res.end('<h1>page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
