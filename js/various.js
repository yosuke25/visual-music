'use strict';

(function () {

  window.set = {
    size: (element, width, height = width) => {
      if (width) element.style.width = width;
      if (height) element.style.height = height;
    },
    position: (element, array, position = null) => {
      if (array.length === 0) return;
      let top;
      let right;
      let left;
      let bottom;
      switch (array.length) {
        case 1:
          top = right = left = bottom = array[0];
        case 2:
          right = left = array[1];
        case 4: 
          left = array[2];
          bottom = array[3];
      }
      element.style.top = top;
      element.style.right = right;
      element.style.left = left;
      element.style.bottom = bottom;
      element.style.position = position;
    },
    source: (element, data) => {
      element.src = data;
    },
    title: (text) => {
      document.title = text;
    },
    add_class: (element, name) => {
      element.classList.add(name);
    },
    remove_class: (element, name) => {
      element.classList.remove(name);
    },
    display: (element, value) => {
      element.style.display = value;
    },
    opacity: (element, value) => {
      element.style.opacity = value;
    },
    transform: (element, value) => {
      element.style.transform = value;
    },
    transition: (element, value) => {
      element.style.transition = value;
    }
  };

  window.get = {
    file_list: (files) => {
      let file_list = [];
      if (files.length <= 0) return file_list;
      for (let i = 0; i < files.length; i++) {
        if ((files[i].type.slice(0, 6) === 'audio/') || (files[i].type === '')) file_list.push(files[i]);
      };
      file_list.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      return file_list;
    }
  };

  window.add = {
    playlist: (file_list) => {
      for (let i in file_list) {
        window.playlist.push({
          flag: true,
          file: file_list[i],
          artwork: null,
          size: undefined
        });
      }
      window.dispatchEvent(new Event('change_playlist'));
    }
  };

  window.message = (message) => {
    let message_box = document.getElementById('message_box');
    if (window.message_timeout) {
      clearTimeout(window.message_timeout);
      window.message_timeout = null;
    }
    if (!window.message_context) {
      window.message_context = message_box.getContext('2d');
      message_box.width = 1400;
      message_box.height = 300;  
      message_context.font = '40px \'Rounded Mplus 1c\'';
      message_context.fillStyle = 'white';
    }
    message_context.clearRect(0, 0, message_box.width, message_box.height);
    let text_width = message_context.measureText(message).width;
    message_context.fillText(message, (message_box.width - text_width) / 2, message_box.height / 2)
    set.add_class(message_box, 'on');
    window.message_timeout = setTimeout(() => {
      set.remove_class(message_box, 'on');
    }, 1500);
  };

  window.playlist = []; 

}());
