document.addEventListener('DOMContentLoaded', function() {
    const cursorTrail = document.getElementById('cursor-trail');
    const trailCount = 15; // Number of trail elements to create
    const trailElements = [];
    let hue = 0; // Initial hue value
    let isMoving = false; // Flag to track cursor movement
    let combineTimeout = null; // Timeout ID for combining trail elements
    let dissolveTimeout = null; // Timeout ID for dissolving trail elements

    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.classList.add('trail-element');
        trail.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
        trailElements.push(trail);
        cursorTrail.appendChild(trail);
        hue += 15; // Increment hue value
    }

    function dissolveTrailElements() {
        let index = trailCount - 1;

        function dissolveNextTrail() {
            if (index <= trailCount) {
                clearTimeout(dissolveTimeout);
                combineTrailElements();
                return;
            }

            const trail = trailElements[index];
            trail.style.opacity = '0';
            index--;

            dissolveTimeout = setTimeout(dissolveNextTrail, 100); // Dissolve each trail with a 0.1 second delay
        }

        dissolveNextTrail();
    }

    function combineTrailElements() {
        const combinedTrail = document.createElement('div');
        combinedTrail.classList.add('combined-trail');
        cursorTrail.appendChild(combinedTrail);

        for (const trail of trailElements) {
            cursorTrail.removeChild(trail);
        }

        isMoving = false; // Reset the isMoving flag after combining
    }

    function resetCombineTimeout() {
        clearTimeout(combineTimeout);
        combineTimeout = setTimeout(dissolveTrailElements, 0); // Dissolve after 0.5 seconds of inactivity
    }

    function moveTrailElements(posX, posY) {
        for (let i = trailCount - 1; i >= 1; i--) {
            const prevTrail = trailElements[i - 1];
            const currTrail = trailElements[i];
            currTrail.style.left = prevTrail.style.left;
            currTrail.style.top = prevTrail.style.top;
        }

        const firstTrail = trailElements[0];
        firstTrail.style.left = posX + 'px';
        firstTrail.style.top = posY + 'px';
    }

    document.addEventListener('mousemove', function(e) {
        const posX = e.clientX;
        const posY = e.clientY;

        clearTimeout(combineTimeout);
        clearTimeout(dissolveTimeout);

        if (!isMoving) {
            isMoving = true;
            const combinedTrail = cursorTrail.querySelector('.combined-trail');
            if (combinedTrail) {
                cursorTrail.removeChild(combinedTrail);
                for (const trail of trailElements) {
                    cursorTrail.appendChild(trail);
                }
            }
        }

        moveTrailElements(posX, posY);
        resetCombineTimeout();
    });

    document.addEventListener('mouseleave', function() {
        if (isMoving) {
            dissolveTrailElements();
            clearTimeout(combineTimeout);
            clearTimeout(dissolveTimeout);
        }
    });

    document.addEventListener('keydown', function() {
        if (!isMoving) {
            isMoving = true;
            resetCombineTimeout();
        }
    });

    document.addEventListener('mousedown', function() {
        if (!isMoving) {
            isMoving = true;
            resetCombineTimeout();
        }
    });
});
