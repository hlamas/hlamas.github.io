
let allowedtime_ms;
let nbrofplayers;

let activeplayer = NaN;
let upnext = 0;

let starts = new Array();
let stops = new Array();

let intervalID;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ"

for (let ah = 0; ah <=8; ah++){ 
	const newOption = document.createElement("option")
	newOption.value = ah
	const newText = document.createTextNode(""+ah+" h");
	newOption.appendChild(newText);
	document.querySelector("#h-select").appendChild(newOption)
}

for (let am = 0; am <=59; am++){ 
	const newOption = document.createElement("option")
	newOption.value = am
	const newText = document.createTextNode(""+am+" m");
	newOption.appendChild(newText);
	document.querySelector("#m-select").appendChild(newOption)
}

function newgame() {
	modal.style.display = "none";
  	//btn.style.display = "block";

	const dstart = new Date()
	let starttime = dstart.getTime()

	nbrofplayers = document.querySelector("#nplayers-select").value

	allowedtime_ms = (document.querySelector("#h-select").value*60*60 + document.querySelector("#m-select").value*60)*1000

	starts = new Array(nbrofplayers)
	stops = new Array(nbrofplayers)

	//erase all old timer divs
	document.querySelectorAll(".timerdisplay").forEach(element => element.remove());

	for (let pind = 0; pind < nbrofplayers; pind++){
		starts[pind] = new Array()
		stops[pind] = new Array()

		const newDiv = document.createElement("div")
		// and give it some content
  		const newContent = document.createTextNode("UNSET");

		newDiv.classList.add("timerdisplay")
		newDiv.id = "td"+pind

  		// add the text node to the newly created div
  		newDiv.appendChild(newContent);

  		// add the newly created element and its content into the DOM
  		const targetDiv = document.getElementById("timers");
  		targetDiv.appendChild(newDiv);
	
	}

	activeplayer=0;
	starts[activeplayer].push(starttime)

	clearInterval(intervalID)
	intervalID = setInterval(() => {
  		refresh()
		}, 1000);

	refresh();
}


function refresh() {
  for (let pind = 0; pind < nbrofplayers; pind++){
	const tdisp = document.querySelector("#td"+pind)
	tdisp.classList.remove(...["activeplayer", "nextplayer"]);
	const remainingtime = allowedtime_ms - elapsedtime_ms(pind);
	const plabel = alphabet[pind]
	tdisp.innerHTML = plabel + "&nbsp" + (remainingtime < 0 ? "-" : "&nbsp") + (new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC', hourCycle: 'h23'}).format(new Date(Math.abs(remainingtime))))
	tdisp.classList.toggle("overdue", remainingtime < 0 )
  }
  if (!isNaN(activeplayer)){
    document.querySelector("#td"+activeplayer).classList.add("activeplayer")
  }else{
    document.querySelector("#td"+upnext).classList.add("nextplayer")
  }
}

function passturn(){
  let d = new Date()
  let thetime = d.getTime()
  stops[activeplayer].push(thetime)
  activeplayer = (activeplayer + 1)%nbrofplayers
  starts[activeplayer].push(thetime)
  refresh();
}

function elapsedtime_ms(theplayer){  // ms
	let isactive = false
	let d = new Date()
	let elapsedtotal = 0;
	for (let i = 0; i < starts[theplayer].length; i++){
		if ( i == stops[theplayer].length ) {  // active player
			isactive = true
			break;
		} else {
			elapsedtotal = elapsedtotal + ( stops[theplayer][i] - starts[theplayer][i] )
		}
	}
	if ( isactive && ( theplayer != activeplayer ) ) {
		console.log("Fatal error: Active Assertion failed")
	}
	return elapsedtotal + ( isactive ? d.getTime() - starts[activeplayer][starts[activeplayer].length - 1] : 0 )
	// no refresh, since this is a non-writing function.
}

//Modal menu
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("menuBtn");

// Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  console.log("Opening modal..") //DEBUG
  modal.style.display = "flex";
  //btn.style.display = "none";
  
  //pause.
  if (!isNaN(activeplayer)){
    let d = new Date()
    let thetime = d.getTime()
    stops[activeplayer].push(thetime);
    upnext = activeplayer;
    activeplayer = NaN;
  }
  refresh();
}

function closeandresume(){
  console.log("closing modal and resuming game..") //DEBUG
  //resume
  if (isNaN(activeplayer)){
      activeplayer = upnext;
      let d = new Date()
      let thetime = d.getTime()
      starts[activeplayer].push(thetime)
  }
  //close modal
  modal.style.display = "none";
  //btn.style.display = "block";
  refresh()
}

// When the user clicks anywhere outside of the modal(interfaces), close it
document.addEventListener('pointerup', (event) => {
if (event.target == modal) {
  //event.stopImmediatePropagation(); //TODO: no effect?
  closeandresume();
}
}, true);


// Register service worker to control making site work offline

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('sw.js')
    .then(() => { console.log('Service Worker Registered'); });
}

