class Calendary{
  constructor(...proprities){
    this.tag = proprities[0];
    this.date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.i18n = navigator.language;
    this.todayTitle = 'Today';
    this.day = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    if(typeof proprities[0]!=='string'){
      this.tag = proprities[0].tag;
      this.date = proprities[0].date ? new Date(proprities[0].date) : this.date;
      this.i18n = proprities[0].i18n || this.i18n;
      this.todayTitle = proprities[0].todayTitle || this.todayTitle;
    }
    document.querySelectorAll(this.tag).forEach(item => {
      this.init(item);
    });
    document.addEventListener('click', (e) => {
      const _tag = e.target;
      if(_tag.classList.contains('calendary--input') || _tag.closest('.calendary')){
        if(_tag.closest('.calendary')){
          this.floatUpdate(_tag);
        } else {
          this.floatClose();
          this.floatBuild(_tag);
        }
      } else {
        this.floatClose();
      }
    });
  }
  init(tag){
    if(tag.constructor === HTMLInputElement){
      tag.classList.add('calendary--input');
    } else {
      this.build(tag);
      this.update(tag);
    }
  }
  floatClose(){
    if(document.querySelector('.calendary__axis')){
      document.querySelector('.calendary__axis').remove();
      document.querySelector('.calendary--focus').classList.remove('calendary--focus');
    }
  }
  floatUpdate(tag){
    const _input = document.querySelector('.calendary--focus'),
    _day = this.day = new Date(this.date.getFullYear(), this.date.getMonth(), tag.textContent);
    if(tag.classList.contains('calendary__square-day') && !tag.classList.contains('calendary__inactive')){
      if(_input.type==='date'){
        _input.value = `${_day.getFullYear()}-${_day.toLocaleString('en', {month: '2-digit'})}-${_day.toLocaleString('en', {day: '2-digit'})}`;
      } else {
        _input.value = _day.toLocaleString(this.i18n, {year: 'numeric', month: '2-digit', day: '2-digit' });
      }
      this.floatClose();
    }
  }
  floatBuild(tag){
    const _rect = tag.getBoundingClientRect(),
    _axisX = _rect.left < window.innerWidth/2 ? _rect.left : _rect.left + _rect.width,
    _axisY = _rect.top < window.innerHeight/2 ? _rect.top + _rect.height : _rect.top,
    _sideX = _rect.left < window.innerWidth/2 ? 'left' : 'right',
    _sideY = _rect.top < window.innerHeight/2 ? 'top' : 'bottom';
    document.body.insertAdjacentHTML('beforeend',`<div class="calendary__axis" style="left: ${_axisX}px;top: ${_axisY}px"><div class="calendary__float calendary__axis-${_sideX} calendary__axis-${_sideY}"></div></div>`);
    const _float = document.querySelector('.calendary__float');
    this.build(_float);
    this.update(_float);
    tag.classList.add('calendary--focus');
  }
  build(tag){
    tag.classList.add('calendary');
    tag.insertAdjacentHTML('beforeend','<div class="calendary__header"><button class="calendary__button calendary__button-prev"></button><div class="calendary__year"></div><button class="calendary__button calendary__button-next"></button></div><div class="calendary__week"></div><div class="calendary__content"></div>');
    for(let i=0;i<7;i++){
      tag.querySelector('.calendary__week').insertAdjacentHTML('beforeend',`<div class="calendary__square calendary__square-week">${new Date(0, 0, i+1).toLocaleString(this.i18n, {weekday: 'narrow'})}</div>`);
    }
    for(let i=0;i<42;i++){
      tag.querySelector('.calendary__content').insertAdjacentHTML('beforeend','<div class="calendary__square calendary__square-day"></div>');
    }
    tag.querySelector('.calendary__button-prev').addEventListener('click', event => this.prev(tag));
    tag.querySelector('.calendary__button-next').addEventListener('click', event => this.next(tag));
  }
  update(tag){
    const _week = this.date.getDate() - this.date.getDay(),
    _today = tag.querySelector('.calendary__square-today');
    tag.querySelector('.calendary__year').textContent = `${this.date.toLocaleString(this.i18n, {month: 'long'})} ${this.date.getFullYear()}`;
    if(_today){
    console.log(_today);
      _today.removeAttribute('title');
      _today.classList.remove('calendary__square-today');
    }
    this.classInactive = 1;
    for(let i=0;i<42;i++){
      let _time = new Date(this.date.getFullYear(), this.date.getMonth(), i + _week),
      _day = _time.getDate(),
      _square = tag.querySelectorAll('.calendary__square-day')[i];
      _square.classList.remove('calendary__inactive');
      if(this.day.getTime() === _time.getTime()){
        console.log(this.todayTitle);
        _square.title = this.todayTitle;
        _square.classList.add('calendary__square-today');
      }
      _square.textContent = _day;
      if(_day===1){
        this.classInactive = this.classInactive ? 0 : 1;
      }
      if(this.classInactive){
        _square.classList.add('calendary__inactive');
      }
    }
  }
  next(tag){
    this.date = new Date(this.date.getFullYear(), this.date.getMonth()+1, this.date.getDate());
    this.update(tag);
  }
  prev(tag){
    this.date = new Date(this.date.getFullYear(), this.date.getMonth()-1, this.date.getDate());
    this.update(tag);
  }
}