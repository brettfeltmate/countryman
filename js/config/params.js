// how many reps of full design (within a block)
const factorial_reps = 15

// trial variables
const fixation_duration = 500; // time (ms) between fix & target
const response_window = 1500; // time (ms) window to respond before trial self aborts
const stimulus_type = ['sign', 'signal'] // target type to be presented on trial
const stimulus_compatability = ['congruent', 'neutral', 'incongruent'] // stimulus-response compatibility
const stimulus_directionality = ['left', 'right'] // directionality of the response relevant target property (location, orientation)

// block sequence (first two blocks in random order)
const block_order = (Math.random() > 0.5) ? ['sign', 'signal', 'mixed'] : ['signal', 'sign', 'mixed']

// response keys
const response_keys = ['f', 'j']
