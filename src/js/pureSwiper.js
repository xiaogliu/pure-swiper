/**
 * swiper 无限滚动
 */
class PureSwiper {
  constructor(options) {
    // default params
    const defaultOptions = {
      containerWidth: undefined,
      delay: 4000,
    };
    this.options = Object.assign(defaultOptions, options);

    this.swiper = document.querySelector('#pureSwiper');
    this.swiperContainer = document.querySelector('#swiperContainer');
    this.pages = document.querySelectorAll('.page');
    this.pages = Array.prototype.slice.call(this.pages);

    this.pagesNum = this.pages.length;
    this.pageWidth =
      this.options.containerWidth || document.documentElement.clientWidth;
    this.swiper.style.width = `${this.pageWidth}px`;
    this.pages.forEach(e => {
      e.style.width = `${this.pageWidth}px`;
    });

    this.currentContainerLeft = -this.pageWidth;
    this.swiperContainer.style.transform = `translate3d(${
      this.currentContainerLeft
    }px, 0, 0)`;

    this.navDots = [];
    this.newPages = [];
    this.startX = 0;
    this.timer = undefined;
    this.autoPlayTimer = undefined;
    this.TRANSITION_TIME = 400;
    this.DELAY = this.options.delay;
  }

  // window resize 时重新获取位置
  getNewPosition() {
    this.pageWidth = document.documentElement.clientWidth;
    this.swiper.style.width = `${this.pageWidth}px`;
    this.newPages.forEach(e => {
      e.style.width = `${this.pageWidth}px`;
    });

    let activeNavIndex;
    this.navDots.forEach((e, i) => {
      if (e.classList.contains('active')) {
        activeNavIndex = i + 1;
      }
    });

    this.currentContainerLeft = -(activeNavIndex * this.pageWidth);
    this.swiperContainer.style.transform = `translate3d(${
      this.currentContainerLeft
    }px, 0, 0)`;
  }

  handleWindowResize(event) {
    // 设置防抖动函数
    utils.debounce(this.getNewPosition, this, event, 500);
  }

  // 手机滑动结束
  touchEnd(event) {
    this.autoPlay();
    const endX = event.changedTouches[0].pageX;
    // 判断手指移动方向
    if (endX - this.startX > 1) {
      // 向前移动
      this.movePage(this.pageWidth, -this.pageWidth * this.pagesNum);
    } else if (endX - this.startX < -1) {
      // 向后移动
      this.movePage(-this.pageWidth, -this.pageWidth);
    }
  }

  turnPage(position) {
    this.swiperContainer.style.transitionDuration = `${this.TRANSITION_TIME}ms`;
    this.swiperContainer.style.transform = `translate3d(${position}px, 0, 0)`;
  }

  movePage(offsetWidth, moveTo) {
    // 调整位置
    const adjustPosition = () => {
      this.swiperContainer.style.transitionDuration = '0ms';

      // 超出lastPage，moveTo -this.pageWidth；超出firstPage，moveTo -this.pageWidth * this.pagesNum
      this.currentContainerLeft = moveTo;
      this.swiperContainer.style.transform = `translate3d(${moveTo}px, 0, 0)`;
      this.changeNavStyle();
    };

    // 避免前后快速滑动出现白屏
    if (
      (this.currentContainerLeft > -this.pageWidth && this.timer) ||
      (this.currentContainerLeft < -this.pageWidth * this.pagesNum &&
        this.timer)
    ) {
      clearTimeout(this.timer);
      adjustPosition();
      return;
    }

    // 正常移动page
    this.currentContainerLeft += offsetWidth;
    this.turnPage(this.currentContainerLeft);

    // 滑动到最前最后调整page
    if (
      this.currentContainerLeft > -this.pageWidth ||
      this.currentContainerLeft < -this.pageWidth * this.pagesNum
    ) {
      this.timer = setTimeout(adjustPosition, this.TRANSITION_TIME);
    } else {
      // 这里要 bind this ！！！！！！
      this.timer = setTimeout(
        this.changeNavStyle.bind(this),
        this.TRANSITION_TIME,
      );
    }
  }

  changeNavStyle() {
    this.navDots.forEach(el => {
      utils.deleteClassName(el, 'active');
    });

    const i = -this.currentContainerLeft / this.pageWidth;
    this.navDots[i - 1].classList.add('active');
  }

  createNav() {
    const nav = document.createElement('div');
    nav.classList.add('nav');
    this.swiperContainer.parentElement.appendChild(nav);

    for (let i = 0; i < this.pagesNum; i++) {
      nav.innerHTML += '<p class="nav-dot"><span></span></p>';
    }

    const navDots = document.querySelectorAll('.nav-dot');
    this.navDots = Array.prototype.slice.call(navDots);

    // 初始化样式
    this.navDots[0].classList.add('active');

    // 非手机客户端添加点击事件
    this.navDots.forEach((el, i) => {
      el.addEventListener('click', () => {
        this.currentContainerLeft = -(i + 1) * this.pageWidth;

        clearInterval(this.autoPlayTimer);
        this.turnPage(this.currentContainerLeft);
        this.autoPlay();

        this.changeNavStyle();
      });
    });
  }

  copyPage() {
    // 处理前后页面：复制最后一页到第一页，复制第二页到最后一页
    const firstPage = this.pages[0].cloneNode(true);
    const lastPage = this.pages[this.pagesNum - 1].cloneNode(true);
    this.swiperContainer.appendChild(firstPage);
    this.swiperContainer.insertBefore(lastPage, this.pages[0]);

    // 增多的两页放到新数组
    this.newPages = Array.prototype.slice.call(this.pages);
    this.newPages.push(firstPage, lastPage);
  }

  autoPlay() {
    // 自动播放
    this.autoPlayTimer = setInterval(() => {
      this.movePage(-this.pageWidth, -this.pageWidth);
    }, this.DELAY);
  }

  init() {
    this.copyPage();
    this.createNav();
    this.autoPlay();

    // 手机触屏屏幕
    this.swiperContainer.addEventListener('touchstart', event => {
      clearInterval(this.autoPlayTimer);
      this.startX = event.touches[0].pageX;
    });
    const handleTouchEnd = utils.throttle(this.touchEnd, this, 500);
    this.swiperContainer.addEventListener('touchend', handleTouchEnd);

    // 如果指定宽度，不随窗口变化
    if (!this.options.containerWidth) {
      window.addEventListener('resize', this.handleWindowResize.bind(this));
    }
  }
}
