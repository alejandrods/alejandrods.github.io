/* ======================== tvOS-style Pointer Tilt ===================== */
/* Tilts an element in 3D towards the pointer, the way Apple TV posters
   react to the remote. */

(function () {
    var MAX_TILT = 3;      /* degrees of rotation at the very edge */
    var LIFT = 20;          /* px the card floats towards the viewer */
    var SCALE = 1.04;

    var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    var still = window.matchMedia('(prefers-reduced-motion: reduce)');

    function bind(card) {
        var inner = card.querySelector('.tilt-inner');
        if (!inner) return;

        var frame = null;
        var point = null;

        function render() {
            frame = null;
            if (!point) return;

            var box = card.getBoundingClientRect();
            /* -0.5 .. 0.5 relative to the centre of the card */
            var x = (point.clientX - box.left) / box.width - 0.5;
            var y = (point.clientY - box.top) / box.height - 0.5;

            inner.style.transform =
                'rotateX(' + (-y * 2 * MAX_TILT).toFixed(2) + 'deg) ' +
                'rotateY(' + (x * 2 * MAX_TILT).toFixed(2) + 'deg) ' +
                'translateZ(' + LIFT + 'px) ' +
                'scale(' + SCALE + ')';

            /* Shadow falls opposite the pointer. */
            card.style.setProperty('--shadow-x', (-x * 40).toFixed(1) + 'px');
            card.style.setProperty('--shadow-y', (-y * 40 + 20).toFixed(1) + 'px');
        }

        function track(event) {
            point = event;
            if (frame === null) frame = window.requestAnimationFrame(render);
        }

        card.addEventListener('pointerenter', function (event) {
            if (event.pointerType !== 'mouse') return;
            card.classList.add('is-tilting');
            track(event);
        });

        card.addEventListener('pointermove', function (event) {
            if (event.pointerType !== 'mouse') return;
            track(event);
        });

        card.addEventListener('pointerleave', function () {
            point = null;
            if (frame !== null) {
                window.cancelAnimationFrame(frame);
                frame = null;
            }
            card.classList.remove('is-tilting');
            inner.style.transform = '';
            card.style.removeProperty('--shadow-x');
            card.style.removeProperty('--shadow-y');
        });
    }

    function init() {
        if (!fine.matches || still.matches) return;
        var cards = document.querySelectorAll('.tilt');
        for (var i = 0; i < cards.length; i++) bind(cards[i]);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
