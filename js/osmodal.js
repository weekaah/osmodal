(function() {

  'use strict';

  // ----------------------------------
  // constructor
  // ----------------------------------
  var Modal = function(settings) {
    this.snapped = false;
    this.expanded = false;
    this.docked = false;

    var defaults = {
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
    };

    if (typeof settings === 'object') {
      this.options = extendDefaults(defaults, settings)
    } else if (settings === undefined) {
      throw new Error('modal title and content haven\'t been passed in the settings object');
    } else {
      throw new Error('settings must be a valid object');
    }
  };




  // ----------------------------------
  // public methods
  // ----------------------------------
  Modal.prototype.open = function() {
    build.call(this);
    initialiteEvents.call(this);

    if (this.options.resizable) resize.call(this);
    if (this.options.draggable) drag.call(this);
  };

  Modal.prototype.close = function() {
    this.container.parentNode.removeChild(this.container);
    this.indicator.parentNode.removeChild(this.indicator);
  };

  Modal.prototype.dock = function(){
    !this.docked ? dock.call(this) : undock.call(this);
  };

  Modal.prototype.expand = function() {
    !this.expanded ? expand.call(this) : restore.call(this);
  };

  Modal.prototype.restore = function() {
    restore.call(this);
  };

  Modal.prototype.snap = function(pos) {
    snap.call(this, pos);
  }



  // ----------------------------------
  // private methods
  // ----------------------------------
  function build() {
    var frag = document.createDocumentFragment();

    this.container = createEl('div', 'osm-container', frag);

    // modal
    this.modal = createEl('div', 'osm', this.container);
    this.modal.style.height = this.options.height + 'px';
    this.modal.style.minHeight = this.options.minHeight + 'px';
    this.modal.style.width = this.options.width + 'px';
    this.modal.style.minWidth = this.options.minWidth + 'px';
    this.modal.style.top = this.options.top + 'px';

    if (this.options.minWidth >= this.options.width )
      this.modal.style.left =  'calc(50% - ' +  (this.options.minWidth / 2) + 'px)';
    else
      this.modal.style.left =  'calc(50% - ' +  (this.options.width / 2) + 'px)';

    // modal controlls
    this.ctrls = createEl('div', 'osm__ctrls', this.modal);

    // modal control buttons
    this.minBtn = createEl('div', 'osm__btn osm__min', this.ctrls);
    this.minBtn.title = this.options.minimizeButtonLabel;
    this.expBtn = createEl('div', 'osm__btn osm__exp', this.ctrls);
    this.expBtn.title = this.options.expandButtonLabel;
    this.clsBtn = createEl('div', 'osm__btn osm__cls', this.ctrls);
    this.clsBtn.title = this.options.closeButtonLabel;

    // modal head
    this.head = createEl('div', 'osm__head', this.modal);
    this.head.innerHTML = this.options.title;

    // modal body
    this.body = createEl('div', 'osm__body', this.modal);
    this.body.innerHTML = this.options.content;

    // modal sizers
    if (this.options.resizable) {
      this.sizers = createEl('div', 'osm__sizers', this.modal);
      this.n = createEl('div', 'osm__n', this.sizers);
      this.ne = createEl('div', 'osm__ne', this.sizers);
      this.e = createEl('div', 'osm__e', this.sizers);
      this.se = createEl('div', 'osm__se', this.sizers);
      this.s = createEl('div', 'osm__s', this.sizers);
      this.sw = createEl('div', 'osm__sw', this.sizers);
      this.w = createEl('div', 'osm__w', this.sizers);
      this.nw = createEl('div', 'osm__nw', this.sizers);
    }

    // indicator
    this.indicator = createEl('div', 'osm-indicator', frag);
    this.indicator.classList.remove('osm-indicator--show');
    document.body.appendChild(frag);
  }


  function resize() {
    var self = this;

    this.sizers.addEventListener('mousedown', function(e){
      e.preventDefault();
    });

    this.n.addEventListener('mousedown', function(e) {
      var height = getElProp(self.modal).height,
          bottom = getElProp(self.modal).bottom,
          mouseY = e.pageY;

      window.onmousemove = function(e) {
        var checkMinHieght = self.options.minHeight <= (height - (e.pageY - mouseY));

        self.modal.style.bottom = bottom + 'px';
        if (checkMinHieght) self.modal.style.height = height - (e.pageY - mouseY) + 'px';
        self.modal.style.top = '';
      };
    });

    this.s.addEventListener('mousedown', function(e) {
      var height = getElProp(self.modal).height,
          top = getElProp(self.modal).top,
          mouseY = e.pageY;

      window.onmousemove = function(e) {
        var checkMinHieght = self.options.minHeight <= (height + (e.pageY - mouseY));

        self.modal.style.top = top + 'px';
        if (checkMinHieght) self.modal.style.height = height + (e.pageY - mouseY) + 'px';
        self.modal.style.bottom = '';
      };
    });

    this.w.addEventListener('mousedown', function(e) {
      var width = getElProp(self.modal).width,
          right = getElProp(self.modal).right,
          mouseX = e.pageX;

      window.onmousemove = function(e) {
        var checkMinWidth = self.options.minWidth <= (width - (e.pageX - mouseX));

        self.modal.style.right = right + 'px';
        if (checkMinWidth) self.modal.style.width = width - (e.pageX - mouseX) + 'px';
        self.modal.style.left = '';
      };
    });

    this.e.addEventListener('mousedown', function(e) {
      var width = getElProp(self.modal).width,
          left = getElProp(self.modal).left,
          mouseX = e.pageX;

      window.onmousemove = function(e) {
        var checkMinWidth = self.options.minWidth <= (width + (e.pageX - mouseX));

        self.modal.style.left = left + 'px';
        if (checkMinWidth) self.modal.style.width = width + (e.pageX - mouseX) + 'px';
        self.modal.style.right = '';
      };
    });

    this.ne.addEventListener('mousedown', function(e) {
      var height = getElProp(self.modal).height,
          bottom = getElProp(self.modal).bottom,
          mouseY = e.pageY,
          width = getElProp(self.modal).width,
          left = getElProp(self.modal).left,
          mouseX = e.pageX;

      window.onmousemove = function(e) {
        var checkMinHieght = self.options.minHeight <= (height - (e.pageY - mouseY)),
            checkMinWidth = self.options.minWidth <= (width + (e.pageX - mouseX));

        self.modal.style.bottom = bottom + 'px';
        if (checkMinHieght) self.modal.style.height = height - (e.pageY - mouseY) + 'px';
        self.modal.style.top = '';

        self.modal.style.left = left + 'px';
        if (checkMinWidth) self.modal.style.width = width + (e.pageX - mouseX) + 'px';
        self.modal.style.right = '';
      };
    });

    this.se.addEventListener('mousedown', function(e) {
      var height = getElProp(self.modal).height,
          top = getElProp(self.modal).top,
          mouseY = e.pageY,
          width = getElProp(self.modal).width,
          left = getElProp(self.modal).left,
          mouseX = e.pageX;

      window.onmousemove = function(e) {
        var checkMinHieght = self.options.minHeight <= (height + (e.pageY - mouseY)),
            checkMinWidth = self.options.minWidth <= (width + (e.pageX - mouseX));

        self.modal.style.top = top + 'px';
        if (checkMinHieght) self.modal.style.height = height + (e.pageY - mouseY) + 'px';
        self.modal.style.bottom = '';

        self.modal.style.left = left + 'px';
        if (checkMinWidth) self.modal.style.width = width + (e.pageX - mouseX) + 'px';
        self.modal.style.right = '';
      };
    });

    this.sw.addEventListener('mousedown', function(e) {
      var height = getElProp(self.modal).height,
          top = getElProp(self.modal).top,
          mouseY = e.pageY,
          width = getElProp(self.modal).width,
          right = getElProp(self.modal).right,
          mouseX = e.pageX;

      window.onmousemove = function(e) {
        var checkMinHieght = self.options.minHeight <= (height + (e.pageY - mouseY)),
            checkMinWidth = self.options.minWidth <= (width - (e.pageX - mouseX));

        self.modal.style.top = top + 'px';
        if (checkMinHieght) self.modal.style.height = height + (e.pageY - mouseY) + 'px';
        self.modal.style.bottom = '';

        self.modal.style.right = right + 'px';
        if (checkMinWidth) self.modal.style.width = width - (e.pageX - mouseX) + 'px';
        self.modal.style.left = '';
      };
    });

    this.nw.addEventListener('mousedown', function(e) {
      var height = getElProp(self.modal).height,
          bottom = getElProp(self.modal).bottom,
          mouseY = e.pageY,
          width = getElProp(self.modal).width,
          right = getElProp(self.modal).right,
          mouseX = e.pageX;

      window.onmousemove = function(e) {
        var checkMinHieght = self.options.minHeight <= (height - (e.pageY - mouseY));
        var checkMinWidth = self.options.minWidth <= (width - (e.pageX - mouseX));

        self.modal.style.bottom = bottom + 'px';
        if (checkMinHieght) self.modal.style.height = height - (e.pageY - mouseY) + 'px';
        self.modal.style.top = '';

        self.modal.style.right = right + 'px';
        if (checkMinWidth) self.modal.style.width = width - (e.pageX - mouseX) + 'px';
        self.modal.style.left = '';
      };
    });

    (this.sizers && window).addEventListener('mouseup', function() {
      if (!self.snapped) storeSize.call(self);
      window.onmousemove = null;
    });

  };

  function drag() {
    var self = this;

    this.head.style.cursor = 'move';

    this.head.addEventListener('mousedown', function(e) {
      e.preventDefault();

      var mousePosX = e.clientX,
          mousePosY = e.clientY,
          modalPosTop = getElProp(self.modal).top,
          modalPosLeft = getElProp(self.modal).left;

      self.expanded = false;

      applySize.call(self);

      if (self.snapped) {
        self.modal.style.left = e.clientX - (getElProp(self.modal).width / 2) + 'px';
        modalPosLeft = getElProp(self.modal).left;
      }

      window.onmousemove = function(e) {

        e.preventDefault();

        self.modal.style.top = modalPosTop + (e.clientY - mousePosY) + 'px';
        self.modal.style.left = modalPosLeft + (e.clientX - mousePosX) + 'px';

        if (e.pageX <= 0 || e.pageY <= 0 || e.pageX >= (window.innerWidth - 5)) {
          indicatorPos.call(self, e);
        } else {
          self.indicator.classList.remove('osm-indicator--show');
        }

      }
    });

    window.addEventListener('mouseup', function(e){
      window.onmousemove = null;

      if (e.pageX <= 0) {
        snap.call(self, 'left');
      } else if (e.pageY <= 0) {
        snap.call(self, 'top');
      } else if (e.pageX >= (window.innerWidth - 5)) {
        snap.call(self, 'right');
      } else {
        self.snapped = false;
      }
    });
  }


  function snap(pos) {
    storeSize.call(this);

    this.modal.style.height = '100%';
    this.modal.style.top = '0';

    if (pos === 'left') {
      this.modal.style.width = '50%';
      this.modal.style.left = '0';
    } else if (pos === 'top') {
      expand.call(this);
    } else if (pos === 'right') {
      this.modal.style.width = '50%';
      this.modal.style.left = '50%';
    }

    this.indicator.classList.remove('osm-indicator--show');
    window.onmousemove = null;
    this.snapped = true;
  }


  function indicatorPos(e) {
    var self = this;
    this.indicator.classList.add('osm-indicator--show');
    self.indicator.style.top = e.clientY - (getElProp(self.indicator).height / 2) + 'px';
    self.indicator.style.left = e.clientX - (getElProp(self.indicator).width / 2) + 'px';
  }


  function expand() {
    storeSize.call(this);
    storePosition.call(this);
    this.expBtn.title = this.options.restoreButtonLabel;

    this.modal.style.height = '100%';
    this.modal.style.width = '100%';
    this.modal.style.top = '0';
    this.modal.style.left = '0';

    this.snapped = true;
    this.expanded = true;
  }


  function restore() {
    applySize.call(this);
    applyPosition.call(this);
    this.expBtn.title = this.options.expandButtonLabel;
    this.expanded = false;
  }


  function dock() {
    storeSize.call(this);
    storePosition.call(this);
    this.modal.style.top = (window.innerHeight - getElProp(this.head).height) + 'px';
    this.modal.style.left = '0';
    this.docked = true;
  }


  function undock() {
    applySize.call(this);
    applyPosition.call(this);
    this.docked = false;
  }


  function storeSize() {
    this.options.height = getElProp(this.modal).height;
    this.options.width = getElProp(this.modal).width;
  }


  function applySize() {
    this.modal.style.height = this.options.height + 'px';
    this.modal.style.width = this.options.width + 'px';
  }


  function storePosition() {
    this.options.top = getElProp(this.modal).top;
    this.options.left = getElProp(this.modal).left;
  }


  function applyPosition() {
    this.modal.style.top = this.options.top + 'px';
    this.modal.style.left = this.options.left + 'px';
  }


  function getElProp(element) {
    var rect = element.getBoundingClientRect(),
        windowHeight = window.innerHeight,
        windowWidth = window.innerWidth;

    return {
      height: rect.height,
      width: rect.width,
      top: rect.top,
      right: windowWidth - rect.right,
      bottom: windowHeight - rect.bottom,
      left: rect.left
    };
  }


  function createEl(el, cl, ap) {
    var x;
    x = document.createElement(el);
    x.className = cl;
    if (ap) {
      ap.appendChild(x);
    }
    return x;
  }


  function extendDefaults (defaults, settings) {
    var property;

    for (property in settings) {
      if (settings.hasOwnProperty(property)) {
        defaults[property] = settings[property];
      }
    }

    return defaults;
  }


  function initialiteEvents () {
    this.clsBtn.addEventListener('click', this.close.bind(this));
    this.minBtn.addEventListener('click', this.dock.bind(this));
    this.expBtn.addEventListener('click', this.expand.bind(this));
  }




  window.osmodal = function (selector, settings) {
    return new Modal(selector, settings);
  };
})();
