
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
const pContainer = document.querySelector(".popup-container");
const pop = document.querySelector(".popup");
const pCButton = document.getElementById("close-popup");

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

/*  Called upon any movie's click
    returns json file containing the details associated with the movie's ID
    @@id ID of the movie that was clicked.
*/
async function getDetails(id){
    let dUrl = "https://api.themoviedb.org/3/movie/" + id + "?api_key=" + aKey + "&language=en-US";
    const response = await fetch(dUrl);
    const jsonResponse = await response.json();
    return jsonResponse; 
}

/*  Retrieves a json file as a paremeter and injects the desired info from the movies into the @mGird
    @@mData jsonFile to be iterated through
*/
function generateHTML(mData){
    if(mData.results < 1){
        mButton.classList.add("hidden");
    }
    else{
        mButton.classList.remove("hidden");
    }
    for(let i = 0; i < mData.results.length; i++ ){
        let pUrl = "https://image.tmdb.org/t/p/w500" + mData.results[i].poster_path;
        if(mData.results[i].poster_path == null){
            pUrl = "no_poster.png";
        }
        let mID = mData.results[i].id;
        let vUrl = mData.results[i].vote_average;
        let tUrl = mData.results[i].title;
        mGrid.innerHTML += ' <div class= "movie-card"><img class= "movie-poster" onclick = "handlePopup('+mID+')" src= "'+pUrl+'" alt= "'+tUrl+'"></img><h3 class= "movie-votes">⭐ '+vUrl+'</h3><h2 class= "movie-title">'+tUrl+'</h2></div>'
    }
}

/*  Retrieves a json file as a parameter and injects the selected movie's details into @pop
    @@dData jsonFile containing the movie's details
*/
function generateDetails(dData){
    pop.innerHTML = ''
    if(dData.backdrop_path == null){
        pop.innerHTML += '<h3>Oops! No Details Found</h3>'
    }
    else{
        let pUrl = "https://image.tmdb.org/t/p/w500" + dData.backdrop_path;
        let mGenre = dData.genres[0].name;
        for(let i= 1; i < dData.genres.length; i++){
            mGenre += ", " + dData.genres[i].name;
        }
        pop.innerHTML += ' <div class = "details-card"><img class= "backdrop-poster" src= "'+pUrl+'" alt= "Backdrop Poster"></img><h3 id= "details-title">'+dData.original_title+'</h3><p>'+dData.runtime+' minutes | '+dData.release_date+' | '+mGenre+' | ⭐ '+dData.vote_average+'</p><p>'+dData.overview+'</p></div>'
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

async function handlePopup(id){
    const dResults = await getDetails(id);
    generateDetails(dResults);
    pContainer.classList.add("show");
}

pCButton.addEventListener("click", () => {
    pContainer.classList.remove("show");
})

//display the Now Playing movies upon load.
window.onload = handleNP();