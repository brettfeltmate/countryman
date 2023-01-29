let spawn_trials = function(block_condition) {
    let stim_types = (block_condition !== 'mixed') ? [block_condition] : stimulus_type

    let trials = []
    for (let rep = 0; rep < factorial_reps; rep++) {
        for (let i = 0; i < stim_types.length; i++) {
            for (let j = 0; j < stimulus_compatability.length; j++) {
                for (let k = 0; k < stimulus_directionality.length; k++) {
                    let this_trial = {
                        fixation_duration: fixation_duration,
                        response_window: response_window,
                        block: block_condition,
                        stimulus_type: stim_types[i],
                        stimulus_compatibility: stimulus_compatability[j],
                        stimulus_directionality: stimulus_directionality[k],
                        response_keys: response_keys
                    }
                    trials.push(this_trial)
                }
            }
        }
    }
    shuffle(trials)
    return trials;
}