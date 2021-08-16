jsPsych.plugins['draw-demo-lines'] = (function() {

    var plugin = {};

    plugin.info = {
        name: 'categorize-lines',
        description: 'line categorization trials',
        parameters: {
            in_category: {
                type: jsPsych.plugins.parameterType.INT,
                array: true,
                pretty_name: 'Lines in the category',
                default: null,
                description: 'array of all lines to draw that ARE in the category'
            },
            out_category: {
                type: jsPsych.plugins.parameterType.INT,
                array: true,
                pretty_name: 'Lines not in the category',
                default: null,
                description: 'array of all lines to draw that ARE NOT in the category'
            },
            dist_btw: {
                type: jsPsych.plugins.parameterType.INT,
                array: true,
                pretty_name: 'Distance between lines',
                default: 25,
                description: 'distance between each line on the screen (in pixels)'
            },
            line_width: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Line Width',
                default: 2,
                description: 'line width in pixels (same for all lines)'
            },
            choices: {
                type: jsPsych.plugins.parameterType.STRING,
                array: true,
                pretty_name: 'Choices',
                default: jsPsych.NO_KEYS,
                description: 'key choices'
            },
            duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Display Duration',
                default: 25000,
                description: 'duration to show display of lines'
            },
        }
    }

    plugin.trial = function(display_element, trial) {
        console.log(trial.in_category);
        var in_category = jsPsych.randomization.shuffle(trial.in_category);
        var out_category = jsPsych.randomization.shuffle(trial.out_category);

        var duration=trial.duration;

        // avg. dist btw stimuli (noise is added)
        var dist_btw = trial.dist_btw;

        var line_width = trial.line_width;

        var y_center_in = screen.availHeight * 1 / 4;
        Array.max = function(array) {
            return Math.max.apply(Math, array);
        };
        var y_center_out = screen.availHeight - Array.max(out_category) / 2;

        var dist_btw_cats = screen.availHeight / 4;

        // canvas dimensions
        var canvas_width = screen.width - 150;
        var canvas_height = screen.height;
        console.log(dist_btw)

        var x_locs = [10]
        for (let i = 0; i < in_category.length - 1; i++) {
            x_locs.push(x_locs[i] + dist_btw)
        }
        console.log(x_locs)

        var in_cat_text = "Stimuli IN the Category";
        var out_cat_text = "Stimuli NOT IN the Category";
        var x_text = Array.max(x_locs) + 100;
        var y_text = screen.availHeight / 3;

        //canvas for drawing stimulus
        var html2 = '<canvas id="myCanvas" width=' + canvas_width + ' height=' + canvas_height + ' ;"></canvas>';
        display_element.innerHTML = html2;
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        ctx.font = "40px Arial";
        ctx.fillText(in_cat_text, x_text, 50);
        ctx.fillText(out_cat_text, x_text, screen.availHeight * 2 / 3 - 50);

        for (let i = 0; i < in_category.length; i++) {
            let line_begin = [x_locs[i], y_center_in - (in_category[i] / 2)];
            let line_end = [x_locs[i], y_center_in + (in_category[i] / 2)];
            ctx.lineWidth = line_width;
            ctx.beginPath();
            ctx.moveTo(line_begin[0], line_begin[1])
            ctx.lineTo(line_end[0], line_end[1])
            ctx.stroke();
        }

        for (let i = 0; i < in_category.length; i++) {
            let line_begin = [x_locs[i], y_center_out - (out_category[i] / 2)];
            let line_end = [x_locs[i], y_center_out + (out_category[i] / 2)];
            ctx.lineWidth = line_width;
            ctx.beginPath();
            ctx.moveTo(line_begin[0], line_begin[1])
            ctx.lineTo(line_end[0], line_end[1])
            ctx.stroke();
        }

        // function to end trial when it is time
        function end_trial() {
            // kill any remaining setTimeout handlers
            jsPsych.pluginAPI.clearAllTimeouts();

            // data saving
            var trial_data = {
                stim: 'lines'
            }
            // clear the display
            display_element.innerHTML = '';
            // move on to the next trial
            jsPsych.finishTrial(trial_data);
        }
        jsPsych.pluginAPI.setTimeout(end_trial, duration);
    };
    return plugin;
})();
