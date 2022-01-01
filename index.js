import fetch from 'node-fetch';
import xlsx from 'xlsx';

  // fetch('https://api.github.com/repos/mojombo/grit/contributors?per_page=1')
  //   .then((response) => response.json())
  //   .then((res) => {
  //     console.log(res);
  //   })
  //   .catch((err) => console.log(err));
var arr = [];
const getRepoData = (repoID) =>{
  let apiUrl ='https://api.github.com/repositories/'+repoID;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((res) => {

      var obj = {
        size: 'x',
      }
      arr.push(obj);
      // return 'hi';
      // return res.message;
    })
    .catch((err) => console.log(err));
}
var global = '';
const getRepoContributorsCount = (repoID) =>{
  let apiUrl =
    'https://api.github.com/repositories/' +
    repoID +
    '/contributors?per_page=1&anon=true';

   fetch(apiUrl).then((response) => {
      x = response.headers.get('link');
    })
    .then(res=>{
    });

}
var workbook = xlsx.readFile("dataset/initial_repo_ids.xlsx");
// console.log(workbook);
let worksheet = workbook.Sheets[workbook.SheetNames[0]];
// for(let i=2;i<7;i++){
// const id = worksheet[`A${i}`].v;
// const name = worksheet[`B${i}`].v;
// console.log({
//   id:id,name:name
// })
// }
var address_of_cell = 'A2';
var value_of_desired_cell = worksheet[address_of_cell].v;
var range = xlsx.utils.decode_range(worksheet['!ref']);

//get total number of rows 
var num_rows_with_title = range.e.r - range.s.r + 1;
var num_rows = num_rows_with_title-1;
console.log(num_rows);

for(let index =1; index<=num_rows ; index++){
  getRepoData(worksheet['A'+(index+1)].v);
}
console.log(value_of_desired_cell);
console.log(num_rows);

//Write to file
// var data = xlsx.utils.sheet_to_json(worksheet);
var repos = xlsx.utils.sheet_to_json(worksheet);


Promise.all(
  repos.map(
    (repo) =>
      new Promise(async (resolve, reject) => {
        console.log("repo id is"+repo.repo_id);
        // let site = `https://api.github.com/repositories/${repo.repo_id}`,
        //   response = await fetch(site, {
        //     method: 'GET',
        //     headers: {
        //       Authorization: `token `,
        //     },
        //   }),
        //   data = await response.json();

        let site2 = `https://api.github.com/repositories/${repo.repo_id}/contributors?per_page=1`,
          response2 = await fetch(site2, {
            method: 'GET',
            headers: {
              Authorization: `token `,
            },
          });
          let link = response2.headers.get('link');
          // console.log("header link is "+link);
          let data2 = await response2.json();

        // let contributors = link.split(';')[1].split('&page=')[1].split('>')[0];
        let contributors =
          link == null
            ? data2.message
            : link.split(';')[1].split('&page=')[1].split('>')[0];
        // repo.primary_language = data.language;
        // repo.description = data.description;
        // repo.size = data.size;
        // repo.stars = data.stargazers_count;
        repo.contributors_without_anonymous = contributors;
        // repo.created_at = data.created_at;
        // repo.pushed_at = data.pushed_at;
        // repo.full_name = data.full_name;
        // repo.html_url = data.html_url;
        // repo.api_url = data.url;
        // console.log("Got description = ", location.description)
        resolve();
      })
  )
).then(() => {
  console.log(repos.length);
  var newWB = xlsx.utils.book_new();
  var newWS = xlsx.utils.json_to_sheet(repos);
  xlsx.utils.book_append_sheet(newWB, newWS, 'New data');
  xlsx.writeFile(newWB, 'dataset/new/New Data File.xlsx');
});



// var newData = data.map(async record=>{
//   record.Second = "hi";
//   record.WHy = getRepoData(record.repoID);
    
//   return record;
// });
// var newData = newDataPromise.then(res=>{
//   console.log(res);
// })
// console.log(newDataPromise);
// var newData = data.map(async record=>{
//   record.Second = "hi";
//   getRepoData(record.repoID);
//   record.Test=global;
    
//   return record;
// });
// console.log(newData);
// console.log(arr);
// var newWB = xlsx.utils.book_new();
// // var newWS = xlsx.utils.json_to_sheet(newData);
// var newWS = xlsx.utils.json_to_sheet(locations);
// xlsx.utils.book_append_sheet(newWB,newWS,"New data");
// xlsx.writeFile(newWB,"dataset/new/New Data File.xlsx");
// worksheet['B2'].v ='test';
// xlsx.writeFile(spreadsheet,"dataset/text.xlsx");

  // fetch(
  //   'https://api.github.com/repos/mojombo/grit/contributors?per_page=1'
  // ).then((response) => console.log(response.headers.get('link')));
  // fetch(
  //   'https://api.github.com/repos/mojombo/grit/contributors?per_page=1&anon=true'
  // ).then((response) => console.log(response.headers.get('link')));

  //Start function to get contributors count
  //============================================
  // fetch(
  //   'https://api.github.com/repositories/1/contributors?per_page=1&anon=true'
  // ).then((response) => {
  //   let link = response.headers.get('link');
  //   console.log(link);
  // });
  // ============================================
  //End function to get contributors count
