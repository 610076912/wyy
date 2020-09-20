import {Lyric} from '../../../../service/data-types/common.types';
import {from, Subject, zip} from 'rxjs';
import {skip} from 'rxjs/operators';

export interface BaseLyricLine {
  txt: string;
  txtCn: string;
}

export interface LyricLine extends BaseLyricLine {
  time: number;
}

export interface Handler extends BaseLyricLine {
  lineNum: number;
}


// [00:04.050]
const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

export class WyLyric {
  private playing = false;
  private lrc: Lyric;
  private curNum: number;
  private startStamp: number;
  private timer: number;
  private pauseStamp: number;
  handler = new Subject<Handler>();
  lines: LyricLine[] = [];

  constructor(lrc: Lyric) {
    this.lrc = lrc;
    this.init();
  }

  private init(): void {
    if (this.lrc.tlyric) {
      this.generTLyric();
    } else {
      this.generLyric();
    }
  }

  // [00:12.570]难以忘记初次见你
  // 解析只有中文的歌词
  private generLyric(): void {
    const lines = this.lrc.lyric.split('\n');
    lines.forEach(line => this.makeLine(line));
  }

  // 解析有翻译的歌词
  private generTLyric(): void {
    const lines = this.lrc.lyric.split('\n');
    const tlines = this.lrc.tlyric.split('\n').filter(item => timeExp.exec(item) !== null);
    // console.log('tlines:', tlines);
    // 始终要把短的歌词往长的歌词上对应
    const moreLine = lines.length - tlines.length;
    let tempArr = [];
    if (moreLine >= 0) {
      tempArr = [lines, tlines];
    } else {
      tempArr = [tlines, lines];
    }
    // 短歌词的第一个时间
    const first = timeExp.exec(tempArr[1])[0];
    // console.log('first:', first);
    const skipIndex = tempArr[0].findIndex(item => {
      const exec = timeExp.exec(item);
      if (exec) {
        return exec[0] === first;
      }
    });
    const _skip = skipIndex === -1 ? 0 : skipIndex;
    // 截取出多的歌词行
    const skipItem = tempArr[0].slice(0, _skip);
    if (skipItem.length) {
      skipItem.forEach(item => this.makeLine(item));
    }
    // 将原歌词和翻译歌词转成流并且合并发出
    let zipLines$;
    if (moreLine > 0) {
      zipLines$ = zip(from(lines).pipe(skip(_skip)), from(tlines));
    } else {
      zipLines$ = zip(from(tlines), from(lines).pipe(skip(_skip)));
    }
    zipLines$.subscribe(([line, tline]) => {
      this.makeLine(line, tline);
    });
  }

  // 将歌词字符串用正则 解析成对象
  private makeLine(line: string, tline = ''): void {
    const result = timeExp.exec(line);
    if (result) {
      const txt = line.replace(timeExp, '').trim();
      const txtCn = tline ? tline.replace(timeExp, '').trim() : '';
      if (txt) {
        const thirdResult = result[3] || '0';
        const len = thirdResult.length;
        const _thirdResult = len > 2 ? Number(thirdResult) : Number(thirdResult) * 10;
        const time = Number(result[1]) * 60 * 1000 + Number(result[2]) * 1000 + _thirdResult;
        this.lines.push({txt, txtCn, time});
      }
    }
  }

  /*
  * todo 当当前播放的歌曲（currentSong）和播放状态(playing)改变时 调用此方法
  *  然后根据传入的当前歌曲播放时间 计算出 当前是那句歌词，递归暴露出去。
  * */
  play(startTime = 0): void {
    console.log('this.playing:', this.playing);
    if (!this.lines.length) {
      return;
    }
    if (!this.playing) {
      this.playing = true;
    }
    this.curNum = this.findCurNum(startTime);
    // todo 记录一个时间戳， 该时间戳为歌曲开始播放的时间。
    this.startStamp = Date.now() - startTime;
    // this.callHandler();
    if (this.curNum < this.lines.length) {
      clearTimeout(this.timer);
      this.playReset();
    }
  }

  private playReset(): void {
    const line = this.lines[this.curNum];
    // todo 用当前时间的下一句歌词时间，减去 歌曲播放的时间，就是该句歌词应该停留的时间。
    // todo 这里我觉得用下句歌词的开始时间减去上句歌词的开始时间， 就是上句歌词该停留的时间。
    const delay = line.time - (Date.now() - this.startStamp);
    this.timer = setTimeout(() => {
      this.callHandler(this.curNum++);
      if (this.curNum < this.lines.length && this.playing) {
        this.playReset();
      }
    }, delay);
  }

  private callHandler(i: number): void {
    this.handler.next({
      txt: this.lines[i].txt,
      txtCn: this.lines[i].txtCn,
      lineNum: i
    });
  }

  private findCurNum(time: number): number {
    const index = this.lines.findIndex(item => item.time >= time);
    return index === -1 ? this.lines.length - 1 : index;
  }

  togglePlay(playing: boolean): void {
    const now = Date.now();
    this.playing = playing;
    if (playing) {
      const startTime = (this.pauseStamp || now) - (this.startStamp || now);
      this.play(startTime);
    } else {
      this.stop();
      this.pauseStamp = null;
    }
  }

  stop(): void {
    if (this.playing) {
      this.playing = false;
      clearTimeout(this.timer);
    }
  }
}
