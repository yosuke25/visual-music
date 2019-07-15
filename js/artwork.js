'use strict';

(function () {

  window.get.artwork = async (file) => {

    if (!['audio/mp3', 'audio/x-m4a', 'audio/mp4', 'audio/mpeg'].includes(file.type)) return null;
    return artwork_analyzer(await reader(file));

    function reader (file) {
      return new Promise((resolve) => {
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.addEventListener('load', () => {
          resolve(reader.result);
        });
      });
    }

    function artwork_analyzer (reader) {

      function hex (index) {
        return data.array[index];
      }

      let data = {
        array: new Uint8Array(reader),
        slice_array: null,
        begin: {
          jpeg: null,
          png: null
        },
        end: {
          jpeg: null,
          png: null
        },
        type: null,
        jpeg: false,
        png: false
      };

      for (let i = 0; i < data.array.length; i++) {

        if (
          (!data.begin.png) && (!data.jpeg) &&
          (hex(i + 0) === 137) && (hex(i + 1) === 80) &&
          (hex(i + 2) === 78) && (hex(i + 3) === 71) &&
          (hex(i + 4) === 13) && (hex(i + 5) === 10) &&
          (hex(i + 6) === 26) && (hex(i + 7) === 10)
        ) {
          data.begin.png = i;
          continue;
        }

        if (
          (!data.end.png) && (!data.jpeg) &&
          (hex(i + 0) === 73) && (hex(i + 1) === 69) &&
          (hex(i + 2) === 78) && (hex(i + 3) === 68) &&
          (data.array[i + 7])
        ) {
          data.end.png = i + 8;
          if (data.begin.png) {
            data.type = 'image/png';
            data.png = true;
            break;
          }
          continue;
        }

        if (
          (!data.begin.jpeg) && (!data.png) &&
          (hex(i + 0) === 255) && (hex(i + 1) === 216)
        ) {
          data.begin.jpeg = i;
          continue;
        }

        if (
          (!data.end.jpeg) && (!data.png) &&
          (hex(i + 0) === 255) && (hex(i + 1) === 217)
        ) {
          data.end.jpeg = i + 2;
          if (data.begin.jpeg) {
            data.type = 'image/jpeg';
            data.jpeg = true;
            break;
          }
          continue;
        }

      }

      if (data.png) {
        data.slice_array = data.array.slice(data.begin.png, data.end.png);
      } else if (data.jpeg) {
        data.slice_array = data.array.slice(data.begin.jpeg, data.end.jpeg);
      } else return null;

      return URL.createObjectURL(new Blob([data.slice_array], { type: data.type }));

    }

  };

  window.get.size = (data) => {
    return new Promise ((resolve) => {

      let image = new Image();

      image.addEventListener('load', () => {
        resolve(get_size(image.width, image.height));
      }, false);

      image.addEventListener('error', () => {
        resolve({ err: true });
      }, false);

      set.source(image, data);

      function get_size(width, height) {
        let size = {
          width: width,
          height: height,
          bigger: get_bigger(width, height),
          ratio: get_ratio(width, height)
        };
        size.back_artwork = {
          width: '120vmax',
          height: '120vmax'
        };
        size.artwork_area = {
          width: '70vmin',
          height: '70vmin'
        };
        if (size.bigger === 'width') {
          size.back_artwork.width = (120 * size.ratio.height) + 'vmax';
          size.artwork_area.height = (70 * size.ratio.width) + 'vmin';
        } else if (size.bigger === 'height') {
          size.back_artwork.height = (120 * size.ratio.width) + 'vmax';
          size.artwork_area.width = (70 * size.ratio.height) + 'vmin';
        }
        return size;
      }

      function get_bigger (width, height) {
        if (width > height) return('width');
        else if (width < height) return('height');
        else if (width === height) return('same');
      }

      function get_ratio (width, height) {
        if (width !== height) return({
          width: height / width,
          height: width / height
        });
      }

    });
  };

  window.set.artwork = async (data) => {

    let back_artwork = document.getElementById('back_artwork');
    let artwork_area = document.getElementById('artwork_area');
    let main_artwork = document.getElementById('main_artwork');

    if (!data.artwork) {
      let artwork = await get.artwork(data.file);
      if (artwork) {
        let size = await get.size(artwork);
        if (!size.err) {
          data.artwork = artwork;
          data.size = size;
          data.default_artwork = false;
        } else set_default_artwork();
      } else set_default_artwork()
    }

    if (!data.default_artwork) {
      set.source(back_artwork, data.artwork);
      set.display(back_artwork, 'block');
    } else set.display(back_artwork, 'none');

    set.source(main_artwork, data.artwork);

    set.size(back_artwork, data.size.back_artwork.width, data.size.back_artwork.height);
    set.size(artwork_area, data.size.artwork_area.width, data.size.artwork_area.height);

    set.display(main_artwork, 'block');

    function set_default_artwork () {
      data.artwork = './img/default_artwork.svg';
      data.size = {
        width: 500,
        height: 500,
        bigger: 'same',
        back_artwork: {
          width: '120vmax',
          height: '120vmax'
        },
        artwork_area: {
          width: '70vmin',
          height: '70vmin'
        }
      };
      data.set_default_artwork = true;
    }

  };

}());
