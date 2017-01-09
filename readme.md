OSModal is a plain javascript modal plugin.


## Documentation

Documentation and demo can be found here:
[https://weekaah.github.io/osmodal/](https://weekaah.github.io/osmodal/)


## Usage

```html
<link rel="stylesheet" href="dist/css/osmodal.min.css">
<script src="dist/js/osmodal.min.js"></script>

<script>
  var cnt = document.getElementById('mymodal').innerHTML;

  document.getElementById('open').onclick = function() {
    osmodal({
      title: 'OSModal title',
      content: 'OSModal content',
      height: 480,
      width: 640
    }).open();
  };
</script>
```

## Options and API
```javascript
osmodal({
  title: '',
  content: '',

  closeButtonLabel: 'Close modal',
  expandButtonLabel: 'Expand modal',
  restoreButtonLabel: 'Restore modal',
  minimizeButtonLabel: 'Minimize modal',

  draggable: true,
  resizable: true,

  height: 480,
  minHeight: 280,
  width: 640,
  minWidth: 280
}).open();
```

## License

© 2017 [Viktor Lesic](https://github.com/weekaah)  
Released under the [MIT LICENSE](http://opensource.org/licenses/MIT)
