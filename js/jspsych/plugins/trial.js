// Constructs & manages all events within a trial
jsPsych.plugins['trial'] = (function() {
    let plugin = {};

    // trial properties
    plugin.info = {
        name: 'trial',
        parameters: {
            // Timings
            fixation_duration: {
                type: jsPsych.plugins.parameterType.INT,
                default: null
            },
            response_window: {
                type: jsPsych.plugins.parameterType.INT,
                default: null
            },
            // Factors
            block: {
                type: jsPsych.plugins.parameterType.STRING,
                default: null
            },
            stimulus_type: {
                type: jsPsych.plugins.parameterType.STRING,
                default: null
            },
            stimulus_compatibility: {
                type: jsPsych.plugins.parameterType.STRING,
                default: null
            },
            stimulus_directionality: {
                type: jsPsych.plugins.parameterType.STRING,
                default: null
            },
            // Responses
            response_keys: {
                type: jsPsych.plugins.parameterType.KEYCODE,
                array: true,
                default: null
            }
        }

    }

    // Executes trial sequence following user initiation
    plugin.run_trial = function() {
        plugin.timeouts = [];

        // After params.fixation_duration time elapses, replace display with target and begin listening for response
        plugin.timeouts.push(
            setTimeout(function() {
                // image replacement
                $('#stimulus').css('background-image',
                    'url("../images/' +
                    `${plugin.params.stimulus_type}` + '_' +
                    `${plugin.params.stimulus_compatibility}` + '_' +
                    `${plugin.params.stimulus_directionality}` +
                    '.png"' +
                    ')')

                // response listener
                plugin.key_listener = jsPsych.pluginAPI.getKeyboardResponse({
                    callback_function: plugin.log_trial,
                    valid_responses: plugin.params.response_keys
                });
            }, plugin.params.fixation_duration)
        )

        // In absence of response, auto-abort trial after params.response_window time elapses
        plugin.timeouts.push(
            setTimeout(function() {
                plugin.log_trial()
            }, plugin.params.fixation_duration + plugin.params.response_window)
        )

    };

    // Logs trial data and clears any remaining listeners & timeouts.
    plugin.log_trial = function(response) {
        // Clear listeners & timeouts
        jsPsych.pluginAPI.cancelAllKeyboardResponses();
        for (let i=0; i < plugin.timeouts.length; i++) {
            clearTimeout(plugin.timeouts[i])
        }

        // Response checking
        let rt = 'no_response';
        let key = 'no_response';
        let correct = 'no_response';
        let response_made = 'no_response'

        if (response !== undefined) {
            rt = response.rt;
            key = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(response.key)
            // re-label response to be human readable
            response_made = (key === plugin.params.response_keys[0]) ? 'left' : 'right';
            correct = (response_made === plugin.params.stimulus_directionality)
        }

        // Collate & store trial data
        let trial_data = {
            block: plugin.params.block,
            stimulus_type: plugin.params.stimulus_type,
            stimulus_compatibility: plugin.params.stimulus_compatibility,
            stimulus_directionality: plugin.params.stimulus_directionality,
            response_made: response_made,
            response_time: rt,
            response_correct: correct

        }
        data_repo.push(trial_data)

        // present feedback if necessary and end trial
        if (trial_data.response_correct !== true) {
            honk.play();
            setTimeout(function () {
                plugin.end_trial()
            }, 1000)
        } else {
            plugin.end_trial()
        }


    }

    // Clear body & tell jsPsych trial is complete
    plugin.end_trial = function() {
        $(document).off()
        jsPsych.finishTrial();
    };

    // Point of entry for trial
    plugin.trial = function(display_element, trial) {
        // Ensure blank slate
        $(display_element).empty();

        plugin.params = trial;

        // Prep display
        let display = $('<div />').addClass('stimulus').attr('id', 'stimulus')
        $(display_element).append(display)

        // Trials self-started via spacebar
        $(document).on("keypress", function(e) {
            if (e.which === 32) {
                plugin.run_trial()
            }
        })
    }
    return plugin;
})();