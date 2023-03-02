//audio is the html audio component that
//has been loaded

class AudioContextPlus {
  //we really only want to
  //instantiate this thing once
  //and then update which audio source
  //is connected/which file is playing

  audioHTML;
  AC; //AudioContext
  AA; //analyser
  lastNonZeroData = null;
  initialized = false;
  AudioSource = null;
  canVisualize = false;
  isPlaying = false;
  started = false;
  currentPlayPosition = 0;
  audioBuffers = {};
  sources = [];
  gainNodes = [];

  constructor() {
    this.init();
  }

  init() {
    this.AC = new AudioContext();
    this.AA = this.AC.createAnalyser();
    this.AA.fftSize = 2048;
    this.AA.connect(this.AC.destination);

    if (this.AC) this.initialized = true;
  }

  changeAudio(audioHTML) {
    if (!this.initialized) {
      this.init();
    }

    //we can only createMediaElementSource once but we need an audio
    //element, so wait for just the first time
    if (!this.AudioSource && this.canVisualize)
      this.AudioSource = this.AC.createMediaElementSource(audioHTML);
    //once we connect an audio element to createMediaElementSource
    //it is stuck there forever, good news is that we can
    //create a different audio element to deal with it

    if (this.canVisualize) {
      console.log(" connecting new audio ", audioHTML);
      this.AudioSource.connect(this.AA);
      this.AA.connect(this.AC.destination);
    } else {
      //disconnecting/deleting does not prevent
      //the AudioSource from getting Cors error once it
      //has already been connected once to analyzer
    }
  }

  getTimeDomainData() {
    if (this.AA && this.initialized) {
      let dataArray = new Uint8Array(this.AA.fftSize);
      this.AA.getByteTimeDomainData(dataArray);
      return dataArray;
    }
    return null;
  }

  getFrequencyData() {
    if (this.AA && this.initialized) {
      let dataArray = new Uint8Array(this.AA.fftSize);
      this.AA.getByteFrequencyData(dataArray);
      return dataArray;
    }
    return null;
  }
  //would it be worth it to get Float32 data?

  saveGoodData(nonZeroData) {
    this.lastNonZeroData = [...nonZeroData];
    //console.log('zzzzzzzz',this.lastNonZeroData[10])
  }

  setCanVisualize(input) {
    this.canVisualize = input;
  }

  async createAudioBuffers(data, audio, filename) {

    //this is called sometimes when data is undefined
    if ( typeof data==="undefined") return

    //atob is base64 string to binary
    //formData PUT with an audio file runs btoa at some point
    const raw = window.atob(data);

    const ab = new ArrayBuffer(raw.length);
    //ab is the backing store for binaryData

    const binaryData = new Uint8Array(ab);
    for (let i = 0; i < raw.length; i++) {
      binaryData[i] = raw.charCodeAt(i);
    }

    // const blob = new Blob([binaryData], { type: "audio/mpeg" });

    //we do not need the blob and regular audio elements if we
    //are sending the binary array buffers straight to audio context
    //this is just for playing around
    // const audioURL = window.URL.createObjectURL(blob);
    // audio.src = audioURL;

    //here is the AudioContext way of doing things with sound...

    //wait for both with Promises.all at some point

    // save them so we can use them later on button click
    this.audioBuffers[filename] = await this.AC.decodeAudioData(ab);
  }
  setGain(value, index) {
    this.gainNodes[index].gain.value = value;
  }
  addGainNode() {
    const gainNode = this.AC.createGain();
    //all audio source/effect/control nodes connect to Analyser before speakers
    gainNode.connect(this.AA)
    this.gainNodes.push(gainNode);
  }
  playSound(source, gainNode, time, fudge) {
    // connect to gainNodes to control relative volume
    source.connect(gainNode);
    source.start(time, Math.max(this.currentPlayPosition + fudge, 0));
  }
  loadSources(fileNames) {
    this.sources.length = 0; //reset the array
    fileNames.forEach((fileName) => {
      const src = this.AC.createBufferSource();
      src.buffer = this.audioBuffers[fileName];
      this.sources.push(src);
      this.addGainNode();
    });
  }
  async playNSongs(fileNames, onEndCallback) {
    if (this.isPlaying) {
      this.isPlaying = false;
      await this.AC.suspend();
      return;
    }
    // controls all specified songs at once
    this.AC.resume();
    this.isPlaying = true;
    if (!this.started) {
      const startTime = this.AC.currentTime + 0.5;
      this.loadSources(fileNames);

      this.sources.forEach((source, i) => {
        const gainNode = this.gainNodes[i];
        this.playSound(source, gainNode, startTime, 0);
      });
      this.started = true;

      // if tracks have duration info then put on end callback
      // on the track with the longest duration, otherwise just
      // use the first track
      const durations = this.sources.map((x) => x.buffer.duration);
      const idx = durations.indexOf(Math.max(...durations));
      if (idx !== -1) {
        this.sources[idx].onended = onEndCallback;
      } else {
        this.sources[0].onended = onEndCallback;
      }
    }
  }

  musicData() {
    const freqBins = this.getFrequencyData();
    const waveForm = this.getTimeDomainData();

    let sum = 0,
      sumLow = 0,
      sumMid = 0,
      sumHigh = 0;
    let wsum1 = 0,
      wsum2 = 0;
    for (let i = 0; i < 200; i++) {
      sum += freqBins[i];
      if (i < 50) {
        sumLow += freqBins[i];
        wsum1 += waveForm[i];
      } else if (i < 100) {
        sumMid += freqBins[i];
        wsum2 += waveForm[i];
      } else {
        sumHigh += freqBins[i];
      }
    }
    sum /= 10000;

    wsum1 /= 30000;
    wsum2 /= 30000;
    sumLow /= 2000;
    sumMid /= 3000;
    sumHigh /= 5000;
    sum *= 1.3;

    return { sum, sumLow, sumMid, sumHigh, wsum1, wsum2 };
  }
}

export default AudioContextPlus;
