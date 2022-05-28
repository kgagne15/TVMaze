/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */

const MISSING_IMG_SRC = "https://tinyurl.com/tv-missing"; 

async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.

  const res = await axios.get('http://api.tvmaze.com/search/shows', {params: {q: query}})
  let length = res.data.length; 
  let results = []
  console.log(res)



  for (let i = 0; i < length; i++){
    
    
    results.push(
      {
        id: res.data[i].show.id,
        name: res.data[i].show.name,
        summary: res.data[i].show.summary,
        image: res.data[i].show.image ? res.data[i].show.image.medium : MISSING_IMG_SRC
      }
    )
  }
  return results; 
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  
  console.log('shows', shows)

  for (let show of shows) {
      
      let $item = $(
        `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
           <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
  
             <div class="card-body">
               <h5 class="card-title">${show.name}</h5>
               <p class="card-text">${show.summary}</p>
               <button class="btn btn-primary get-episodes">Episodes</button>
             </div>
           </div>
         </div>
        `);
        
        $showsList.append($item);
        

    
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  console.log('episode result', res); 
  // TODO: return array-of-episode-info, as described in docstring above
  // let epResults = []; 
  // for (let i = 0; i < res.data.length; i++){
  //   epResults.push(
  //     {
  //       id: res.data[i].id,
  //       name: res.data[i].name,
  //       summary: res.data[i].season,
  //       number: res.data[i].number
  //     }
  //   )
  // }
  // console.log(epResults)
  // return epResults; 

  let episodes = res.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));

  return episodes;
}


function populateEpisodes(episodeList){
  const $epList = $('#episodes-list'); 
  $epList.empty(); 

  for (let episode of episodeList){
    let $item = $(`
      <li>
        ${episode.name} (season ${episode.season}, episode ${episode.number})
      </li>
    `)

    $epList.append($item); 
  }

  $('#episodes-area').show(); 
}

$('#shows-list').on('click', '.get-episodes', async function handleEpisodeClick(evt){
  // console.log($(evt.target).closest('.Show').data('showId'));
  let showId = $(evt.target).closest('.Show').data('show-id');
  //console.log(showId);
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
})

// $("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(evt) {
//   let showId = $(evt.target).closest(".Show").data("show-id");
//   let episodes = await getEpisodes(showId);
//   populateEpisodes(episodes);
// });