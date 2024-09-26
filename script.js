// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add fade-in effect to sections on scroll
const sections = document.querySelectorAll('.full-height-section');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.intersectionRatio >= 0.5) {
            entry.target.classList.add('visible');
        } /*else {
            entry.target.classList.remove('visible');
        }*/
    });
}, { threshold: 0.5 }); // Changed from 0.1 to 0.5

sections.forEach(section => observer.observe(section));
var projects = [["Never Isometric Engine","It is currently under development...","bild-icon.png"],
		["Never RPG 1","Also currently under development ...","bild-icon.png"]
			]
var notifications = [["Planned: Never World","An infinite ai generated world."],
		     ["Working on: Never RPG","A pixel rpg with currently limited access."],
		     ["Working on: Never Isometric Engine","The engine behind Never RPG. <br> It will be public and free to use. <br> Coming soon!"]
		   ]
					

function breaks(text){
	if(text.match(/<br>/g) != null){
		return (text.match(/<br>/g)).length
	}else{
		return 0
	}
	
}

function adjustContainers(){
	if (navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/iPad/i)
         || navigator.userAgent.match(/iPod/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i)){
		var notContainer =	document.getElementById("notification-container")	
		notContainer.innerHTML = ""		
		let cost = 0;
		let i = 0;
		while(window.innerHeight-350>cost){
			if(i<notifications.length){
				notContainer.innerHTML += `<div class="notification-item"><h3>${notifications[i][0]}</h3>  ${notifications[i][1]} </div>`
				cost += 270*(breaks(notifications[i][0])+2+breaks(notifications[i][1]))
			}else{break;}
			i++;
		}
		
		var projDiv = document.getElementById("work-grid")
		projDiv.innerHTML = ""
		for(let i=0; i< Math.min((window.innerHeight-400)/450,projects.length); i++){
			projDiv.innerHTML += `<div class="work-item"><div><h3> ${projects[i][0]} </h3> ${projects[i][1]} </div><img src="${projects[i][2]}" alt="Project 1"></div>`;
		}
		
	}else{
		var notContainer =	document.getElementById("notification-container")	
		notContainer.innerHTML = ""		
		let cost = 0;
		let i = 0;
		while(window.innerHeight-350>cost){
			if(i<notifications.length){
				notContainer.innerHTML += `<div class="notification-item"><h3>${notifications[i][0]}</h3>  ${notifications[i][1]} </div>`
				cost += 100*(breaks(notifications[i][0])+2+breaks(notifications[i][1]))
			}else{break;}
			i++;
		}
		
		var projDiv = document.getElementById("work-grid")
		projDiv.innerHTML = ""
		for(let i=0; i< Math.min((window.innerHeight-400)/210,projects.length); i++){
			projDiv.innerHTML += `<div class="work-item"><div><h3> ${projects[i][0]} </h3> ${projects[i][1]} </div><img src="${projects[i][2]}" alt="Project 1"></div>`;
		}
	}
}


// Adjust viewport height for mobile devices
function adjustViewportHeight() {
	adjustContainers()
	const vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', adjustViewportHeight);
adjustViewportHeight();

document.getElementById('scroll-down-arrow').addEventListener('click', function() {
    const nextSection = document.querySelector('#description-section');
    nextSection.scrollIntoView({ behavior: 'smooth' });
});
