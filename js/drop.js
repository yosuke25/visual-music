'use strict';

(function () {

  let flag = {
    artwork: false
  };

  let blur_area;
  let drop_filter;
  let file_input;
  let drop_icon;
  let drop_true;
  let drop_surface;

  window.addEventListener('load', () => {

    blur_area = document.getElementById('blur_area');
    drop_filter = document.getElementById('drop_filter');
    file_input = document.getElementById('file_input');
    drop_icon = document.getElementById('drop_icon');
    drop_true = document.getElementById('drop_true');
    drop_surface = document.getElementById('drop_surface');

    document.body.addEventListener('dragenter', (event) => {
      stop_event_propagation(event);
      set.display(drop_surface, 'block');
    }, false);

    drop_surface.addEventListener('dragenter', (event) => {
      stop_event_propagation(event);
      set.add_class(drop_true, 'on');
      if (flag.artwork) {
        set.remove_class(drop_icon, 'on');
        set.remove_class(blur_area, 'on');
        set.add_class(drop_filter, 'on');
      }
    }, false);

    drop_surface.addEventListener('dragleave', (event) => {
      stop_event_propagation(event);
      set.remove_class(drop_true, 'on');
      if (flag.artwork) {
        set.add_class(drop_icon, 'on');
        set.add_class(blur_area, 'on');
        set.remove_class(drop_filter, 'on');
      }
      set.display(drop_surface, 'none');
    }, false);

    drop_surface.addEventListener('dragover', (event) => {
      stop_event_propagation(event);
    }, false);

    drop_surface.addEventListener('drop', (event) => {
      stop_event_propagation(event);
      let file_list = get.file_list(event.dataTransfer.files);
      if (file_list.length > 0) {
        if (!flag.artwork) flag.artwork = true;
        add.playlist(file_list);
      } else message('再生可能なファイルが見つかりません');
      set.remove_class(drop_true, 'on');
      if (flag.artwork) {
        set.add_class(drop_icon, 'on');
        set.add_class(blur_area, 'on');
        set.remove_class(drop_filter, 'on');
      }
      set.display(drop_surface, 'none');
    }, false);

    file_input.addEventListener('change', () => {
      let file_list = get.file_list(file_input.files);
      if (file_list.length > 0) {
        if (!flag.artwork) flag.artwork = true;
        add.playlist(file_list);
        set.add_class(drop_icon, 'on');
        set.add_class(blur_area, 'on');
      } else message('再生可能なファイルが見つかりません');
      file_input.value = '';
    }, false);

    window.addEventListener('reset_playlist', () => {
      flag.artwork = false;
      set.remove_class(drop_icon, 'on');
      set.remove_class(blur_area, 'on');
    }, false);

  }, false);

  function stop_event_propagation (event) {
    event.stopPropagation();
    event.preventDefault();
  }

}());
