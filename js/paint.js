function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function json(response) {
  return response.json()
}

const canvas = document.querySelector('.canvas');
const citation = document.querySelector('#citation');
const license = document.querySelector('#license');
const dot = document.querySelectorAll('.dot');

let paintColour = 'rgb(136, 27, 230, 0.1)';

const purpleDot = document.querySelector('#purple');
const orangeDot = document.querySelector('#orange');
const greyDot = document.querySelector('#grey');
const greenDot = document.querySelector('#green');

purpleDot.addEventListener('click', () => {
	paintColour = 'rgb(136, 27, 230, 0.1)';
	console.log(paintColour);
	drawOnMe();
	}
);

orangeDot.addEventListener('click', () => {
	paintColour = 'rgb(245, 124, 3, 0.1)';
	console.log(paintColour);
	drawOnMe();
	}
);

greyDot.addEventListener('click', () => {
	paintColour = 'rgb(200, 196, 203, 0.1)';
	console.log(paintColour);
	drawOnMe();
	}
);

greenDot.addEventListener('click', () => {
	paintColour = 'rgb(98, 222, 7, 0.1)';
	console.log(paintColour);
	drawOnMe();
	}
);

fetch('https://api.wellcomecollection.org/catalogue/v2/works?workType=k%2Cq&query=%22Engravings.%22%20skeleton&pageSize=100&include=items')
  .then(status)
  .then(json)
  .then(function(data) {
    console.log('Request succeeded with JSON response', data);
	const items = data.results;
	
	let itemsWithImages = [];
	
	items.forEach(function(item) {
		if (item.hasOwnProperty('thumbnail')) {
//			console.log('has an image')
			itemsWithImages.push(item);
		} else {
//			console.log('no image')
		}
	})
	
	// get random number in range of itemsWithImages
	function getRandomNumInRange(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
		}
	
	let itemNum = getRandomNumInRange(0,itemsWithImages.length);
	let item = itemsWithImages[itemNum];
	let thumbnailUrl = item.thumbnail.url; 
	let splitUrl = thumbnailUrl.split('.jpg');
	let imgWidth = canvas.clientWidth - 20;
	let requestUrl = `${splitUrl[0]}.jpg/full/${imgWidth},/0/default.jpg` ;
	
	canvas.innerHTML = `<img src="${requestUrl}"><canvas id="draw"></canvas>`;
	citation.innerHTML = `<p>${item.title}</p><p><a href="https://wellcomecollection.org/works/${item.id}" target="_blank">${item.citeAs}</a></p>`;
	license.innerHTML = `License: <a href="${item.thumbnail.license.url}" target="_blank">${item.thumbnail.license.label}</a>`;
	
	drawOnMe();
//    dot.forEach(item => item.addEventListener('click', () => console.log(item) ));
	
  }).catch(function(error) {
    console.log('Request failed', error);
  });



function drawOnMe() {
	const drawingCanvas = document.querySelector('#draw');
	const ctx = drawingCanvas.getContext('2d');

	ctx.strokeStyle = paintColour;
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';
	ctx.lineWidth = 10;

	let isDrawing = false;

    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;    // relationship bitmap vs. element for X
        const scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
        return {
          x: (evt.clientX - rect.left) * scaleX,
          y: (evt.clientY - rect.top) * scaleY
        };
    }
    
	function draw(e) {
		if(!isDrawing) return;
//        console.log(e);
        const pos = getMousePos(drawingCanvas, e);
		ctx.beginPath();
		ctx.moveTo(pos.x,pos.y); // start
		ctx.lineTo(pos.x,pos.y); //end
		ctx.stroke();
	}
	


	drawingCanvas.addEventListener('mousedown', (e) => {
		isDrawing = true;
	});

	drawingCanvas.addEventListener('mousemove', draw);

	drawingCanvas.addEventListener('mouseup', () => isDrawing = false);
	drawingCanvas.addEventListener('mouseout', () => isDrawing = false);
}

