'use strict';

(function () {

  let flag = {
    player: {
      state: null,
      intentional_end: false,
      loop: null,
      volume: null,
      create_audio_context: false
    },
    progress: {
      state: 'stop',
      handle_move: false
    },
    controller: {
      rotate: false,
      volume_handle_move: false
    },
    visualizer: {
      state: null,
    }
  };

  let animation = {
    move_progress_seek: null,
    count_time: null,
    visualizer: null
  };

  let context = {};

  let current_playlist;

  let duration;

  let audio = {};

  let audio_player;

  let visualizer;

  let back_artwork;
  let main_artwork;

  let rotate_area;

  let music_name;
  let time_display;

  let previous;
  let following;

  let progress_seek_area;
  let progress_seek_bar;
  let progress_handle;

  let volume_seek_area;
  let volume_seek_ber;
  let volume_handle;

  let loop;
  let loop_false_icon;
  let loop_true_icon;

  let remove;

  let round_dot;
  let round_dot_false;
  let round_dot_true;

  let round_rod;
  let round_rod_false;
  let round_rod_true;

  let line_dot;
  let line_dot_false;
  let line_dot_true;

  let line_rod;
  let line_rod_false;
  let line_rod_true;

  let play_pause;
  let play_icon;
  let pause_icno;

  let other_menu;

  window.addEventListener('load', () => {

    audio_player = document.getElementById('audio_player');
    audio_player.crossOrigin = "anonymous";

    visualizer = document.getElementById('visualizer');

    back_artwork = document.getElementById('back_artwork');
    main_artwork = document.getElementById('main_artwork');

    rotate_area = document.getElementById('rotate_area');

    music_name = document.getElementById('music_name');
    time_display = document.getElementById('time_display');

    previous = document.getElementById('previous');
    following = document.getElementById('following');

    progress_seek_area = document.getElementById('progress_seek_area');
    progress_seek_bar = document.getElementById('progress_seek_bar');
    progress_handle = document.getElementById('progress_handle');

    volume_seek_area = document.getElementById('volume_seek_area');
    volume_seek_ber = document.getElementById('volume_seek_bar');
    volume_handle = document.getElementById('volume_handle');

    loop = document.getElementById('loop');
    loop_false_icon = document.getElementById('loop_false_icon');
    loop_true_icon = document.getElementById('loop_true_icon');

    remove = document.getElementById('remove');

    round_dot = document.getElementById('round_dot');
    round_dot_false = document.getElementById('round_dot_false');
    round_dot_true = document.getElementById('round_dot_true');

    round_rod = document.getElementById('round_rod');
    round_rod_false = document.getElementById('round_rod_false');
    round_rod_true = document.getElementById('round_rod_true');

    line_dot = document.getElementById('line_dot');
    line_dot_false = document.getElementById('line_dot_false');
    line_dot_true = document.getElementById('line_dot_true');

    line_rod = document.getElementById('line_rod');
    line_rod_false = document.getElementById('line_rod_false');
    line_rod_true = document.getElementById('line_rod_true');

    play_pause = document.getElementById('play_pause');
    play_icon = document.getElementById('play_icon');
    pause_icno = document.getElementById('pause_icon');

    other_menu = document.getElementById('other_menu');

    audio_player.addEventListener('loadedmetadata', () => {
      duration = audio_player.duration;
      player.play();
      console.log('メタデータ読み込み完了');
    }, false);

    audio_player.addEventListener('play', () => {
      console.log('再生開始');
    }, false);

    audio_player.addEventListener('pause', () => {
      console.log('再生停止');
    }, false);

    audio_player.addEventListener('ended', () => {
      if (Number(localStorage.getItem('loop')) && !flag.player.intentional_end) player.play(false);
      else if (playlist[current_playlist + 1] && !flag.player.intentional_end) {
        current_playlist += 1;
        player.set(playlist[current_playlist]);
      } else {
        player.pause();
        flag.player.state = 'stop';
        set_progress_seek();
        set_time();
      }
      flag.player.intentional_end = false;
      console.log('再生終了');
    }, false);

    audio_player.addEventListener('error', () => {
      remove_playlist();
      message('エラーが発生したため、プレイリストから削除しました');
      console.log('エラーが発生しました');
    }, false);

    context.visualizer = visualizer.getContext('2d');
    visualizer.width = 1000;
    visualizer.height = 1000;

    context.music_name = music_name.getContext('2d');
    music_name.width = 1400;
    music_name.height = 80;
    context.music_name.font = '40px \'Rounded Mplus 1c\'';
    context.music_name.fillStyle = 'white';

    context.time_display = time_display.getContext('2d');
    time_display.width = 400;
    time_display.height = 80;
    context.time_display.font = '35px \'Rounded Mplus 1c\'';
    context.time_display.fillStyle = 'white';
    set_time(true);

    play_pause.addEventListener('click', () => {
      if (flag.player.state === 'play') player.pause();
      else if (['pause', 'stop'].includes(flag.player.state)) player.play();
    }, false);

    other_menu.addEventListener('click', () => {
      if (flag.player.state === null) return;
      if (!flag.controller.rotate) {
        flag.controller.rotate = true;
        set.add_class(rotate_area, 'on');
      } else {
        flag.controller.rotate = false;
        set.remove_class(rotate_area, 'on');
      }
    }, false);

    previous.addEventListener('click', () => {
      if (flag.player.state === null) return;
      if (playlist[current_playlist - 1]) {
        current_playlist -= 1;
        player.set(playlist[current_playlist]);
      } else if ((playlist.length !== 1) && playlist[playlist.length - 1]) {
        current_playlist = playlist.length - 1;
        player.set(playlist[current_playlist]);
      } else {
        audio_player.currentTime = 0;
        set_progress_seek();
        set_time();
        if (flag.player.state !== 'play') player.play();
        message('プレイリストに前の曲がありません');
      }
    }, false);

    following.addEventListener('click', () => {
      if (flag.player.state === null) return;
      if (playlist[current_playlist + 1]) {
        current_playlist += 1;
        player.set(playlist[current_playlist]);
      } else if ((current_playlist !== 0) && playlist[0]) {
        current_playlist = 0;
        player.set(playlist[current_playlist]);
      } else {
        audio_player.currentTime = duration;
        set_progress_seek();
        set_time();
        message('プレイリストに次の曲がありません');
      }
    }, false);

    progress_seek_area.addEventListener('click', (event) => {
      if (flag.player.state === null) return;
      let click_position = get_click_position(event, progress_seek_bar, 1400);
      let current_time = click_position / (1400 / duration);
      if (current_time === duration) flag.player.intentional_end = true;
      audio_player.currentTime = current_time;
      set_progress_seek();
      set_time();
      if (flag.player.state === 'stop' && (audio_player.currentTime !== duration)) player.play();
    }, false);

    context.progress_seek_bar = progress_seek_bar.getContext('2d');
    progress_seek_bar.width = 1400;
    progress_seek_bar.height = 1;

    progress_handle.addEventListener('mousedown', () => {
      if (flag.player.state === null) return;
      let flag_play = true;
      flag.progress.handle_move = true;
      flag.player.intentional_end = true;
      if (flag.player.state === 'play') {
        flag_play = false;
        player.pause(false);
      }
      document.body.onmouseup = () => {
        flag.progress.handle_move = false;
        flag.player.intentional_end = false;
        if (flag.player.state === 'stop') {
          if (audio_player.currentTime !== duration) player.play();
        } else if (!flag_play) player.play();
        document.body.onmouseup = null;
      };
    }, false);

    context.volume_seek_ber = volume_seek_ber.getContext('2d');
    volume_seek_ber.width = 140;
    volume_seek_ber.height = 1;

    if (localStorage.getItem('volume') !== null) flag.player.volume = Number(localStorage.getItem('volume'));
    else player.volume(0.5);
    set_volume_seek(flag.player.volume * 10);

    volume_seek_area.addEventListener('click', (event) => {
      if (flag.player.state === null) return;
      let click_position = get_click_position(event, volume_seek_ber, 10);
      set_volume_seek(click_position);
    }, false);

    volume_handle.addEventListener('mousedown', () => {
      if (flag.player.state === null) return;
      flag.controller.volume_handle_move = true;
      document.body.onmouseup = () => {
        flag.controller.volume_handle_move = false;
        document.body.onmouseup = null;
      };
    }, false);

    document.body.addEventListener('mousemove', (event) => {
      if (flag.progress.handle_move) {
        let click_position = get_click_position(event, progress_seek_bar, 1400);
        audio_player.currentTime = click_position / (1400 / duration);
        set_progress_seek();
        set_time();
      } else if (flag.controller.volume_handle_move) {
        let click_position = get_click_position(event, volume_seek_ber, 10);
        set_volume_seek(click_position);
      }
    }, false);

    if (Number(localStorage.getItem('loop'))) player.loop(true);
    else player.loop(false);

    loop.addEventListener('click', () => {
      if (flag.player.loop) player.loop(false);
      else player.loop(true);
    }, false);

    remove.addEventListener('click', () => {
      if ((playlist.length === 0) && (flag.player.state === null)) return;
      remove_playlist();
    }, false);

    round_dot.addEventListener('click', () => {
      if (flag.player.state === null) return;
      if (animation.visualizer) {
        cancelAnimationFrame(animation.visualizer);
        animation.visualizer = null;
        context.visualizer.setTransform(1,0,0,1,0,0);
      }
      if (flag.visualizer.state !== 'round_dot') {
        if (flag.visualizer.state !== null) {
          eval('set.display(' + flag.visualizer.state + '_true, \'none\');');
          eval('set.display(' + flag.visualizer.state + '_false, \'block\');');
        }
        flag.visualizer.state = 'round_dot';
        set.add_class(main_artwork, 'on');
        set.add_class(visualizer, 'on');
        draw.round_dot();
        set.display(round_dot_false, 'none');
        set.display(round_dot_true, 'block');
      } else {
        flag.visualizer.state = null;
        set.remove_class(main_artwork, 'on');
        set.remove_class(visualizer, 'on');
        set.display(round_dot_true, 'none');
        set.display(round_dot_false, 'block');
      }
    }, false);

    round_rod.addEventListener('click', () => {
      if (flag.player.state === null) return;
      if (animation.visualizer) {
        cancelAnimationFrame(animation.visualizer);
        animation.visualizer = null;
        context.visualizer.setTransform(1,0,0,1,0,0);
      }
      if (flag.visualizer.state !== 'round_rod') {
        if (flag.visualizer.state !== null) {
          eval('set.display(' + flag.visualizer.state + '_true, \'none\');');
          eval('set.display(' + flag.visualizer.state + '_false, \'block\');');
        }
        flag.visualizer.state = 'round_rod';
        set.add_class(main_artwork, 'on');
        set.add_class(visualizer, 'on');
        draw.round_rod();
        set.display(round_rod_false, 'none');
        set.display(round_rod_true, 'block');
      } else {
        flag.visualizer.state = null;
        set.remove_class(main_artwork, 'on');
        set.remove_class(visualizer, 'on');
        set.display(round_rod_true, 'none');
        set.display(round_rod_false, 'block');
      }
    }, false);

    line_dot.addEventListener('click', () => {
      if (flag.player.state === null) return;
      if (animation.visualizer) {
        cancelAnimationFrame(animation.visualizer);
        animation.visualizer = null;
        context.visualizer.setTransform(1,0,0,1,0,0);
      }
      if (flag.visualizer.state !== 'line_dot') {
        if (flag.visualizer.state !== null) {
          eval('set.display(' + flag.visualizer.state + '_true, \'none\');');
          eval('set.display(' + flag.visualizer.state + '_false, \'block\');');
        }
        flag.visualizer.state = 'line_dot';
        set.add_class(main_artwork, 'on');
        set.add_class(visualizer, 'on');
        draw.line_dot();
        set.display(line_dot_false, 'none');
        set.display(line_dot_true, 'block');
      } else {
        flag.visualizer.state = null;
        set.remove_class(main_artwork, 'on');
        set.remove_class(visualizer, 'on');
        set.display(line_dot_true, 'none');
        set.display(line_dot_false, 'block');
      }
    }, false);

    line_rod.addEventListener('click', () => {
      if (flag.player.state === null) return;
      if (animation.visualizer) {
        cancelAnimationFrame(animation.visualizer);
        animation.visualizer = null;
        context.visualizer.setTransform(1,0,0,1,0,0);
      }
      if (flag.visualizer.state !== 'line_rod') {
        if (flag.visualizer.state !== null) {
          eval('set.display(' + flag.visualizer.state + '_true, \'none\');');
          eval('set.display(' + flag.visualizer.state + '_false, \'block\');');
        }
        flag.visualizer.state = 'line_rod';
        set.add_class(main_artwork, 'on');
        set.add_class(visualizer, 'on');
        draw.line_rod();
        set.display(line_rod_false, 'none');
        set.display(line_rod_true, 'block');
      } else {
        flag.visualizer.state = null;
        set.remove_class(main_artwork, 'on');
        set.remove_class(visualizer, 'on');
        set.display(line_rod_true, 'none');
        set.display(line_rod_false, 'block');
      }
    }, false);

    document.body.addEventListener('keydown', (event) => {
      if (event.which !== 32) return;
      if (flag.player.state === 'play') player.pause();
      else if (['pause', 'stop'].includes(flag.player.state)) player.play();
    }, false);

  }, false);

  window.addEventListener('change_playlist', () => {
    if (!flag.player.create_audio_context) {
      audio.context = new AudioContext();
      audio.analyser = audio.context.createAnalyser();
      audio.analyser.minDecibels = -100;
      audio.analyser.maxDecibels = 100;
      audio.analyser.smoothingTimeConstant = 0.1;
      audio.analyser.fftSize = 256;
      audio.buffer_length = audio.analyser.frequencyBinCount;
      audio.data_array = new Uint8Array(audio.buffer_length);
      audio.source = audio.context.createMediaElementSource(audio_player);
      audio.source.connect(audio.analyser);
      audio.analyser.connect(audio.context.destination);
      flag.player.create_audio_context = true;
    }
    if (flag.player.state !== null) return;
    current_playlist = 0;
    player.set(playlist[current_playlist]);
  }, false);

  let player = {
    set: (data) => {
      if (flag.player.state === 'play') player.pause();
      set.source(audio_player, URL.createObjectURL(data.file));
      set.artwork(data);
      if (!playlist[current_playlist].name) playlist[current_playlist].name = get_name(data);
      let name = playlist[current_playlist].name
      set.title(name + ' | Visual Music');
      context.music_name.clearRect(0, 0, 1400, 80);
      let text_width = context.music_name.measureText(name).width;
      context.music_name.fillText(name, (music_name.width - text_width) / 2, 68);
    },
    play: (change_icon = true) => {
      flag.player.state = 'play';
      audio_player.play();
      if (change_icon) {
        set.display(play_icon, 'none');
        set.display(pause_icno, 'block');
      }
      if (['pause', 'stop'].includes(flag.progress.state)) progress.play();
      if (flag.visualizer.state !== null) {
        draw[flag.visualizer.state]();
      }
    },
    pause: (change_icon = true) => {
      flag.player.state = 'pause';
      audio_player.pause();
      if (change_icon) {
        set.display(pause_icno, 'none');
        set.display(play_icon, 'block');
      }
      if (flag.progress.state === 'play') progress.stop();
      if (animation.visualizer) {
        cancelAnimationFrame(animation.visualizer);
        animation.visualizer = null;
        context.visualizer.setTransform(1,0,0,1,0,0);
      }
    },
    loop: (loop_flag) => {
      if (loop_flag) {
        localStorage.setItem('loop', 1);
        flag.player.loop = true;
        set.display(loop_false_icon, 'none');
        set.display(loop_true_icon, 'block');
      } else {
        localStorage.setItem('loop', 0);
        flag.player.loop = false;
        set.display(loop_true_icon, 'none');
        set.display(loop_false_icon, 'block');
      }
    },
    volume: (value) => {
      localStorage.setItem('volume', value);
      flag.player.volume = value;
      audio_player.volume = value;
    }
  };

  let progress = {
    play: () => {
      flag.progress.state = 'play';
      move_progress_seek();
      count_time();
    },
    stop: () => {
      flag.progress.state = 'pause';
      if (animation.move_progress_seek) {
        cancelAnimationFrame(animation.move_progress_seek);
        animation.move_progress_seek = null;
      }
      if (animation.count_time) {
        cancelAnimationFrame(animation.count_time);
        animation.count_time = null;
      }
    }
  };

  function move_progress_seek () {
    animation.move_progress_seek = requestAnimationFrame(move_progress_seek);
    set_progress_seek();
  }

  function set_progress_seek () {
    context.progress_seek_bar.clearRect(0, 0, 1400, 1);
    context.progress_seek_bar.fillStyle = 'rgb(66, 133, 244)';
    context.progress_seek_bar.fillRect(0, 0, audio_player.currentTime / (duration / 1400), 1);
    set.position(progress_handle, [null, null, (1.75 + (audio_player.currentTime / (duration / 1400) * 0.05) + 'vmin'), null]);
  }

  function count_time () {
    animation.count_time = requestAnimationFrame(count_time);
    set_time();
  }

  function set_time (reset_time = false) {
    let time;
    context.time_display.clearRect(0, 0, 400, 80);
    if (reset_time) time = '00:00 / 00:00';
    else {
      let current_time = { orig: audio_player.currentTime };
      current_time.s = current_time.orig % 60;
      current_time.m = (current_time.orig - current_time.s) / 60;
      current_time.s = parseInt(current_time.s);
      if (String(current_time.s).length === 1) current_time.s = '0' + current_time.s;
      if (String(current_time.m).length === 1) current_time.m = '0' + current_time.m;
      let duration_time = { orig: duration };
      duration_time.s = duration_time.orig % 60;
      duration_time.m = (duration_time.orig - duration_time.s) / 60;
      duration_time.s = parseInt(duration_time.s);
      if (String(duration_time.s).length === 1) duration_time.s = '0' + duration_time.s;
      if (String(duration_time.m).length === 1) duration_time.m = '0' + duration_time.m;
      time = current_time.m + ':' + current_time.s + ' / ' + duration_time.m + ':' + duration_time.s;
    }
    let text_width = context.time_display.measureText(time).width;
    context.time_display.fillText(time, (time_display.width - text_width) / 2, 45);
  }

  function set_volume_seek (position) {
    context.volume_seek_ber.clearRect(0, 0, 140, 1);
    context.volume_seek_ber.fillStyle = 'rgb(66, 133, 244)';
    context.volume_seek_ber.fillRect(0, 0, position / (10 / 140), 1);
    set.position(volume_handle, [null, null, (2.25 + (position / (10 / 14)) + 'vmin'), null]);
    player.volume(position / 10);
  }

  function get_click_position (event, element, ratio = 100) {
    let target_position = element.getBoundingClientRect();
    let relative_position = event.pageX - target_position.x;
    let truncation_position;
    if (relative_position < 0) {
      truncation_position = 0;
    } else if (relative_position <= target_position.width) {
      truncation_position = relative_position;
    } else if (target_position.width < relative_position) {
      truncation_position = target_position.width;
    }
    return truncation_position / (target_position.width / ratio);
  }

  function get_name (data) {
    let name_array = data.file.name.split('.');
    if (name_array[name_array.length - 1] && ['mp3', 'm4a', 'wav'].includes(name_array[name_array.length - 1])) {
      name_array.splice(name_array.length - 1, 1);
      return name_array.join('.');
    } else return data.file.name;
  }

  function reset () {
    audio_player.currentTime = 0;
    set_progress_seek();
    set_time(true);
    context.music_name.clearRect(0, 0, 1400, 80);
    context.visualizer.clearRect(0, 0, 1000, 1000);
    set.display(back_artwork, 'none');
    set.display(main_artwork, 'none');
    set.source(back_artwork, '');
    set.source(main_artwork, '');
    set.title('Visual Music');
    flag.player.state = null;
    current_playlist = null;
    playlist = [];
    window.dispatchEvent(new Event('reset_playlist'));
  }

  let draw = {
    round_dot: () => {
      animation.visualizer = requestAnimationFrame(draw.round_dot);
      context.visualizer.clearRect(0, 0, 1000, 1000);
      context.visualizer.fillStyle = 'rgb(255, 255, 255)';
      audio.analyser.getByteTimeDomainData(audio.data_array);
      for (var i = 0; i < audio.data_array.length; i++) {
        context.visualizer.translate(500, 500);
        context.visualizer.rotate(4 * Math.PI / 180);
        context.visualizer.translate(-500, -500);
        context.visualizer.fillRect(497.5, 250 - audio.data_array[i], 5, -5);
      }
    },
    round_rod: () => {
      animation.visualizer = requestAnimationFrame(draw.round_rod);
      context.visualizer.clearRect(0, 0, 1000, 1000);
      context.visualizer.fillStyle = 'rgb(255, 255, 255)';
      audio.analyser.getByteTimeDomainData(audio.data_array);
      for (var i = 0; i < audio.data_array.length; i++) {
        context.visualizer.translate(500, 500);
        context.visualizer.rotate(4 * Math.PI / 180);
        context.visualizer.translate(-500, -500);
        context.visualizer.fillRect(497.5, 300 - audio.data_array[i], 5, -50);
      }
    },
    line_dot: () => {
      animation.visualizer = requestAnimationFrame(draw.line_dot);
      context.visualizer.clearRect(0, 0, 1000, 1000);
      context.visualizer.fillStyle = 'rgb(255, 255, 255)';
      audio.analyser.getByteTimeDomainData(audio.data_array);
      for (var i = 0; i < audio.data_array.length; i++) {
        context.visualizer.fillRect(i * 7.8125, 370 + audio.data_array[i], 5, 5);
      }
    },
    line_rod: () => {
      animation.visualizer = requestAnimationFrame(draw.line_rod);
      context.visualizer.clearRect(0, 0, 1000, 1000);
      context.visualizer.fillStyle = 'rgb(255, 255, 255)';
      audio.analyser.getByteTimeDomainData(audio.data_array);
      for (var i = 0; i < audio.data_array.length; i++) {
        context.visualizer.fillRect(i * 7.8125, 350 + audio.data_array[i], 5, 50);
      }
    }
  };

  function remove_playlist () {
    if (playlist[current_playlist + 1]) {
      if (flag.player.state === 'play') player.pause(false);
      playlist.splice(current_playlist, 1);
      player.set(playlist[current_playlist]);
    } else if (playlist[current_playlist - 1]) {
      if (flag.player.state === 'play') player.pause(false);
      playlist.splice(current_playlist, 1);
      current_playlist -= 1;
      player.set(playlist[current_playlist]);
    } else {
      if (flag.player.state === 'play') player.pause();
      reset();
    }
  }

}());
