AJS.$(window).load(function() {
    const $ = AJS.$;

    const STATE_INIT = 'STATE_INIT';
    const STATE_RUNNING = 'STATE_RUNNING';
    const STATE_STOPPED = 'STATE_STOPPED';

    const elems = {
        timeLabel: $('#timetracker-panes').find('.total-time'),
        toggle: $('#timetracker-toggle-btn'),
        buttonState: $('#timetracker-toggle-btn').find('span.state'),
        worklogButton: $('#log-work-link'),
        worklogInput: $('#log-work-time-logged')
    };

    const store = {
        worklogHref: elems.worklogButton.attr('href'),
        state: STATE_STOPPED,
        startTime: 0,
        totalTime: 0,
        timer: null
    };

    elems.toggle.click(function () {
        switch (store.state) {
            case STATE_RUNNING:
                store.state = STATE_STOPPED;

                store.totalTime = + new Date() - store.startTime;

                window.clearInterval(store.timer);
                window.onbeforeunload = null;

                renewState();
                break;
            case STATE_STOPPED:
                store.state = STATE_RUNNING;

                store.startTime = + new Date();
                store.totalTime = 0;

                store.timer = setInterval(timerTick, 500);

                window.onbeforeunload = function (evt) {
                    if (store.state !== STATE_STOPPED) {
                        var message = 'Are you sure you want to leave, cause there are some unsaved changes?';
                        if (typeof evt === 'undefined') {
                            evt = window.event;
                        }
                        if (evt) {
                            evt.returnValue = message;
                        }
                        return message;
                    }
                };

                renewState();
                break;
            default:
                console.error('Unexpected state');
        }
    });

    function timerTick() {
        const current = + new Date();
        const interval = formatInterval(current - store.startTime, true);
        elems.timeLabel.text(interval);
    }

    function formatInterval(totalTime, includeSeconds) {
        if (typeof includeSeconds === 'undefined') {
            includeSeconds = false;
        }

        const total = Math.round(totalTime / 1000);
        var res = [];

        if (total >= 3600) {
            res.push(Math.floor(total / 3600) + "h");
        }

        res.push(Math.floor(total / 60) + "m");

        if (includeSeconds) {
            res.push(total % 60 + "s");
        }

        return res.join(" ");
    }

    function renewState() {
        switch (store.state) {
            case STATE_RUNNING:
                elems.buttonState.text('Stop');
                break;
            case STATE_STOPPED:
                elems.buttonState.text('Start');

                elems.worklogButton.attr('href', store.worklogHref + "&timeLogged=" + formatInterval(store.totalTime));
                elems.worklogButton.trigger('click');
                break;
        }
    }
});