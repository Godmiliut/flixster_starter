
//Secret Password
const aKey = "20531a98c40e022d71051e8213aa4957";

//Global Variables
var searchWord = "";
var page = 1;

//DOM Elements
const sForm = document.getElementById("search-form");
const nPlayingLabel = document.querySelector(".now-playing");
const mGrid = document.getElementById("movies-grid");
const mButton = document.getElementById("load-more-movies-btn");
const cButton = document.getElementById("close-search-btn");

/*  Called upon page load and @cButton click
    Returns json file containing Now Playing movies  
*/
async function getNPResults(){
    cButton.classList.add("hidden");
    let aUrl = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + aKey + "&language=en-US&page=" + page;
    const response = await fetch(aUrl);
    const jsonResponse = await response.json();
    return jsonResponse;
}

/*  Called upon form submission
    returns json file containing movies associated with the search word obtained
    @@word search word to be used as a query
*/
async function getResults(word){
    let aUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + aKey + "&language=en-US&query=" + word + "&page=" + page + "&include_adult=false";
    const response = await fetch(aUrl);
    const jsonResponse = await response.json();
    return jsonResponse;
}


/*  Retrieves a json file as a paremeter and injects the desired info from the movies into the @mGird
    @@mData jsonFile to be iterated through
*/
function generateHTML(mData){
    for(let i = 0; i < mData.results.length; i++ ){
        let pUrl = "https://image.tmdb.org/t/p/w500" + mData.results[i].poster_path;
        if(mData.results[i].poster_path == null){
            pUrl = "no_poster.png";
        }
        let mID = mData.results[i].id;
        let vUrl = mData.results[i].vote_average;
        let tUrl = mData.results[i].title;
        mGrid.innerHTML += ' <div class= "movie-card"><img class= "movie-poster" id= "'+mID+'" src= "'+pUrl+'" alt= "'+tUrl+'"></img><h3 class= "movie-votes">⭐ '+vUrl+'</h3><h3 class= "movie-title">'+tUrl+'</h3></div>'
    }
}

//  Calls the getNPResults function and displays the Now Playing movies
async function handleNP(){
    mGrid.innerHTML = '';
    searchWord = '';
    page = 1;
    const mResults = await getNPResults();
    generateHTML(mResults);
    nPlayingLabel.classList.remove("hidden");
}

cButton.addEventListener("click", handleNP);

/*  Calls the getResults function and displays the movies associated with the word submitted
    resets the @page value to 1 and displays the @nplayingLabel and the @cButton
    @@evt accepts the event that triggered it as a parameter
*/
async function handleForm(evt){
    evt.preventDefault();
    page = 1;
    mGrid.innerHTML = '';
    searchWord = evt.target.sWord.value.toLowerCase();
    const mResults = await getResults(searchWord);
    generateHTML(mResults);
    evt.target.sWord.value = '';
    nPlayingLabel.classList.add("hidden");
    cButton.classList.remove("hidden");
}

sForm.addEventListener("submit",handleForm);

// Injects more movies to the @mGrid by calling getResults or getNPResults with an updated @page value.
async function handleShowMore(evt){
    page++;
    let mResults = '';
    console.log(searchWord);
    if(searchWord != ""){
        mResults = await getResults(searchWord);
    }
    else{
        mResults = await getNPResults();
    }
    generateHTML(mResults);
}

mButton.addEventListener("click", handleShowMore);

//display the Now Playing movies upon load.
window.onload = handleNP();