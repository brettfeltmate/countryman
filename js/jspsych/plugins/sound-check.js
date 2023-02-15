jsPsych.plugins["sound-check"] = ( function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('sound-check', 'stimulus', 'audio');

  plugin.info = {
    name: 'sound-check',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The audio to be played.'
      }
    }
  };

  plugin.init_audio = function() {
    // setup stimulus
    plugin.context = jsPsych.pluginAPI.audioContext();
    if ( plugin.context !== null ){
      plugin.source = plugin.context.createBufferSource();
      plugin.source.buffer = jsPsych.pluginAPI.getAudioBuffer(plugin.tone);
      plugin.source.connect(plugin.context.destination);
    } else {
      plugin.audio = jsPsych.pluginAPI.getAudioBuffer(plugin.tone);
      plugin.audio.currentTime = 0;
    }

  };

  plugin.play_tone = function () {
    if (plugin.context !== null && !plugin.tone_playing) {
      plugin.source.start(0);
      plugin.tone_playing = true;
      plugin.source.onended = function () { plugin.tone_playing = false; }
    }
  };

  plugin.replay_handler = function() {
    if ( plugin.context !== null && !plugin.tone_playing ) {
      plugin.context.currentTime = 0;
      plugin.source = plugin.context.createBufferSource();
      plugin.source.buffer = jsPsych.pluginAPI.getAudioBuffer(plugin.tone);
      plugin.source.connect(plugin.context.destination);
      plugin.source.start(0);
      plugin.tone_playing = true;
      plugin.source.onended = function() { plugin.tone_playing = false; }
    }
  };

  plugin.trial = function(display_element, trial) {
      plugin.tone = trial.stimulus;
      plugin.tone_playing = false;

    let audio_check_instrux =
        `<div class = 'instructions'>` +
        `<p>Did you hear the honk? If not, please check your sound settings. You can minimize this window while doing that, but do NOT close it.</p>` +
        `<br>`+
        `<p>Press SPACE to hear the honk again!</p>` +
        '<br>' +
        '<p>If you heard it, adjust the volume of the honk so that it is loud, but not uncomfortably so. Press SPACE every time you want to hear the honk while adjusting. It is important that the sound is not feeble and that you heard the honk loud and clear.</p>' +
        '<br>' +
        '<p>Press ENTER after you finish adjusting the volume.</p>' +
        '<br>' +
        '<p>If you are still unable to hear the honk, please do NOT proceed.</p>' +
        '<br>' +
        '<p>Either refresh this page to try again, or contact the experimenter if they are not currently present.</p>' +
        "</div>"


    $('body').on('keydown', function(event) {
      if ( event.key === ' ' && trial.stimulus ) { plugin.replay_handler(); }
      if ( event.key === 'Enter' ) { end_trial() }
    })


    $(display_element).append(audio_check_instrux)

    plugin.init_audio();
    plugin.play_tone();

    // function to end trial when it is time
    function end_trial() {
      $('body').off()
      $(display_element).html('')

      // move on to the next trial
      jsPsych.finishTrial({});
    };
  };

  return plugin;
})();
