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
    let circle1 = { x: 486, y: 859 }; 
    let circle2 = { x: 730, y: 163 };
    let dropmarker1 = { x: 285, y: 250 };
    let centerCircle = calculateMidpoint(circle1, circle2);
    let quart1 = calculateMidpoint(circle1, centerCircle);
    let quart2 = calculateMidpoint(circle1, circle2);
    let quart3 = calculateMidpoint(centerCircle, circle2);
    const lineColor = 'white';
    const arrowColor = 'white';
    const outlineColor = 'black';
    const outlineWidth = 1;

    mapImage.onload = function () {
        ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
        drawLine(circle1, circle2);
    };

    // Draw circles
    drawCircle('circle1', circle1);
    drawCircle('circle2', circle2);
    drawCircle('dropmarker', dropmarker1);
    drawCircle('centerCircle', centerCircle);

    // Draw arrows
    canvas_arrow(ctx, circle1.x, circle1.y, quart1.x, quart1.y, 10, arrowColor, outlineColor, outlineWidth);
    canvas_arrow(ctx, circle1.x, circle1.y, quart2.x, quart2.y, 10, arrowColor, outlineColor, outlineWidth);
    canvas_arrow(ctx, circle1.x, circle1.y, quart3.x, quart3.y, 10, arrowColor, outlineColor, outlineWidth);
    canvas_arrow(ctx, circle1.x, circle1.y, circle2.x, circle2.y, 10, arrowColor, outlineColor, outlineWidth);

    // Make circles draggable
    makeDraggable('circle1');
    makeDraggable('circle2');
    makeDraggable('dropmarker');
    makeDraggable('centerCircle');

    

    drawLine(circle1, circle2, lineColor, outlineColor, outlineWidth);

    const getDropCanvas = document.getElementById('fortniteMapCanvas');
    const getDropCtx = getDropCanvas.getContext('2d');

    const getDropImage = new Image();
    getDropImage.src = "";

    const getDropImageX = 400;
    const getDropImageY = 1;

    getDropCanvas.addEventListener('click', function (event) {
        const clickX = event.clientX - getDropCanvas.getBoundingClientRect().left;
        const clickY = event.clientY - getDropCanvas.getBoundingClientRect().top;

        if (
            clickX >= getDropImageX &&
            clickX <= getDropImageX + getDropImage.width &&
            clickY >= getDropImageY &&
            clickY <= getDropImageY + getDropImage.height
        ) {
            getDrop();
        }
    });

    var dropbutton = document.getElementById('yourDropButtonId');

    

    
    
    // Function to calculate the distance between two points
    function distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Function to calculate the distance between two points
    function distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
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

    function canvas_arrow(context, fromx, fromy, tox, toy, r, color, outlineColor, outlineWidth) {
        var x_center = tox;
        var y_center = toy;

        var angle = Math.atan2(toy - fromy, tox - fromx);
        var x = r * Math.cos(angle) + x_center;
        var y = r * Math.sin(angle) + y_center;

        context.beginPath();
        context.moveTo(x, y);

        angle += (1 / 3) * (2 * Math.PI);
        x = r * Math.cos(angle) + x_center;
        y = r * Math.sin(angle) + y_center;
        context.lineTo(x, y);

        angle += (1 / 3) * (2 * Math.PI);
        x = r * Math.cos(angle) + x_center;
        y = r * Math.sin(angle) + y_center;
        context.lineTo(x, y);

        context.closePath();
        context.fillStyle = color;
        context.fill();

        // Draw outline
        context.strokeStyle = outlineColor;
        context.lineWidth = outlineWidth;
        context.stroke();
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

                // Update lineFlipped when circles are moved
                lineFlipped = !lineFlipped;
            };

            const onMouseUp = function () {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    function flipline() {
        // Swap the positions of circle1 and circle2
        [circle1, circle2] = [circle2, circle1];

        // Update the positions of circles on the page
        drawCircle('circle1', circle1);
        drawCircle('circle2', circle2);
        drawLine(circle1, circle2, lineColor, outlineColor, outlineWidth);
        // Toggle the value of lineFlipped
        lineFlipped = !lineFlipped;

        console.log("Dropmarker:",dropmarker.x,dropmarker.y)
        console.log("Circle1:",circle1.x,circle1.y)
        console.log("Circle2:",circle2.x,circle2.y)
    }

    // Add an event listener for the flip line button
    const flipLineButton = document.getElementById('centerCircle');
    flipLineButton.addEventListener('click', flipline);

    function drawLine(start, end, lineColor, outlineColor, outlineWidth) {
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

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw outline
        ctx.beginPath();

        if (!lineFlipped) {
            ctx.moveTo(extendedStart.x, extendedStart.y);
            ctx.lineTo(extendedEnd.x, extendedEnd.y);
        } else {
            ctx.moveTo(extendedEnd.x, extendedEnd.y);
            ctx.lineTo(extendedStart.x, extendedStart.y);
        }

        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = outlineWidth;
        ctx.stroke();

        // Calculate and draw multiple arrowheads along the line
        const numArrowheads = 2000;
        for (let i = 1; i <= numArrowheads; i++) {
            const ratio = i / (numArrowheads + 1);
            const arrow = calculateArrowheadPosition(extendedStart.x, extendedStart.y, extendedEnd.x, extendedEnd.y, 10, ratio);
            canvas_arrow(ctx, arrow.fromx, arrow.fromy, arrow.tox, arrow.toy, 10);
        }

        // Draw and calculate perpendicular bisector
        const midpoint = {
            x: (circle1.x + circle2.x) / 2,
            y: (circle1.y + circle2.y) / 2
        };
        const slope = -1 / ((circle2.y - circle1.y) / (circle2.x - circle1.x));

        // Calculate the endpoint of the perpendicular bisector
        const perpendicularBisectorEnd = {
            x: midpoint.x + 50, // Adjust the length of the bisector as needed
            y: midpoint.y + slope * 50
        };

        // Draw the perpendicular bisector
        ctx.beginPath();
        ctx.moveTo(midpoint.x, midpoint.y);
        ctx.lineTo(perpendicularBisectorEnd.x, perpendicularBisectorEnd.y);
        ctx.stroke();
    }

    function calculateArrowheadPosition(fromx, fromy, tox, toy, r, ratio) {
        const x_center = fromx + (tox - fromx) * ratio;
        const y_center = fromy + (toy - fromy) * ratio;

        const angle = Math.atan2(toy - fromy, tox - fromx);
        const x = r * Math.cos(angle) + x_center;
        const y = r * Math.sin(angle) + y_center;

        return { fromx: x_center, fromy: y_center, tox: x, toy: y };
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
        drawLine(circle1, circle2);
    }

    function calculateMidpoint(point1, point2) {
        return {
            x: (point1.x + point2.x) / 2,
            y: (point1.y + point2.y) / 2
        };
    }
});
