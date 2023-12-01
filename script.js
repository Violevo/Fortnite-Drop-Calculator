document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('fortniteMapCanvas');
    const ctx = canvas.getContext('2d');

    const mapImage = new Image();
    mapImage.src = 'https://imagetolink.com/ib/f0126QUExl.png';

    let C = { x: 654.1326293496485, y: 379.4085654616584 };
    let circle1 = { x: 486, y: 859 };
    let circle2 = { x: 730, y: 163 };
    let dropmarker = { x: 285, y: 250 };

    let centerCircle = calculateMidpoint(circle1, circle2);
    let lineFlipped = false;

    let dropmarkerOffsetX = 0;
    let dropmarkerOffsetY = -19 ;

    const lineColor = 'black';
    const outlineColor = 'white';
    const outlineWidth = 1;
    

    // m to px ratio
    // 100:110


    function initializeMap() {
        mapImage.onload = function () {
            ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
            drawLine(circle1, circle2);
        };

        drawCircle('circle1', circle1);
        drawCircle('circle2', circle2);
        drawCircle('dropmarker', dropmarker);
        drawCircle('centerCircle', centerCircle);
    }

    function getDrop() {
        drawradius(ctx, dropmarker.x, dropmarker.y, 110, "white", 2);
    
        // Store the previous dropmarker position
        const dropmarke = { x: dropmarker.x, y: dropmarker.y }
    
        // Update the DOM representation of the dropmarker position
        const dropmarkerCircle = document.getElementById('dropmarker');
        dropmarkerCircle.style.left = dropmarker.x - dropmarkerCircle.clientWidth / 2 + dropmarkerOffsetX + 'px';
        dropmarkerCircle.style.top = dropmarker.y - dropmarkerCircle.clientHeight / 2 + dropmarkerOffsetY + 'px';
    
        // Find the closest point on the line
        C = findClosestPointOnLine(circle1, circle2, dropmarker);
    
        // Calculate the distance between C and circle1
        const distToCircle1 = distance(C.x, C.y, circle1.x, circle1.y);
    
        // Calculate the unit vector from C to circle1
        const unitVector = {
            x: (circle1.x - C.x) / distToCircle1,
            y: (circle1.y - C.y) / distToCircle1
        };
    
        // Move C closer to circle1
        C.x += 80 * unitVector.x;
        C.y += 80 * unitVector.y;
    
        drawLine2(C, dropmarker, "White", "White", outlineWidth);
        drawLine2(C, dropmarker, "Black", "Black", outlineWidth, 10);
    }
    

    function drawradius(context, centerX, centerY, radius, color, lineWidth) {
        //Function to
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.stroke();
        context.closePath();
    }

    initializeMap();

    canvas.addEventListener('click', function (event) {
        const clickX = event.clientX - canvas.getBoundingClientRect().left;
        const clickY = event.clientY - canvas.getBoundingClientRect().top;

        if (
            clickX >= getDropImageX &&
            clickX <= getDropImageX + getDropImage.width &&
            clickY >= getDropImageY &&
            clickY <= getDropImageY + getDropImage.height
        ) {
            getDrop();
        }
    });

    function initializeDraggable(id) {
        const circle = document.getElementById(id);

        circle.addEventListener('mousedown', function (event) {
            event.preventDefault();
            const onMouseMove = function (e) {
                const x = e.clientX;
                const y = e.clientY;

                circle.style.left = x - circle.clientWidth / 2 + 'px';
                circle.style.top = y - circle.clientHeight / 2 + 'px';

                
            
                updateCirclePositions(id, x, y);

                centerCircle = calculateMidpoint(circle1, circle2);
                drawLine(circle1, circle2);

                
                
        

            };

            const onMouseUp = function () {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    

    function updateCirclePositions(id, x, y) {
        if (id === 'circle1') {
            circle1 = { x, y };
        } else if (id === 'circle2') {
            circle2 = { x, y };
        } else if (id === 'centerCircle') {
            centerCircle = { x, y };
        }
    }

    function makeDraggableWithOffset(element, callback, offsetX, offsetY) {
        element.addEventListener('mousedown', function (event) {
            event.preventDefault();

            const onMouseMove = function (e) {
                const x = e.clientX;
                const y = e.clientY;
    
                element.style.left = x - element.clientWidth / 2 + offsetX + 'px';
                element.style.top = y - element.clientHeight / 2 + offsetY + 'px';
    
                const newPosition = { x: x - offsetX, y: y - offsetY };
                callback(newPosition);
            };

            const onMouseUp = function () {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    function updateDropmarkerPosition(position) {
        dropmarker = { x: position.x - dropmarkerOffsetX, y: position.y - dropmarkerOffsetY };
        drawLine(circle1, circle2);
    }

    const dropmarkerElement = document.getElementById('dropmarker');
    makeDraggableWithOffset(dropmarkerElement, updateDropmarkerPosition, dropmarkerOffsetX, dropmarkerOffsetY);

    initializeDraggable('circle1');
    initializeDraggable('circle2');
    initializeDraggable('centerCircle');
    initializeDraggable('dropmarker');

    findClosestPointOnLine(circle1, circle2, dropmarker);
    
    drawLine(circle1, circle2);
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

    function findClosestPointOnLine(A, B, P) {
        const AB = { x: B.x - A.x, y: B.y - A.y };
        const AP = { x: P.x - A.x, y: P.y - A.y };
        const scalarProjection = (AP.x * AB.x + AP.y * AB.y) / (Math.pow(AB.x, 2) + Math.pow(AB.y, 2));
        const C = {
            x: A.x + scalarProjection * AB.x,
            y: A.y + scalarProjection * AB.y
        };

        return C;
    }

    function distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
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
        context.fillStyle = "black";
        context.fill();
        context.strokeStyle = outlineColor;
        context.lineWidth = outlineWidth;
        context.stroke();
    }

    function flipline() {

        [circle1, circle2] = [circle2, circle1];

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

        drawCircle('circle1', circle1);
        drawCircle('circle2', circle2);
        drawLine(circle1, circle2, lineColor, outlineColor, outlineWidth);
        

        lineFlipped = !lineFlipped;
    }

    const flipLineButton = document.getElementById('centerCircle');
    flipLineButton.addEventListener('click', flipline);

    function drawLine(start, end, lineColor, outlineColor, outlineWidth) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

        getDrop()

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
        const numArrowheads = 5000;
        for (let i = 1; i <= numArrowheads; i++) {
            const ratio = i / (numArrowheads + 1);
            const arrow = calculateArrowheadPosition(extendedStart.x, extendedStart.y, extendedEnd.x, extendedEnd.y, 10, ratio);
            canvas_arrow(ctx, arrow.fromx, arrow.fromy, arrow.tox, arrow.toy, 5);
        }
        
    }

    function drawLine2(start, end, lineColor, outlineColor, outlineWidth, length) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
    
        // If length is not provided, calculate it
        if (!length) {
            length = Math.sqrt(dx * dx + dy * dy);
        }
    
        // Draw the line
        ctx.beginPath();
        if (!lineFlipped) {
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(start.x + (dx / length) * length, start.y + (dy / length) * length);
        } else {
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(end.x - (dx / length) * length, end.y - (dy / length) * length);
        }

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
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

    function drawCircle(id, position) {
        const circle = document.getElementById(id);
        circle.style.left = position.x - circle.clientWidth / 2 + 'px';
        circle.style.top = position.y - circle.clientHeight / 2 + 'px';
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
