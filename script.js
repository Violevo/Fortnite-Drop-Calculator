document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('fortniteMapCanvas');
    const ctx = canvas.getContext('2d');

    // Load map image
    const mapImage = new Image();
    mapImage.src = 'https://imagetolink.com/ib/f0126QUExl.png';

    // Initialize line image and flip status
    const lineImage = new Image();
    let lineFlipped = false;

    // Initial circle positions
    let circle1 = { x: 800, y: 700 };
    let circle2 = { x: 300, y: 200 };
    let centerCircle = calculateMidpoint(circle1, circle2);

    mapImage.onload = function () {
        ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
        drawLine(circle1, circle2);
    };

    // Draw circles 
    drawCircle('circle1', circle1);
    drawCircle('circle2', circle2);
    drawCircle('centerCircle', centerCircle);

    // Make circles draggable
    makeDraggable('circle1');
    makeDraggable('circle2');
    makeDraggable('centerCircle');

    // Make center circle clickable
    makeClickable('centerCircle');

    // Draw line between circles
    drawLine(circle1, circle2);

    // Get the canvas element for the clickable image
    const getDropCanvas = document.getElementById('fortniteMapCanvas'); 
    const getDropCtx = getDropCanvas.getContext('2d');

    // Load the image for the clickable canvas
    const getDropImage = new Image();
    getDropImage.src = 'https://i.postimg.cc/qRwy64Nj/image-2023-11-26-111336843.jpg';

    const getDropImageX = 400; 
    const getDropImageY = 1; 

    getDropImage.onload = function () {
        // Draw the image on the canvas at the specified coordinates
        getDropCtx.drawImage(getDropImage, getDropImageX, getDropImageY, 360, 66); 
    };

    // Add a click event listener to the canvas
    getDropCanvas.addEventListener('click', function (event) {
        const clickX = event.clientX - getDropCanvas.getBoundingClientRect().left;
        const clickY = event.clientY - getDropCanvas.getBoundingClientRect().top;

        // Check if the click is within the bounds of the image
        if (
            clickX >= getDropImageX &&
            clickX <= getDropImageX + getDropImage.width &&
            clickY >= getDropImageY &&
            clickY <= getDropImageY + getDropImage.height
        ) {
            getDrop();
        }
    });

    function getDrop() {
        console.log('Getting drop...');
        alert("Not Done Yet");
    }

    window.getDrop = getDrop;

    function drawCircle(id, position) {
        const circle = document.getElementById(id);
        circle.style.left = position.x - circle.clientWidth / 2 + 'px';
        circle.style.top = position.y - circle.clientHeight / 2 + 'px';
    }

    function makeDraggable(id) {
        const circle = document.getElementById(id);

        circle.addEventListener('mousedown', function (event) {
            event.preventDefault();

            const onMouseMove = function (e) {
                const x = e.clientX;
                const y = e.clientY;

                circle.style.left = x - circle.clientWidth / 2 + 'px';
                circle.style.top = y - circle.clientHeight / 2 + 'px';

                if (id === 'circle1') {
                    circle1 = { x: x, y: y };
                } else if (id === 'circle2') {
                    circle2 = { x: x, y: y };
                } else if (id === 'centerCircle') {
                    centerCircle = { x: x, y: y };
                }

                drawLine(circle1, circle2);
                getDropCtx.drawImage(getDropImage, getDropImageX, getDropImageY, 360, 66);
            };

            const onMouseUp = function () {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    function makeClickable(id) {
        const circle = document.getElementById(id);

        circle.addEventListener('click', function () {
            // Perform the action when the circle is clicked
            flipline();
            console.log(lineFlipped);
        });
    }

    function drawLine(start, end) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

        // Calculate the midpoint of the line
        const midPoint = calculateMidpoint(start, end);

        // Update the position of the center circle
        centerCircle = midPoint;
        drawCircle('centerCircle', centerCircle);

        // Find the direction and length of the line
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        // Extend line factor:
        const extendFactor = 100;

        // Calculate the extended Start points
        const extendedStart = {
            x: start.x - dx * extendFactor,
            y: start.y - dy * extendFactor
        };

        // Calculate the extended End points
        const extendedEnd = {
            x: end.x + dx * extendFactor,
            y: end.y + dy * extendFactor
        };

        // Draw line
        ctx.beginPath();

        if (!lineFlipped) {
            ctx.moveTo(extendedStart.x, extendedStart.y);
            ctx.lineTo(extendedEnd.x, extendedEnd.y);
        } else {
            ctx.moveTo(extendedEnd.x, extendedEnd.y);
            ctx.lineTo(extendedStart.x, extendedStart.y);
        }

        ctx.strokeStyle = 'white'; // White line
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
    }

    function flipline() {
        // Swap the positions of circle1 and circle2
        [circle1, circle2] = [circle2, circle1];

        // Update the positions of the circles on the page
        drawCircle('circle1', circle1);
        drawCircle('circle2', circle2);
        drawLine(circle1, circle2);

        // Toggle the value of lineFlipped
        lineFlipped = !lineFlipped;
    }

    function calculateMidpoint(point1, point2) {
        return {
            x: (point1.x + point2.x) / 2,
            y: (point1.y + point2.y) / 2
        };
    }
});
