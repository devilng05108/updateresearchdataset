// var link =
//   'https://api.github.com/repositories/ID/contributors?per_page=1&page=2; rel="next", https://api.github.com/repositories/ID/contributors?per_page=1&page=XXXXXXXX; rel="last"';
var link2 =
  '<https://api.github.com/repositories/63557/contributors?per_page=1&page=2>; rel="next", <https://api.github.com/repositories/63557/contributors?per_page=1&page=14>; rel="last"';
// const arr = link.split(';');
// console.log(arr[1]);

// const arr2 = arr[1].split("&page=");
// console.log(arr2[1]);

let x = link2.split(';')[1].split('&page=')[1];
console.log("link is",x);




// import fetch from 'node-fetch';

// const getRepoData = (repoID) => {
//   let apiUrl = 'https://api.github.com/repositories/' + repoID;
//   fetch(apiUrl, {
//     method: 'GET',
//     headers: {
//       Authorization: `token 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 `,
//     },
//   })
//     .then((response) => response.json())
//     .then((res) => {
//       console.log(res);
//     })
//     .catch((err) => console.log(err));
// };

// getRepoData(48296);