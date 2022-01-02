import fetch from 'node-fetch';
import xlsx from 'xlsx';


// const getRepoData = (repoID) =>{
//   let apiUrl ='https://api.github.com/repositories/'+repoID;
//   fetch(apiUrl)
//     .then((response) => response.json())
//     .then((res) => {
//     })
//     .catch((err) => console.log(err));
// }
// const getRepoContributorsCount = (repoID) =>{
//   let apiUrl =
//     'https://api.github.com/repositories/' +
//     repoID +
//     '/contributors?per_page=1&anon=true';

//    fetch(apiUrl).then((response) => {
//       x = response.headers.get('link');
//     })
//     .then(res=>{
//     });

// }
// var workbook = xlsx.readFile("dataset/initial_repo_ids.xlsx");
// var workbook = xlsx.readFile("dataset/test.xlsx");
var workbook = xlsx.readFile("dataset/merged_data_refer.xlsx");
// console.log(workbook);
let worksheet = workbook.Sheets[workbook.SheetNames[0]];
var range = xlsx.utils.decode_range(worksheet['!ref']);

//get total number of rows 
var num_rows_with_title = range.e.r - range.s.r + 1;
var num_rows = num_rows_with_title-1;
console.log(num_rows);


//Write to file
// var data = xlsx.utils.sheet_to_json(worksheet);
var repos = xlsx.utils.sheet_to_json(worksheet);


Promise.all(
  repos.map(
    (repo) =>
      new Promise(async (resolve, reject) => {
        console.log("repo id is"+repo.repo_id);
        if(repo.size){
          console.log('got size');
          resolve();
        }else{
          let site = `https://api.github.com/repositories/${repo.repo_id}`,
            response = await fetch(site, {
              method: 'GET',
              headers: {
                Authorization: `token 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`,
              },
            }),
            data = await response.json();
            console.log(data);
                    repo.created_at = data.created_at;
                    repo.pushed_at = data.pushed_at;
                    repo.full_name = data.full_name;
                    repo.html_url = data.html_url;
                    repo.api_url = data.url;
        repo.primary_language = data.language;
        repo.description = data.description;
        repo.size = data.size;
        repo.stars = data.stargazers_count;
        resolve();
        }
        // let site = `https://api.github.com/repositories/${repo.repo_id}`,
        //   response = await fetch(site, {
        //     method: 'GET',
        //     headers: {
        //       Authorization: `token `,
        //     },
        //   }),
        //   data = await response.json();

        // let site2 = `https://api.github.com/repositories/${repo.repo_id}/contributors?per_page=1`,
        //   response2 = await fetch(site2, {
        //     method: 'GET',
        //     headers: {
        //       Authorization: `token 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 `,
        //     },
        //   });
        //   let link = response2.headers.get('link');
        //   let data2 = await response2.json();

        // let contributors = link.split(';')[1].split('&page=')[1].split('>')[0];
        // let contributors =
        //   link == null
        //     ? data2.message
        //     : link.split(';')[1].split('&page=')[1].split('>')[0];


        // repo.primary_language = data.language;
        // repo.description = data.description;
        // repo.size = data.size;
        // repo.stars = data.stargazers_count;
        // repo.contributors_without_anonymous = contributors;
        // repo.created_at = data.created_at;
        // repo.pushed_at = data.pushed_at;
        // repo.full_name = data.full_name;
        // repo.html_url = data.html_url;
        // repo.api_url = data.url;
        // resolve();
      })
  )
).then(() => {
  console.log(repos.length);
  console.log('repos[1].description = ', repos[1].description);
  var newWB = xlsx.utils.book_new();
  var newWS = xlsx.utils.json_to_sheet(repos);
  xlsx.utils.book_append_sheet(newWB, newWS, 'New data');
  xlsx.writeFile(newWB, 'dataset/new/New Data File.xlsx');
});
