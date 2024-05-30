//view favorites

function viewFavorites() {
	//document.getElementById("favoritesButton").addEventListener("click", () => {
	  const userData = JSON.parse(localStorage.getItem("user"));
	  console.log(userData);
	  // alert(userData);
	  window.location.href = `favorites.html`;
	//});
  }
  
  //receiving input from search bar and fetching details from api based on search result
  
  document.getElementById("search_bar").addEventListener(
	"input",
  
	() => {
	  const search_val = document.getElementById("search_bar").value;
	  console.log(search_val);
  
	  if (search_val.length == 0) {
		document.getElementById("search_bar").innerHTML = "type something";
		return;
	  } else if (search_val.length > 1){
		fetch(
		  `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${search_val}&ts=1&apikey=195c5f9566b4d422dca13097eba98cce&hash=28efea7fc5829753ea47b26901938f4c`
		)
		  .then((res) => res.json()) //Converting the data into JSON format
  
		  .then((data) => display_details(data.data.results))
		  .catch(function (error) {
			return false;
		  });
	  }
	}
  );
  
  function display(id){
	window.location.href = `display_hero.html?id=${id}`;
  }
  //displaying details of all superheros retrieved by the fetch api call
  
  function display_details(characterData) {
	 console.log(characterData);
	const heroList = document.getElementById("list");
	heroList.innerHTML = "";
	const desObj = characterData.forEach((hero) => {
		console.log(hero.name);
	  const heroCard = document.createElement("div");
	  heroCard.className = "hero-card";
	  let userdetails = [{id:hero.id , name:hero.name ,img:`${hero.thumbnail.path}.${hero.thumbnail.extension}`}];
	  heroCard.innerHTML = `
			  <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}" height = "20px" width = "40px">
			  <h3>${hero.name}</h3>
			  <button id = "${hero.name}" onclick='display(${hero.id})'  className = "details"  > More details  </button>
			  <button id = "${hero.id}"  onclick='addtoFavorites(${JSON.stringify(userdetails)})'>Add to Favorites</button>`;
	  heroList.appendChild(heroCard);
  
	  //enabling and disabling favorites button depends upon whether added to favorites or not
  
	  const fetchFav = JSON.parse(localStorage.getItem("user")) || [];
	  // console.log(fetchFav);
	  for (let h of fetchFav) {
		// console.log(h[0]);
		if (h[0] == hero.id) {
		  document.getElementById(`${hero.id}`).disabled = true;
		}
	  }
  
	});
  }
  
  // Add to favorites

  
  function addtoFavorites(herodata) {
	let hero = herodata[0];

	document.getElementById(`${hero.id}`).disabled = true;
	const userArray = [
	  hero.id,
	  hero.name,
	  hero.img
	];
	let flag = false;
	console.log("userArray", userArray);

  
	let favList = JSON.parse(localStorage.getItem("user"));
	if (favList == null) {
	  favList = [];
	  // console.log("empty");
	  favList.push(userArray);
	}
	console.log("favlist = ", favList);
	favList.forEach(function (h) {
	  if (h[0] === hero.id) {
		flag = true;
		console.log(h[0], hero.name);
		return;
	  }
	});
	if (flag === false) favList.push(userArray);
  
	//on browser loading also ,favorites remians in localstorage
	localStorage.setItem("user", JSON.stringify(favList));
	console.log(favList);
	
  }
  
  //Add superHeros to homepage on loading of project
  window.onload = () => {
	fetch(
	  "https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=195c5f9566b4d422dca13097eba98cce&hash=28efea7fc5829753ea47b26901938f4c"
	)
	  .then((res) => {
		return res.json();
	  })
	  .then((fetchData) => {
		let characterData = fetchData.data.results;
		const heroList = document.getElementById("list");
		heroList.innerHTML = "";
		characterData.forEach((hero) => {
		  const heroCard = document.createElement("div");
		  heroCard.className = "hero-card";
		  heroCard.innerHTML = `
			  <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}" height = "20px" width = "40px">
			  <h3>${hero.name}</h3>`;
  
		  heroList.appendChild(heroCard);
		});
	  })
	  .then((error) => {
		console.log(error);
	  });
  };
  
  function removeFavorites(id) {
	let data = localStorage.getItem("user") || [];
	let hero_data = JSON.parse(data);
	let favorites = hero_data.filter((hero) => hero[0] !== id);
	// console.log(favorites);
	localStorage.setItem("user", JSON.stringify(favorites));
  
	window.location.href = `favorites.html?`;
  }
  